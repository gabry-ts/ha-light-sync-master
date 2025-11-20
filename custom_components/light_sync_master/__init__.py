"""Light Sync Master integration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_COLOR_TEMP,
    ATTR_HS_COLOR,
    ATTR_RGB_COLOR,
    ATTR_TRANSITION,
    ATTR_XY_COLOR,
    DOMAIN as LIGHT_DOMAIN,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    ATTR_ENTITY_ID,
    SERVICE_TURN_ON,
    STATE_ON,
    STATE_UNAVAILABLE,
)
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event

from .const import (
    CONF_MASTER_NAME,
    CONF_SLAVE_ENTITIES,
    CONF_SYNC_ON_ENABLE,
    CONF_TRANSITION_TIME,
    DEFAULT_SYNC_ON_ENABLE,
    DEFAULT_TRANSITION_TIME,
    DOMAIN,
    LIGHT_PREFIX,
    SWITCH_PREFIX,
)

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["light", "switch"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Light Sync Master from a config entry."""
    _LOGGER.info("Setting up Light Sync Master: %s", entry.data[CONF_MASTER_NAME])

    # store coordinator in hass.data
    hass.data.setdefault(DOMAIN, {})

    # create coordinator
    coordinator = LightSyncCoordinator(hass, entry)
    hass.data[DOMAIN][entry.entry_id] = coordinator

    # setup platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # setup state change listeners after platforms are loaded
    await coordinator.async_setup()

    _LOGGER.info("Light Sync Master setup complete: %s", entry.data[CONF_MASTER_NAME])

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info("Unloading Light Sync Master: %s", entry.data[CONF_MASTER_NAME])

    # cleanup listeners
    coordinator = hass.data[DOMAIN].get(entry.entry_id)
    if coordinator:
        coordinator.cleanup()

    # unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok


