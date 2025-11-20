"""Sync Enable Switch platform."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import (
    CONF_MASTER_NAME,
    CONF_SYNC_ENABLED_DEFAULT,
    DEFAULT_SYNC_ENABLED,
    DOMAIN,
    SWITCH_PREFIX,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sync enable switch."""
    name = entry.data[CONF_MASTER_NAME]
    entity_id = f"switch.{SWITCH_PREFIX}_{name.lower().replace(' ', '_')}"

    default_state = entry.options.get(
        CONF_SYNC_ENABLED_DEFAULT,
        DEFAULT_SYNC_ENABLED
    )

    switch = SyncEnableSwitch(entry.entry_id, name, entity_id, default_state)
    async_add_entities([switch])


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

        # trigger immediate sync via coordinator
        coordinator = self.hass.data[DOMAIN].get(self._entry_id)
        if coordinator:
            await coordinator.async_sync_all_on_slaves()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn off sync."""
        self._attr_is_on = False
        self.async_write_ha_state()

        _LOGGER.info("Sync switch %s turned off", self.entity_id)
