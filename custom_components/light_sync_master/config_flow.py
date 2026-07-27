"""Config flow for Light Sync Master."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.components.light import DOMAIN as LIGHT_DOMAIN
from homeassistant.core import callback
from homeassistant.helpers import selector
import homeassistant.helpers.config_validation as cv

from .const import (
    BRIGHTNESS_MODE_CAP,
    BRIGHTNESS_MODE_FOLLOW,
    BRIGHTNESS_MODE_SCALE,
    CONF_AREA_CONFIG,
    CONF_AREA_ID,
    CONF_BRIGHTNESS_MODE,
    CONF_BRIGHTNESS_VALUE,
    CONF_ENABLE_DEBUG_LOGGING,
    CONF_MASTER_NAME,
    CONF_PER_AREA_TOGGLES,
    CONF_SLAVE_ENTITIES,
    CONF_SYNC_BRIGHTNESS,
    CONF_SYNC_COLOR,
    CONF_SYNC_COLOR_TEMP,
    CONF_SYNC_ENABLED_DEFAULT,
    CONF_SYNC_ON_ENABLE,
    CONF_TRANSITION_TIME,
    DEFAULT_BRIGHTNESS_MODE,
    DEFAULT_BRIGHTNESS_VALUE,
    DEFAULT_PER_AREA_TOGGLES,
    DEFAULT_SYNC_BRIGHTNESS,
    DEFAULT_SYNC_COLOR,
    DEFAULT_SYNC_COLOR_TEMP,
    DEFAULT_SYNC_ENABLED,
    DEFAULT_SYNC_ON_ENABLE,
    DEFAULT_TRANSITION_TIME,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


class LightSyncMasterConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Light Sync Master."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize config flow."""
        self._name: str | None = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Handle initial step - name input."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # validate name
            name = user_input[CONF_MASTER_NAME].strip()

            if not name:
                errors[CONF_MASTER_NAME] = "invalid_name"
            else:
                # check for duplicate names
                await self.async_set_unique_id(name.lower().replace(" ", "_"))
                self._abort_if_unique_id_configured()

                self._name = name
                return await self.async_step_select_slaves()

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_MASTER_NAME, default="Master Light"): cv.string,
            }),
            errors=errors,
        )

    async def async_step_select_slaves(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Handle slave selection step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # create entry
            return self.async_create_entry(
                title=self._name,
                data={
                    CONF_MASTER_NAME: self._name,
                    CONF_SLAVE_ENTITIES: user_input[CONF_SLAVE_ENTITIES],
                },
                options={
                    CONF_TRANSITION_TIME: DEFAULT_TRANSITION_TIME,
                    CONF_SYNC_ENABLED_DEFAULT: DEFAULT_SYNC_ENABLED,
                    CONF_SYNC_ON_ENABLE: DEFAULT_SYNC_ON_ENABLE,
                    CONF_PER_AREA_TOGGLES: DEFAULT_PER_AREA_TOGGLES,
                    CONF_ENABLE_DEBUG_LOGGING: False,
                },
            )

        # get available lights
        available_lights = self._get_available_lights()

        if not available_lights:
            return self.async_abort(reason="no_lights_available")

        return self.async_show_form(
            step_id="select_slaves",
            data_schema=vol.Schema({
                vol.Required(CONF_SLAVE_ENTITIES, default=[]): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=LIGHT_DOMAIN,
                        multiple=True,
                    )
                ),
            }),
            errors=errors,
            description_placeholders={
                "master_name": self._name,
            },
        )

    def _get_available_lights(self) -> list[str]:
        """Get list of available light entities."""
        # get all light entities from hass
        all_lights = [
            entity_id
            for entity_id in self.hass.states.async_entity_ids(LIGHT_DOMAIN)
        ]

        return all_lights

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Get the options flow for this handler."""
        return LightSyncMasterOptionsFlow()


class LightSyncMasterOptionsFlow(config_entries.OptionsFlowWithReload):
    """Handle options flow.

    Inherits ``OptionsFlowWithReload`` so changing options automatically reloads
    the entry (rebuilding slaves and the per-area switches) with no manual reload.

    Do not store ``config_entry`` here: since HA 2024.11 ``OptionsFlow`` exposes
    it as a read-only property, so assigning ``self.config_entry`` raises
    ``AttributeError`` on HA 2026.x and broke the whole options page.
    """

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Manage options - show menu."""
        return self.async_show_menu(
            step_id="init",
            menu_options=["modify_slaves", "behavior", "areas", "advanced"],
        )

    async def async_step_modify_slaves(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Modify slave lights."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # update the slave list (stored in entry.data) and reload so the
            # coordinator and the per-area switches are rebuilt
            self.hass.config_entries.async_update_entry(
                self.config_entry,
                data={
                    **self.config_entry.data,
                    CONF_SLAVE_ENTITIES: user_input[CONF_SLAVE_ENTITIES],
                },
            )
            self.hass.config_entries.async_schedule_reload(
                self.config_entry.entry_id
            )
            # keep existing options untouched (returning data={} would wipe them)
            return self.async_create_entry(
                title="", data=dict(self.config_entry.options)
            )

        # get current slaves
        current_slaves = self.config_entry.data.get(CONF_SLAVE_ENTITIES, [])

        return self.async_show_form(
            step_id="modify_slaves",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_SLAVE_ENTITIES,
                    default=current_slaves
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=LIGHT_DOMAIN,
                        multiple=True,
                    )
                ),
            }),
            errors=errors,
            description_placeholders={
                "count": str(len(current_slaves)),
            },
        )

    async def async_step_behavior(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Configure sync behavior."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # merge with existing options so the advanced step's values survive
            return self.async_create_entry(
                title="",
                data={**dict(self.config_entry.options), **user_input},
            )

        return self.async_show_form(
            step_id="behavior",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_SYNC_ENABLED_DEFAULT,
                    default=(self.config_entry.options or {}).get(
                        CONF_SYNC_ENABLED_DEFAULT,
                        DEFAULT_SYNC_ENABLED
                    )
                ): cv.boolean,
                vol.Required(
                    CONF_SYNC_ON_ENABLE,
                    default=(self.config_entry.options or {}).get(
                        CONF_SYNC_ON_ENABLE,
                        DEFAULT_SYNC_ON_ENABLE
                    )
                ): cv.boolean,
                vol.Required(
                    CONF_PER_AREA_TOGGLES,
                    default=(self.config_entry.options or {}).get(
                        CONF_PER_AREA_TOGGLES,
                        DEFAULT_PER_AREA_TOGGLES
                    )
                ): cv.boolean,
            }),
            errors=errors,
        )

    async def async_step_areas(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Pick which area to configure for per-area sync."""
        coordinator = self.hass.data[DOMAIN][self.config_entry.entry_id]
        area_map = coordinator.get_area_map()

        if not area_map:
            return self.async_abort(reason="no_areas")

        if user_input is not None:
            self._area_id = user_input[CONF_AREA_ID]
            return await self.async_step_area_config()

        options = [
            {"value": area_id, "label": info["name"]}
            for area_id, info in sorted(
                area_map.items(), key=lambda kv: kv[1]["name"]
            )
        ]
        return self.async_show_form(
            step_id="areas",
            data_schema=vol.Schema({
                vol.Required(CONF_AREA_ID): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=options,
                        mode=selector.SelectSelectorMode.DROPDOWN,
                    )
                ),
            }),
        )

    async def async_step_area_config(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Configure per-area sync (which attributes + brightness mode)."""
        area_id = getattr(self, "_area_id", None)
        coordinator = self.hass.data[DOMAIN][self.config_entry.entry_id]
        area_name = coordinator.get_area_map().get(area_id, {}).get("name", area_id)
        current = (
            (self.config_entry.options or {}).get(CONF_AREA_CONFIG) or {}
        ).get(area_id, {})

        if user_input is not None:
            area_config = dict(
                (self.config_entry.options or {}).get(CONF_AREA_CONFIG) or {}
            )
            area_config[area_id] = {
                CONF_SYNC_BRIGHTNESS: user_input[CONF_SYNC_BRIGHTNESS],
                CONF_SYNC_COLOR: user_input[CONF_SYNC_COLOR],
                CONF_SYNC_COLOR_TEMP: user_input[CONF_SYNC_COLOR_TEMP],
                CONF_BRIGHTNESS_MODE: user_input[CONF_BRIGHTNESS_MODE],
                CONF_BRIGHTNESS_VALUE: int(user_input[CONF_BRIGHTNESS_VALUE]),
            }
            return self.async_create_entry(
                title="",
                data={
                    **dict(self.config_entry.options),
                    CONF_AREA_CONFIG: area_config,
                },
            )

        return self.async_show_form(
            step_id="area_config",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_SYNC_BRIGHTNESS,
                    default=current.get(CONF_SYNC_BRIGHTNESS, DEFAULT_SYNC_BRIGHTNESS),
                ): cv.boolean,
                vol.Required(
                    CONF_SYNC_COLOR,
                    default=current.get(CONF_SYNC_COLOR, DEFAULT_SYNC_COLOR),
                ): cv.boolean,
                vol.Required(
                    CONF_SYNC_COLOR_TEMP,
                    default=current.get(CONF_SYNC_COLOR_TEMP, DEFAULT_SYNC_COLOR_TEMP),
                ): cv.boolean,
                vol.Required(
                    CONF_BRIGHTNESS_MODE,
                    default=current.get(CONF_BRIGHTNESS_MODE, DEFAULT_BRIGHTNESS_MODE),
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=[
                            BRIGHTNESS_MODE_FOLLOW,
                            BRIGHTNESS_MODE_SCALE,
                            BRIGHTNESS_MODE_CAP,
                        ],
                        translation_key="brightness_mode",
                        mode=selector.SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Required(
                    CONF_BRIGHTNESS_VALUE,
                    default=current.get(CONF_BRIGHTNESS_VALUE, DEFAULT_BRIGHTNESS_VALUE),
                ): vol.All(vol.Coerce(int), vol.Range(min=0, max=100)),
            }),
            description_placeholders={"area": area_name},
        )

    async def async_step_advanced(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Configure advanced options."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # validate transition time
            if not 0.0 <= user_input[CONF_TRANSITION_TIME] <= 10.0:
                errors[CONF_TRANSITION_TIME] = "invalid_transition_time"
            else:
                # merge with existing options so the behavior step's values survive
                return self.async_create_entry(
                    title="",
                    data={**dict(self.config_entry.options), **user_input},
                )

        return self.async_show_form(
            step_id="advanced",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_TRANSITION_TIME,
                    default=(self.config_entry.options or {}).get(
                        CONF_TRANSITION_TIME,
                        DEFAULT_TRANSITION_TIME
                    )
                ): vol.All(
                    vol.Coerce(float),
                    vol.Range(min=0.0, max=10.0)
                ),
                vol.Required(
                    CONF_ENABLE_DEBUG_LOGGING,
                    default=(self.config_entry.options or {}).get(
                        CONF_ENABLE_DEBUG_LOGGING,
                        False
                    )
                ): cv.boolean,
            }),
            errors=errors,
        )
