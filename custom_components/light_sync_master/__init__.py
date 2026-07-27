"""Light Sync Master integration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_COLOR_MODE,
    ATTR_COLOR_TEMP_KELVIN,
    ATTR_HS_COLOR,
    ATTR_RGB_COLOR,
    ATTR_TRANSITION,
    ATTR_XY_COLOR,
    ColorMode,
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
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
)
from homeassistant.helpers.event import async_track_state_change_event

from .const import (
    BRIGHTNESS_MODE_CAP,
    BRIGHTNESS_MODE_SCALE,
    CONF_AREA_CONFIG,
    CONF_BRIGHTNESS_MODE,
    CONF_BRIGHTNESS_VALUE,
    CONF_MASTER_NAME,
    CONF_PER_AREA_TOGGLES,
    CONF_SLAVE_ENTITIES,
    CONF_SYNC_BRIGHTNESS,
    CONF_SYNC_COLOR,
    CONF_SYNC_COLOR_TEMP,
    CONF_SYNC_ON_ENABLE,
    CONF_TRANSITION_TIME,
    DEFAULT_BRIGHTNESS_MODE,
    DEFAULT_BRIGHTNESS_VALUE,
    DEFAULT_PER_AREA_TOGGLES,
    DEFAULT_SYNC_BRIGHTNESS,
    DEFAULT_SYNC_COLOR,
    DEFAULT_SYNC_COLOR_TEMP,
    DEFAULT_SYNC_ON_ENABLE,
    DEFAULT_TRANSITION_TIME,
    DOMAIN,
    FOLLOW_SWITCH_INFIX,
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

    # ------------------------------------------------------------------
    # Per-area "follow master" support
    # ------------------------------------------------------------------

    def _per_area_enabled(self) -> bool:
        """Return whether the per-area follow toggles feature is enabled."""
        return (self.entry.options or {}).get(
            CONF_PER_AREA_TOGGLES, DEFAULT_PER_AREA_TOGGLES
        )

    def area_id_for_entity(self, entity_id: str) -> str | None:
        """Resolve the area of an entity (entity area, else its device area)."""
        ent_reg = er.async_get(self.hass)
        entry = ent_reg.async_get(entity_id)
        if entry is None:
            return None
        if entry.area_id:
            return entry.area_id
        if entry.device_id:
            device = dr.async_get(self.hass).async_get(entry.device_id)
            if device and device.area_id:
                return device.area_id
        return None

    def get_area_map(self) -> dict[str, dict[str, Any]]:
        """Group configured slaves by area id.

        Returns ``{area_id: {"name": <area name>, "slaves": [entity_id, ...]}}``
        for every area that owns at least one slave. Slaves without an area are
        omitted (they always follow the master).
        """
        area_reg = ar.async_get(self.hass)
        result: dict[str, dict[str, Any]] = {}
        for slave in self.entry.data.get(CONF_SLAVE_ENTITIES, []):
            area_id = self.area_id_for_entity(slave)
            if not area_id:
                continue
            if area_id not in result:
                area = area_reg.async_get_area(area_id)
                result[area_id] = {
                    "name": area.name if area else area_id,
                    "slaves": [],
                }
            result[area_id]["slaves"].append(slave)
        return result

    def follow_switch_entity_id(self, area_id: str) -> str:
        """Build the deterministic entity id of an area follow switch."""
        return f"{self.switch_entity_id}_{FOLLOW_SWITCH_INFIX}_{area_id}"

    def _slave_follows_master(self, slave_entity_id: str) -> bool:
        """Return True if this slave should currently follow the master.

        A slave is detached only when the feature is on, the slave belongs to an
        area, and that area's follow switch exists and is off. Anything missing
        defaults to following (backward compatible).
        """
        if not self._per_area_enabled():
            return True
        area_id = self.area_id_for_entity(slave_entity_id)
        if not area_id:
            return True
        follow_state = self.hass.states.get(self.follow_switch_entity_id(area_id))
        if follow_state is None:
            return True
        return follow_state.state == STATE_ON

    async def async_sync_area(self, area_id: str) -> None:
        """Re-sync every ON slave of an area to the master (follow re-enabled)."""
        # respect the global sync switch
        sync_switch_state = self.hass.states.get(self.switch_entity_id)
        if sync_switch_state is None or sync_switch_state.state != STATE_ON:
            return
        for slave in self.entry.data.get(CONF_SLAVE_ENTITIES, []):
            if self.area_id_for_entity(slave) != area_id:
                continue
            slave_state = self.hass.states.get(slave)
            if slave_state is not None and slave_state.state == STATE_ON:
                await self._sync_slave(slave)

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

        # respect the per-area follow toggle for this slave
        if not self._slave_follows_master(slave_entity_id):
            _LOGGER.debug(
                "Slave light %s is detached from master (area toggle off), "
                "skipping turn-on sync",
                slave_entity_id
            )
            return

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
            ATTR_COLOR_TEMP_KELVIN,
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

            if not self._slave_follows_master(slave_entity_id):
                _LOGGER.debug(
                    "Slave light %s is detached from master (area toggle off), "
                    "skipping sync",
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

        # build service data from master state, applying this slave's area config
        area_cfg = self._area_sync_config(self.area_id_for_entity(slave_entity_id))
        service_data = self._build_sync_service_data(master_state, area_cfg)
        service_data[ATTR_ENTITY_ID] = slave_entity_id

        # if the area masks out every synced attribute there is nothing to send
        if len(service_data) <= 2:  # only transition + entity_id
            _LOGGER.debug(
                "Slave %s: nothing to sync for its area config, skipping",
                slave_entity_id
            )
            return

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

    def _area_sync_config(self, area_id: str | None) -> dict[str, Any]:
        """Return the per-area sync config (with defaults) for an area."""
        cfg = ((self.entry.options or {}).get(CONF_AREA_CONFIG) or {}).get(
            area_id or "", {}
        )
        return {
            CONF_SYNC_BRIGHTNESS: cfg.get(CONF_SYNC_BRIGHTNESS, DEFAULT_SYNC_BRIGHTNESS),
            CONF_SYNC_COLOR: cfg.get(CONF_SYNC_COLOR, DEFAULT_SYNC_COLOR),
            CONF_SYNC_COLOR_TEMP: cfg.get(
                CONF_SYNC_COLOR_TEMP, DEFAULT_SYNC_COLOR_TEMP
            ),
            CONF_BRIGHTNESS_MODE: cfg.get(
                CONF_BRIGHTNESS_MODE, DEFAULT_BRIGHTNESS_MODE
            ),
            CONF_BRIGHTNESS_VALUE: cfg.get(
                CONF_BRIGHTNESS_VALUE, DEFAULT_BRIGHTNESS_VALUE
            ),
        }

    @staticmethod
    def _apply_brightness(master_brightness: int, area_cfg: dict[str, Any]) -> int:
        """Apply the area brightness mode (follow / scale / cap) to a value."""
        mode = area_cfg[CONF_BRIGHTNESS_MODE]
        value = area_cfg[CONF_BRIGHTNESS_VALUE]
        if mode == BRIGHTNESS_MODE_SCALE:
            result = master_brightness * value / 100
        elif mode == BRIGHTNESS_MODE_CAP:
            result = min(master_brightness, 255 * value / 100)
        else:
            result = master_brightness
        # keep it a valid, non-zero brightness so the slave stays on
        return max(1, min(255, round(result)))

    def _build_sync_service_data(
        self, master_state, area_cfg: dict[str, Any]
    ) -> dict[str, Any]:
        """Build light.turn_on data from master state, filtered by area config."""
        service_data: dict[str, Any] = {}

        # get transition time from options
        transition_time = (self.entry.options or {}).get(
            CONF_TRANSITION_TIME,
            DEFAULT_TRANSITION_TIME
        )
        service_data[ATTR_TRANSITION] = transition_time

        attrs = master_state.attributes

        # brightness (with optional scale/cap)
        if area_cfg[CONF_SYNC_BRIGHTNESS]:
            brightness = attrs.get(ATTR_BRIGHTNESS)
            if brightness is not None:
                service_data[ATTR_BRIGHTNESS] = self._apply_brightness(
                    brightness, area_cfg
                )

        # color: driven by the master's active color mode, gated per area.
        # Guard on value (not key), since the inactive color attrs are None.
        if attrs.get(ATTR_COLOR_MODE) == ColorMode.COLOR_TEMP:
            if area_cfg[CONF_SYNC_COLOR_TEMP] and attrs.get(ATTR_COLOR_TEMP_KELVIN) is not None:
                service_data[ATTR_COLOR_TEMP_KELVIN] = attrs[ATTR_COLOR_TEMP_KELVIN]
        elif area_cfg[CONF_SYNC_COLOR]:
            if attrs.get(ATTR_RGB_COLOR) is not None:
                service_data[ATTR_RGB_COLOR] = attrs[ATTR_RGB_COLOR]
            elif attrs.get(ATTR_HS_COLOR) is not None:
                service_data[ATTR_HS_COLOR] = attrs[ATTR_HS_COLOR]
            elif attrs.get(ATTR_XY_COLOR) is not None:
                service_data[ATTR_XY_COLOR] = attrs[ATTR_XY_COLOR]

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
