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
    CONF_ENABLE_DEBUG_LOGGING,
    CONF_MASTER_NAME,
    CONF_SLAVE_ENTITIES,
    CONF_SYNC_ENABLED_DEFAULT,
    CONF_SYNC_ON_ENABLE,
    CONF_TRANSITION_TIME,
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
        return LightSyncMasterOptionsFlow(config_entry)


class LightSyncMasterOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Manage options - show menu."""
        return self.async_show_menu(
            step_id="init",
            menu_options=["modify_slaves", "behavior", "advanced"],
        )

    async def async_step_modify_slaves(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Modify slave lights."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # update config entry data
            self.hass.config_entries.async_update_entry(
                self.config_entry,
                data={
                    **self.config_entry.data,
                    CONF_SLAVE_ENTITIES: user_input[CONF_SLAVE_ENTITIES],
                },
            )
            return self.async_create_entry(title="", data={})

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
            # update options
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="behavior",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_SYNC_ENABLED_DEFAULT,
                    default=self.config_entry.options.get(
                        CONF_SYNC_ENABLED_DEFAULT,
                        DEFAULT_SYNC_ENABLED
                    )
                ): cv.boolean,
                vol.Required(
                    CONF_SYNC_ON_ENABLE,
                    default=self.config_entry.options.get(
                        CONF_SYNC_ON_ENABLE,
                        DEFAULT_SYNC_ON_ENABLE
                    )
                ): cv.boolean,
            }),
            errors=errors,
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
                # update options
                return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="advanced",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_TRANSITION_TIME,
                    default=self.config_entry.options.get(
                        CONF_TRANSITION_TIME,
                        DEFAULT_TRANSITION_TIME
                    )
                ): vol.All(
                    vol.Coerce(float),
                    vol.Range(min=0.0, max=10.0)
                ),
                vol.Required(
                    CONF_ENABLE_DEBUG_LOGGING,
                    default=self.config_entry.options.get(
                        CONF_ENABLE_DEBUG_LOGGING,
                        False
                    )
                ): cv.boolean,
            }),
            errors=errors,
        )
