"""Sync Enable Switch platform."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import (
    CONF_MASTER_NAME,
    CONF_PER_AREA_TOGGLES,
    CONF_SYNC_ENABLED_DEFAULT,
    CONF_SYNC_ON_ENABLE,
    DEFAULT_PER_AREA_TOGGLES,
    DEFAULT_SYNC_ENABLED,
    DEFAULT_SYNC_ON_ENABLE,
    DOMAIN,
    SWITCH_PREFIX,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sync enable switch and the per-area follow switches."""
    name = entry.data[CONF_MASTER_NAME]
    entity_id = f"switch.{SWITCH_PREFIX}_{name.lower().replace(' ', '_')}"

    default_state = (entry.options or {}).get(
        CONF_SYNC_ENABLED_DEFAULT,
        DEFAULT_SYNC_ENABLED
    )

    entities: list[SwitchEntity] = [
        SyncEnableSwitch(entry.entry_id, name, entity_id, default_state)
    ]

    # One "follow master" switch per area that owns at least one slave, so each
    # room can be detached from the master while staying on.
    per_area = (entry.options or {}).get(
        CONF_PER_AREA_TOGGLES, DEFAULT_PER_AREA_TOGGLES
    )
    if per_area:
        coordinator = hass.data[DOMAIN][entry.entry_id]
        for area_id, info in sorted(coordinator.get_area_map().items()):
            entities.append(
                AreaFollowSwitch(
                    entry.entry_id,
                    name,
                    area_id,
                    info["name"],
                    coordinator.follow_switch_entity_id(area_id),
                )
            )

    async_add_entities(entities)


class SyncEnableSwitch(SwitchEntity, RestoreEntity):
    """Switch to enable/disable synchronization."""

    _attr_has_entity_name = False
    _attr_should_poll = False

    def __init__(
        self,
        entry_id: str,
        name: str,
        entity_id: str,
        default_state: bool,
    ) -> None:
        """Initialize sync switch."""
        self._attr_unique_id = f"{DOMAIN}_{entry_id}_switch"
        self._attr_name = f"{name} Sync"
        self.entity_id = entity_id
        self._attr_is_on = default_state
        self._default_state = default_state
        self._entry_id = entry_id

        # device info to group with master light
        self._attr_device_info = dr.DeviceInfo(
            identifiers={(DOMAIN, entry_id)},
            name=f"Light Sync Master - {name}",
            manufacturer="Light Sync Master",
            model="Virtual Master Light",
            sw_version="1.0.0",
        )

        # icon for the switch
        self._attr_icon = "mdi:sync"

    async def async_added_to_hass(self) -> None:
        """Restore previous state."""
        await super().async_added_to_hass()

        if (last_state := await self.async_get_last_state()) is not None:
            self._attr_is_on = last_state.state == "on"
            _LOGGER.debug(
                "Restored sync switch %s state: %s",
                self.entity_id,
                "on" if self._attr_is_on else "off"
            )
        else:
            self._attr_is_on = self._default_state
            _LOGGER.debug(
                "No previous state for sync switch %s, using default: %s",
                self.entity_id,
                "on" if self._attr_is_on else "off"
            )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn on sync."""
        self._attr_is_on = True
        self.async_write_ha_state()

        _LOGGER.info("Sync switch %s turned on", self.entity_id)

        # check if immediate sync is enabled
        coordinator = self.hass.data[DOMAIN].get(self._entry_id)
        if coordinator:
            sync_on_enable = (coordinator.entry.options or {}).get(
                CONF_SYNC_ON_ENABLE,
                DEFAULT_SYNC_ON_ENABLE
            )
            if sync_on_enable:
                _LOGGER.debug("Sync on enable is active, syncing all ON slaves")
                await coordinator.async_sync_all_on_slaves()
            else:
                _LOGGER.debug("Sync on enable is disabled, skipping immediate sync")

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn off sync."""
        self._attr_is_on = False
        self.async_write_ha_state()

        _LOGGER.info("Sync switch %s turned off", self.entity_id)


class AreaFollowSwitch(SwitchEntity, RestoreEntity):
    """Per-area switch: when off, that area stops following the master."""

    _attr_has_entity_name = False
    _attr_should_poll = False

    def __init__(
        self,
        entry_id: str,
        master_name: str,
        area_id: str,
        area_name: str,
        entity_id: str,
    ) -> None:
        """Initialize an area follow switch."""
        self._attr_unique_id = f"{DOMAIN}_{entry_id}_follow_{area_id}"
        self._attr_name = f"{master_name} Follow {area_name}"
        self.entity_id = entity_id
        self._entry_id = entry_id
        self._area_id = area_id

        # default: area follows the master
        self._attr_is_on = True
        self._attr_icon = "mdi:home-switch"

        # group under the same device as the master light / sync switch
        self._attr_device_info = dr.DeviceInfo(
            identifiers={(DOMAIN, entry_id)},
            name=f"Light Sync Master - {master_name}",
            manufacturer="Light Sync Master",
            model="Virtual Master Light",
            sw_version="1.0.0",
        )

    async def async_added_to_hass(self) -> None:
        """Restore previous state."""
        await super().async_added_to_hass()

        if (last_state := await self.async_get_last_state()) is not None:
            self._attr_is_on = last_state.state == "on"

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Re-attach the area to the master and resync its ON lights."""
        self._attr_is_on = True
        self.async_write_ha_state()

        _LOGGER.info("Area follow switch %s turned on", self.entity_id)

        coordinator = self.hass.data[DOMAIN].get(self._entry_id)
        if coordinator:
            await coordinator.async_sync_area(self._area_id)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Detach the area from the master (its lights keep their state)."""
        self._attr_is_on = False
        self.async_write_ha_state()

        _LOGGER.info("Area follow switch %s turned off", self.entity_id)