async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload config entry."""
    await async_unload_entry(hass, entry)
    await async_setup_entry(hass, entry)


class LightSyncCoordinator:
    """Coordinator to manage sync logic and listeners."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize coordinator."""
        self.hass = hass
        self.entry = entry
        self._unsub_master = None
        self._unsub_slaves = []

        # build entity IDs
        name = entry.data[CONF_MASTER_NAME]
        sanitized_name = name.lower().replace(" ", "_")
        self.master_entity_id = f"light.{LIGHT_PREFIX}_{sanitized_name}"
        self.switch_entity_id = f"switch.{SWITCH_PREFIX}_{sanitized_name}"

    async def async_setup(self) -> bool:
        """Set up the coordinator."""
        _LOGGER.debug("Setting up coordinator for %s", self.master_entity_id)

        # setup state change listeners for master light
        self._unsub_master = async_track_state_change_event(
            self.hass,
            [self.master_entity_id],
            self._handle_master_state_change
        )

        # setup state change listeners for all slave lights
        slave_entities = self.entry.data.get(CONF_SLAVE_ENTITIES, [])
        if slave_entities:
            unsub = async_track_state_change_event(
                self.hass,
                slave_entities,
                self._handle_slave_state_change
            )
            self._unsub_slaves.append(unsub)

        _LOGGER.info(
            "Coordinator setup complete: master=%s, slaves=%d",
            self.master_entity_id,
            len(slave_entities)
        )

        return True

    @callback
    def _handle_master_state_change(self, event: Event) -> None:
        """Handle master light state changes."""
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")

        if new_state is None or new_state.state != STATE_ON:
            return

        # check if attributes actually changed
        if old_state is not None and self._states_equal(old_state, new_state):
            return

        # check if sync is enabled
        sync_switch_state = self.hass.states.get(self.switch_entity_id)
        if sync_switch_state is None or sync_switch_state.state != STATE_ON:
            _LOGGER.debug("Sync disabled, skipping master state change propagation")
            return

        _LOGGER.debug(
            "Master light %s changed, syncing to slaves",
            self.master_entity_id
        )

        # sync to all ON slaves
        self.hass.async_create_task(self._sync_all_on_slaves())

    @callback
    def _handle_slave_state_change(self, event: Event) -> None:
        """Handle slave light turning ON."""
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")

        if new_state is None or new_state.state != STATE_ON:
            return

        # only sync if slave was OFF and is now ON
        if old_state is not None and old_state.state == STATE_ON:
            return

        # check if sync is enabled
        sync_switch_state = self.hass.states.get(self.switch_entity_id)
        if sync_switch_state is None or sync_switch_state.state != STATE_ON:
            _LOGGER.debug("Sync disabled, skipping slave turn on sync")
            return

        slave_entity_id = new_state.entity_id

        _LOGGER.debug(
            "Slave light %s turned on, syncing master state",
            slave_entity_id
        )

        # immediately copy master state to newly turned on slave
        self.hass.async_create_task(self._sync_slave(slave_entity_id))

    def _states_equal(self, state1, state2) -> bool:
        """Check if two states have equal light attributes."""
        attrs_to_check = [
            ATTR_BRIGHTNESS,
            ATTR_RGB_COLOR,
            ATTR_HS_COLOR,
            ATTR_XY_COLOR,
            ATTR_COLOR_TEMP,
        ]

        for attr in attrs_to_check:
            val1 = state1.attributes.get(attr)
            val2 = state2.attributes.get(attr)

            # convert tuples to lists for comparison
            if isinstance(val1, tuple):
                val1 = list(val1)
            if isinstance(val2, tuple):
                val2 = list(val2)

            if val1 != val2:
                return False

        return True

    async def async_sync_all_on_slaves(self) -> None:
        """Sync all currently ON slaves to master state."""
        slave_entities = self.entry.data.get(CONF_SLAVE_ENTITIES, [])

        _LOGGER.debug(
            "Syncing all ON slaves to master %s",
            self.master_entity_id
        )

        synced_count = 0
        for slave_entity_id in slave_entities:
            slave_state = self.hass.states.get(slave_entity_id)

            if slave_state is None:
                _LOGGER.warning(
                    "Slave light %s not found, skipping sync",
                    slave_entity_id
                )
                continue

            if slave_state.state != STATE_ON:
                _LOGGER.debug(
                    "Slave light %s is not ON, skipping sync",
                    slave_entity_id
                )
                continue

            if slave_state.state == STATE_UNAVAILABLE:
                _LOGGER.warning(
                    "Slave light %s is unavailable, skipping sync",
                    slave_entity_id
                )
                continue

            await self._sync_slave(slave_entity_id)
            synced_count += 1

        _LOGGER.info(
            "Synced %d/%d slaves to master %s",
            synced_count,
            len(slave_entities),
            self.master_entity_id
        )

    async def _sync_slave(self, slave_entity_id: str) -> None:
        """Sync a single slave to master state."""
        master_state = self.hass.states.get(self.master_entity_id)

        if master_state is None or master_state.state != STATE_ON:
            _LOGGER.warning(
                "Master light %s is not available, cannot sync",
                self.master_entity_id
            )
            return

        # build service data from master state
        service_data = self._build_sync_service_data(master_state)
        service_data[ATTR_ENTITY_ID] = slave_entity_id

        try:
            await self.hass.services.async_call(
                LIGHT_DOMAIN,
                SERVICE_TURN_ON,
                service_data,
                blocking=False
            )
            _LOGGER.debug(
                "Synced slave %s to master %s",
                slave_entity_id,
                self.master_entity_id
            )
        except Exception as exc:
            _LOGGER.error(
                "Failed to sync slave %s: %s",
                slave_entity_id,
                exc
            )

    def _build_sync_service_data(self, master_state) -> dict[str, Any]:
        """Build service data from master state."""
        service_data = {}

        # get transition time from options
        transition_time = self.entry.options.get(
            CONF_TRANSITION_TIME,
            DEFAULT_TRANSITION_TIME
        )
        service_data[ATTR_TRANSITION] = transition_time

        # copy brightness
        if ATTR_BRIGHTNESS in master_state.attributes:
            service_data[ATTR_BRIGHTNESS] = master_state.attributes[ATTR_BRIGHTNESS]

        # copy color attributes (only one will be used)
        if ATTR_RGB_COLOR in master_state.attributes:
            service_data[ATTR_RGB_COLOR] = master_state.attributes[ATTR_RGB_COLOR]
        elif ATTR_HS_COLOR in master_state.attributes:
            service_data[ATTR_HS_COLOR] = master_state.attributes[ATTR_HS_COLOR]
        elif ATTR_XY_COLOR in master_state.attributes:
            service_data[ATTR_XY_COLOR] = master_state.attributes[ATTR_XY_COLOR]
        elif ATTR_COLOR_TEMP in master_state.attributes:
            service_data[ATTR_COLOR_TEMP] = master_state.attributes[ATTR_COLOR_TEMP]

        return service_data

    async def _sync_all_on_slaves(self) -> None:
        """Sync all currently ON slaves to master state (internal wrapper)."""
        await self.async_sync_all_on_slaves()

    def cleanup(self) -> None:
        """Cleanup listeners."""
        _LOGGER.debug("Cleaning up coordinator for %s", self.master_entity_id)

        if self._unsub_master:
            self._unsub_master()
            self._unsub_master = None

        for unsub in self._unsub_slaves:
            unsub()
        self._unsub_slaves.clear()

        _LOGGER.info("Coordinator cleanup complete for %s", self.master_entity_id)
