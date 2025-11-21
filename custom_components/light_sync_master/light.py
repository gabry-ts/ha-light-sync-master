"""Virtual Master Light platform."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_COLOR_TEMP_KELVIN,
    ATTR_HS_COLOR,
    ATTR_RGB_COLOR,
    ATTR_XY_COLOR,
    ColorMode,
    LightEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import CONF_MASTER_NAME, DOMAIN, LIGHT_PREFIX

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up virtual master light."""
    name = entry.data[CONF_MASTER_NAME]
    entity_id = f"light.{LIGHT_PREFIX}_{name.lower().replace(' ', '_')}"

    light = VirtualMasterLight(entry.entry_id, name, entity_id)
    async_add_entities([light])


class VirtualMasterLight(LightEntity, RestoreEntity):
    """Virtual Master Light that cannot be turned off."""

    _attr_has_entity_name = False
    _attr_should_poll = False

    def __init__(self, entry_id: str, name: str, entity_id: str) -> None:
        """Initialize virtual master light."""
        self._attr_unique_id = f"{DOMAIN}_{entry_id}_light"
        self._attr_name = name
        self.entity_id = entity_id
        self._entry_id = entry_id

        # device info to group entities
        self._attr_device_info = dr.DeviceInfo(
            identifiers={(DOMAIN, entry_id)},
            name=f"Light Sync Master - {name}",
            manufacturer="Light Sync Master",
            model="Virtual Master Light",
            sw_version="1.0.0",
        )

        # icon for the master light
        self._attr_icon = "mdi:lightbulb-group"

        # always on
        self._attr_is_on = True

        # default state: full brightness white
        self._attr_brightness = 255
        self._attr_color_mode = ColorMode.RGB
        self._attr_rgb_color = (255, 255, 255)
        self._attr_color_temp = None
        self._attr_hs_color = None
        self._attr_xy_color = None

        # supported features
        self._attr_supported_color_modes = {
            ColorMode.RGB,
            ColorMode.COLOR_TEMP,
        }

    async def async_added_to_hass(self) -> None:
        """Restore previous state."""
        await super().async_added_to_hass()

        if (last_state := await self.async_get_last_state()) is not None:
            # restore attributes but always keep is_on = True
            if ATTR_BRIGHTNESS in last_state.attributes:
                self._attr_brightness = last_state.attributes[ATTR_BRIGHTNESS]
            if ATTR_RGB_COLOR in last_state.attributes:
                self._attr_rgb_color = tuple(last_state.attributes[ATTR_RGB_COLOR])
                self._attr_color_mode = ColorMode.RGB
            if ATTR_HS_COLOR in last_state.attributes:
                self._attr_hs_color = tuple(last_state.attributes[ATTR_HS_COLOR])
                self._attr_color_mode = ColorMode.HS
            if ATTR_XY_COLOR in last_state.attributes:
                self._attr_xy_color = tuple(last_state.attributes[ATTR_XY_COLOR])
                self._attr_color_mode = ColorMode.XY
            if ATTR_COLOR_TEMP_KELVIN in last_state.attributes:
                self._attr_color_temp = last_state.attributes[ATTR_COLOR_TEMP_KELVIN]
                self._attr_color_mode = ColorMode.COLOR_TEMP

            _LOGGER.debug(
                "Restored master light %s state: brightness=%s, color_mode=%s",
                self.entity_id,
                self._attr_brightness,
                self._attr_color_mode,
            )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn on light (update attributes)."""
        # update attributes from kwargs
        if ATTR_BRIGHTNESS in kwargs:
            self._attr_brightness = kwargs[ATTR_BRIGHTNESS]

        if ATTR_RGB_COLOR in kwargs:
            self._attr_rgb_color = tuple(kwargs[ATTR_RGB_COLOR])
            self._attr_color_mode = ColorMode.RGB
            self._attr_color_temp = None
            self._attr_hs_color = None
            self._attr_xy_color = None
        elif ATTR_HS_COLOR in kwargs:
            self._attr_hs_color = tuple(kwargs[ATTR_HS_COLOR])
            self._attr_color_mode = ColorMode.HS
            self._attr_color_temp = None
            self._attr_rgb_color = None
            self._attr_xy_color = None
        elif ATTR_XY_COLOR in kwargs:
            self._attr_xy_color = tuple(kwargs[ATTR_XY_COLOR])
            self._attr_color_mode = ColorMode.XY
            self._attr_color_temp = None
            self._attr_rgb_color = None
            self._attr_hs_color = None
        elif ATTR_COLOR_TEMP_KELVIN in kwargs:
            self._attr_color_temp = kwargs[ATTR_COLOR_TEMP_KELVIN]
            self._attr_color_mode = ColorMode.COLOR_TEMP
            self._attr_rgb_color = None
            self._attr_hs_color = None
            self._attr_xy_color = None

        # always on
        self._attr_is_on = True

        _LOGGER.debug(
            "Master light %s turned on: brightness=%s, color_mode=%s",
            self.entity_id,
            self._attr_brightness,
            self._attr_color_mode,
        )

        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn off is not supported (no-op)."""
        _LOGGER.warning(
            "Master light %s cannot be turned off, ignoring turn_off call",
            self.entity_id
        )
        # keep light on
        self._attr_is_on = True
        self.async_write_ha_state()
