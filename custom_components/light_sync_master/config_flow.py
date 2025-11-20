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
    CONF_SCHEDULES,
    CONF_SCHEDULE_BRIGHTNESS,
    CONF_SCHEDULE_ENABLED,
    CONF_SCHEDULE_FROM_OFFSET,
    CONF_SCHEDULE_FROM_TIME,
    CONF_SCHEDULE_FROM_TYPE,
    CONF_SCHEDULE_NAME,
    CONF_SCHEDULE_RGB_COLOR,
    CONF_SCHEDULE_TO_OFFSET,
    CONF_SCHEDULE_TO_TIME,
    CONF_SCHEDULE_TO_TYPE,
    CONF_SCHEDULE_WEEKDAYS,
    CONF_SLAVE_ENTITIES,
    CONF_SYNC_ENABLED_DEFAULT,
    CONF_SYNC_ON_ENABLE,
    CONF_TRANSITION_TIME,
    DEFAULT_SYNC_ENABLED,
    DEFAULT_SYNC_ON_ENABLE,
    DEFAULT_TRANSITION_TIME,
    DOMAIN,
    SCHEDULE_TYPE_SUNRISE,
    SCHEDULE_TYPE_SUNSET,
    SCHEDULE_TYPE_TIME,
    WEEKDAYS,
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
        self._schedule_index: int | None = None

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Manage options - show menu."""
        return self.async_show_menu(
            step_id="init",
            menu_options=["modify_slaves", "behavior", "advanced", "schedules"],
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

    async def async_step_schedules(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Manage color schedules."""
        schedules = self.config_entry.options.get(CONF_SCHEDULES, [])

        # Build menu with fixed options
        menu_options = ["add_schedule"]

        if schedules:
            menu_options.extend(["edit_schedule", "delete_schedule"])

        return self.async_show_menu(
            step_id="schedules",
            menu_options=menu_options,
        )

    async def async_step_add_schedule(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Add a new color schedule."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # Validate schedule
            schedule_data = {
                CONF_SCHEDULE_NAME: user_input[CONF_SCHEDULE_NAME],
                CONF_SCHEDULE_FROM_TYPE: user_input[CONF_SCHEDULE_FROM_TYPE],
                CONF_SCHEDULE_FROM_TIME: user_input.get(CONF_SCHEDULE_FROM_TIME),
                CONF_SCHEDULE_FROM_OFFSET: user_input.get(CONF_SCHEDULE_FROM_OFFSET, 0),
                CONF_SCHEDULE_TO_TYPE: user_input[CONF_SCHEDULE_TO_TYPE],
                CONF_SCHEDULE_TO_TIME: user_input.get(CONF_SCHEDULE_TO_TIME),
                CONF_SCHEDULE_TO_OFFSET: user_input.get(CONF_SCHEDULE_TO_OFFSET, 0),
                CONF_SCHEDULE_RGB_COLOR: user_input[CONF_SCHEDULE_RGB_COLOR],
                CONF_SCHEDULE_BRIGHTNESS: user_input[CONF_SCHEDULE_BRIGHTNESS],
                CONF_SCHEDULE_WEEKDAYS: user_input[CONF_SCHEDULE_WEEKDAYS],
                CONF_SCHEDULE_ENABLED: user_input.get(CONF_SCHEDULE_ENABLED, True),
            }

            # Validate times if type is "time"
            if schedule_data[CONF_SCHEDULE_FROM_TYPE] == SCHEDULE_TYPE_TIME:
                if not schedule_data[CONF_SCHEDULE_FROM_TIME]:
                    errors[CONF_SCHEDULE_FROM_TIME] = "time_required"
            
            if schedule_data[CONF_SCHEDULE_TO_TYPE] == SCHEDULE_TYPE_TIME:
                if not schedule_data[CONF_SCHEDULE_TO_TIME]:
                    errors[CONF_SCHEDULE_TO_TIME] = "time_required"

            # Check for overlaps with existing schedules
            if not errors:
                schedules = self.config_entry.options.get(CONF_SCHEDULES, [])
                if self._check_schedule_overlap(schedule_data, schedules):
                    errors["base"] = "schedule_overlap"

            if not errors:
                # Add to schedules list
                schedules = self.config_entry.options.get(CONF_SCHEDULES, [])
                schedules.append(schedule_data)
                
                # Update options
                new_options = {**self.config_entry.options}
                new_options[CONF_SCHEDULES] = schedules
                
                return self.async_create_entry(title="", data=new_options)

        # Build form schema
        return self.async_show_form(
            step_id="add_schedule",
            data_schema=vol.Schema({
                vol.Required(CONF_SCHEDULE_NAME): cv.string,
                vol.Required(CONF_SCHEDULE_FROM_TYPE, default=SCHEDULE_TYPE_TIME): vol.In({
                    SCHEDULE_TYPE_TIME: "Time",
                    SCHEDULE_TYPE_SUNRISE: "Sunrise",
                    SCHEDULE_TYPE_SUNSET: "Sunset",
                }),
                vol.Optional(CONF_SCHEDULE_FROM_TIME): cv.string,
                vol.Optional(CONF_SCHEDULE_FROM_OFFSET, default=0): vol.All(
                    vol.Coerce(int),
                    vol.Range(min=-480, max=480)  # +/- 8 hours in minutes
                ),
                vol.Required(CONF_SCHEDULE_TO_TYPE, default=SCHEDULE_TYPE_TIME): vol.In({
                    SCHEDULE_TYPE_TIME: "Time",
                    SCHEDULE_TYPE_SUNRISE: "Sunrise",
                    SCHEDULE_TYPE_SUNSET: "Sunset",
                }),
                vol.Optional(CONF_SCHEDULE_TO_TIME): cv.string,
                vol.Optional(CONF_SCHEDULE_TO_OFFSET, default=0): vol.All(
                    vol.Coerce(int),
                    vol.Range(min=-480, max=480)
                ),
                vol.Required(CONF_SCHEDULE_RGB_COLOR, default=[255, 255, 255]): selector.ColorRGBSelector(),
                vol.Required(CONF_SCHEDULE_BRIGHTNESS, default=255): vol.All(
                    vol.Coerce(int),
                    vol.Range(min=1, max=255)
                ),
                vol.Required(CONF_SCHEDULE_WEEKDAYS, default=[0,1,2,3,4,5,6]): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=[
                            {"value": str(day), "label": WEEKDAYS[day].capitalize()}
                            for day in range(7)
                        ],
                        multiple=True,
                        mode=selector.SelectSelectorMode.LIST,
                    )
                ),
                vol.Required(CONF_SCHEDULE_ENABLED, default=True): cv.boolean,
            }),
            errors=errors,
        )

    def _check_schedule_overlap(
        self, new_schedule: dict[str, Any], existing_schedules: list[dict[str, Any]]
    ) -> bool:
        """Check if new schedule overlaps with existing schedules."""
        # For simplicity, we check if schedules share weekdays
        # A more sophisticated check would compare actual times
        new_weekdays = set(new_schedule[CONF_SCHEDULE_WEEKDAYS])
        
        for schedule in existing_schedules:
            # Skip disabled schedules
            if not schedule.get(CONF_SCHEDULE_ENABLED, True):
                continue
                
            existing_weekdays = set(schedule[CONF_SCHEDULE_WEEKDAYS])
            
            # If they share weekdays, consider it an overlap for now
            if new_weekdays & existing_weekdays:
                return True
        
        return False

    async def async_step_edit_schedule(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Select which schedule to edit."""
        schedules = self.config_entry.options.get(CONF_SCHEDULES, [])

        if user_input is not None:
            # User selected a schedule to edit
            self._schedule_index = int(user_input["schedule_index"])
            return await self.async_step_edit_schedule_form()

        # Build schedule options
        schedule_options = {
            str(idx): f"{schedule.get(CONF_SCHEDULE_NAME, f'Schedule {idx+1}')}"
            for idx, schedule in enumerate(schedules)
        }

        return self.async_show_form(
            step_id="edit_schedule",
            data_schema=vol.Schema({
                vol.Required("schedule_index"): vol.In(schedule_options),
            }),
        )

    async def async_step_edit_schedule_form(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Edit selected schedule."""
        schedules = self.config_entry.options.get(CONF_SCHEDULES, [])
        schedule = schedules[self._schedule_index]
        errors: dict[str, str] = {}

        if user_input is not None:
            # Update schedule
            updated_schedule = {
                CONF_SCHEDULE_NAME: user_input[CONF_SCHEDULE_NAME],
                CONF_SCHEDULE_FROM_TYPE: user_input[CONF_SCHEDULE_FROM_TYPE],
                CONF_SCHEDULE_FROM_TIME: user_input.get(CONF_SCHEDULE_FROM_TIME),
                CONF_SCHEDULE_FROM_OFFSET: user_input.get(CONF_SCHEDULE_FROM_OFFSET, 0),
                CONF_SCHEDULE_TO_TYPE: user_input[CONF_SCHEDULE_TO_TYPE],
                CONF_SCHEDULE_TO_TIME: user_input.get(CONF_SCHEDULE_TO_TIME),
                CONF_SCHEDULE_TO_OFFSET: user_input.get(CONF_SCHEDULE_TO_OFFSET, 0),
                CONF_SCHEDULE_RGB_COLOR: user_input[CONF_SCHEDULE_RGB_COLOR],
                CONF_SCHEDULE_BRIGHTNESS: user_input[CONF_SCHEDULE_BRIGHTNESS],
                CONF_SCHEDULE_WEEKDAYS: user_input[CONF_SCHEDULE_WEEKDAYS],
                CONF_SCHEDULE_ENABLED: user_input.get(CONF_SCHEDULE_ENABLED, True),
            }

            # Validate times
            if updated_schedule[CONF_SCHEDULE_FROM_TYPE] == SCHEDULE_TYPE_TIME:
                if not updated_schedule[CONF_SCHEDULE_FROM_TIME]:
                    errors[CONF_SCHEDULE_FROM_TIME] = "time_required"
            
            if updated_schedule[CONF_SCHEDULE_TO_TYPE] == SCHEDULE_TYPE_TIME:
                if not updated_schedule[CONF_SCHEDULE_TO_TIME]:
                    errors[CONF_SCHEDULE_TO_TIME] = "time_required"

            if not errors:
                # Check overlaps (excluding current schedule)
                other_schedules = [s for i, s in enumerate(schedules) if i != self._schedule_index]
                if self._check_schedule_overlap(updated_schedule, other_schedules):
                    errors["base"] = "schedule_overlap"

            if not errors:
                # Update schedules list
                schedules[self._schedule_index] = updated_schedule
                new_options = {**self.config_entry.options}
                new_options[CONF_SCHEDULES] = schedules
                
                self._schedule_index = None
                return self.async_create_entry(title="", data=new_options)

        # Show form with current values
        return self.async_show_form(
            step_id="edit_schedule_form",
            data_schema=vol.Schema({
                vol.Required(CONF_SCHEDULE_NAME, default=schedule.get(CONF_SCHEDULE_NAME, "")): cv.string,
                vol.Required(CONF_SCHEDULE_FROM_TYPE, default=schedule.get(CONF_SCHEDULE_FROM_TYPE, SCHEDULE_TYPE_TIME)): vol.In({
                    SCHEDULE_TYPE_TIME: "Time",
                    SCHEDULE_TYPE_SUNRISE: "Sunrise",
                    SCHEDULE_TYPE_SUNSET: "Sunset",
                }),
                vol.Optional(CONF_SCHEDULE_FROM_TIME, default=schedule.get(CONF_SCHEDULE_FROM_TIME)): cv.string,
                vol.Optional(CONF_SCHEDULE_FROM_OFFSET, default=schedule.get(CONF_SCHEDULE_FROM_OFFSET, 0)): vol.All(
                    vol.Coerce(int),
                    vol.Range(min=-480, max=480)
                ),
                vol.Required(CONF_SCHEDULE_TO_TYPE, default=schedule.get(CONF_SCHEDULE_TO_TYPE, SCHEDULE_TYPE_TIME)): vol.In({
                    SCHEDULE_TYPE_TIME: "Time",
                    SCHEDULE_TYPE_SUNRISE: "Sunrise",
                    SCHEDULE_TYPE_SUNSET: "Sunset",
                }),
                vol.Optional(CONF_SCHEDULE_TO_TIME, default=schedule.get(CONF_SCHEDULE_TO_TIME)): cv.string,
                vol.Optional(CONF_SCHEDULE_TO_OFFSET, default=schedule.get(CONF_SCHEDULE_TO_OFFSET, 0)): vol.All(
                    vol.Coerce(int),
                    vol.Range(min=-480, max=480)
                ),
                vol.Required(CONF_SCHEDULE_RGB_COLOR, default=schedule.get(CONF_SCHEDULE_RGB_COLOR, [255, 255, 255])): selector.ColorRGBSelector(),
                vol.Required(CONF_SCHEDULE_BRIGHTNESS, default=schedule.get(CONF_SCHEDULE_BRIGHTNESS, 255)): vol.All(
                    vol.Coerce(int),
                    vol.Range(min=1, max=255)
                ),
                vol.Required(CONF_SCHEDULE_WEEKDAYS, default=schedule.get(CONF_SCHEDULE_WEEKDAYS, [0,1,2,3,4,5,6])): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=[
                            {"value": str(day), "label": WEEKDAYS[day].capitalize()}
                            for day in range(7)
                        ],
                        multiple=True,
                        mode=selector.SelectSelectorMode.LIST,
                    )
                ),
                vol.Required(CONF_SCHEDULE_ENABLED, default=schedule.get(CONF_SCHEDULE_ENABLED, True)): cv.boolean,
            }),
            errors=errors,
        )

    async def async_step_delete_schedule(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Delete a schedule."""
        schedules = self.config_entry.options.get(CONF_SCHEDULES, [])

        if user_input is not None:
            # User confirmed deletion
            idx_to_delete = int(user_input["schedule_index"])
            schedules.pop(idx_to_delete)
            
            new_options = {**self.config_entry.options}
            new_options[CONF_SCHEDULES] = schedules
            
            return self.async_create_entry(title="", data=new_options)

        # Build schedule options
        schedule_options = {
            str(idx): f"{schedule.get(CONF_SCHEDULE_NAME, f'Schedule {idx+1}')}"
            for idx, schedule in enumerate(schedules)
        }

        return self.async_show_form(
            step_id="delete_schedule",
            data_schema=vol.Schema({
                vol.Required("schedule_index"): vol.In(schedule_options),
            }),
        )
