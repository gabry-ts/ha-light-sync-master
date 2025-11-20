"""Light Sync Master integration."""
from __future__ import annotations

from datetime import datetime, timedelta
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
    SUN_EVENT_SUNRISE,
    SUN_EVENT_SUNSET,
)
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_point_in_time, async_track_state_change_event
from homeassistant.helpers.sun import get_astral_event_next
from homeassistant.util import dt as dt_util

from .const import (
    CONF_MASTER_NAME,
    CONF_SCHEDULES,
    CONF_SCHEDULE_BRIGHTNESS,
    CONF_SCHEDULE_ENABLED,
    CONF_SCHEDULE_FROM_OFFSET,
    CONF_SCHEDULE_FROM_TIME,
    CONF_SCHEDULE_FROM_TYPE,
    CONF_SCHEDULE_NAME,
    CONF_SCHEDULE_RGB_COLOR,
    CONF_SCHEDULE_WEEKDAYS,
    CONF_SLAVE_ENTITIES,
    CONF_SYNC_ON_ENABLE,
    CONF_TRANSITION_TIME,
    DEFAULT_SYNC_ON_ENABLE,
    DEFAULT_TRANSITION_TIME,
    DOMAIN,
    LIGHT_PREFIX,
    SCHEDULE_TYPE_SUNRISE,
    SCHEDULE_TYPE_SUNSET,
    SCHEDULE_TYPE_TIME,
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


class ScheduleManager:
    """Manage color schedules and timers."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, master_entity_id: str) -> None:
        """Initialize schedule manager."""
        self.hass = hass
        self.entry = entry
        self.master_entity_id = master_entity_id
        self._unsub_timers: list = []

    async def async_setup(self) -> None:
        """Set up schedules."""
        schedules = self.entry.options.get(CONF_SCHEDULES, [])

        if not schedules:
            _LOGGER.debug("No schedules configured for %s", self.master_entity_id)
            return

        _LOGGER.info("Setting up %d schedule(s) for %s", len(schedules), self.master_entity_id)

        # Schedule all enabled schedules
        for schedule in schedules:
            if schedule.get(CONF_SCHEDULE_ENABLED, True):
                await self._schedule_next_trigger(schedule)

    async def _schedule_next_trigger(self, schedule: dict[str, Any]) -> None:
        """Schedule the next trigger for a schedule."""
        now = dt_util.now()
        today_weekday = now.weekday()

        # Check if schedule should run today
        weekdays = schedule[CONF_SCHEDULE_WEEKDAYS]
        if today_weekday not in weekdays:
            # Find next valid weekday
            next_trigger = self._get_next_weekday_trigger(schedule, now)
        else:
            # Calculate today's trigger time
            trigger_time = await self._calculate_trigger_time(schedule, now)

            if trigger_time and trigger_time > now:
                # Schedule for today
                next_trigger = trigger_time
            else:
                # Schedule for next valid day
                next_trigger = self._get_next_weekday_trigger(schedule, now)

        if next_trigger:
            _LOGGER.debug(
                "Scheduling '%s' for %s",
                schedule.get(CONF_SCHEDULE_NAME, "Unnamed"),
                next_trigger
            )

            unsub = async_track_point_in_time(
                self.hass,
                lambda _: self.hass.async_create_task(self._handle_trigger(schedule)),
                next_trigger
            )
            self._unsub_timers.append(unsub)

    async def _calculate_trigger_time(self, schedule: dict[str, Any], base_time: datetime) -> datetime | None:
        """Calculate trigger time for a schedule."""
        trigger_type = schedule[CONF_SCHEDULE_FROM_TYPE]

        if trigger_type == SCHEDULE_TYPE_TIME:
            # Fixed time
            time_str = schedule.get(CONF_SCHEDULE_FROM_TIME)
            if not time_str:
                return None

            try:
                hour, minute = map(int, time_str.split(":"))
                trigger_time = base_time.replace(hour=hour, minute=minute, second=0, microsecond=0)

                # Apply offset (in minutes)
                offset = schedule.get(CONF_SCHEDULE_FROM_OFFSET, 0)
                if offset:
                    trigger_time += timedelta(minutes=offset)

                return trigger_time
            except (ValueError, AttributeError) as exc:
                _LOGGER.error("Invalid time format in schedule: %s", exc)
                return None

        elif trigger_type in (SCHEDULE_TYPE_SUNRISE, SCHEDULE_TYPE_SUNSET):
            # Sun-based time
            event = SUN_EVENT_SUNRISE if trigger_type == SCHEDULE_TYPE_SUNRISE else SUN_EVENT_SUNSET

            try:
                sun_time = get_astral_event_next(self.hass, event, base_time)

                # Apply offset (in minutes)
                offset = schedule.get(CONF_SCHEDULE_FROM_OFFSET, 0)
                if offset:
                    sun_time += timedelta(minutes=offset)

                return sun_time
            except Exception as exc:
                _LOGGER.error("Failed to calculate sun time: %s", exc)
                return None

        return None

    def _get_next_weekday_trigger(self, schedule: dict[str, Any], start_time: datetime) -> datetime | None:
        """Get next valid weekday trigger for schedule."""
        weekdays = schedule[CONF_SCHEDULE_WEEKDAYS]

        # Try next 7 days
        for days_ahead in range(1, 8):
            next_date = start_time + timedelta(days=days_ahead)
            next_weekday = next_date.weekday()

            if next_weekday in weekdays:
                # Calculate trigger for this day
                trigger_time = self.hass.loop.run_until_complete(
                    self._calculate_trigger_time(schedule, next_date)
                )
                if trigger_time:
                    return trigger_time

        return None

    async def _handle_trigger(self, schedule: dict[str, Any]) -> None:
        """Handle schedule trigger - apply color to master light."""
        schedule_name = schedule.get(CONF_SCHEDULE_NAME, "Unnamed")
        _LOGGER.info("Triggering schedule '%s'", schedule_name)

        # Apply color to master light
        service_data = {
            ATTR_ENTITY_ID: self.master_entity_id,
            ATTR_RGB_COLOR: schedule[CONF_SCHEDULE_RGB_COLOR],
            ATTR_BRIGHTNESS: schedule[CONF_SCHEDULE_BRIGHTNESS],
            ATTR_TRANSITION: 2,  # 2 second smooth transition
        }

        try:
            await self.hass.services.async_call(
                LIGHT_DOMAIN,
                SERVICE_TURN_ON,
                service_data,
                blocking=False
            )
            _LOGGER.debug("Applied schedule '%s' to %s", schedule_name, self.master_entity_id)
        except Exception as exc:
            _LOGGER.error("Failed to apply schedule '%s': %s", schedule_name, exc)

        # Re-schedule for next occurrence
        await self._schedule_next_trigger(schedule)

    def cleanup(self) -> None:
        """Clean up timers."""
        for unsub in self._unsub_timers:
            unsub()
        self._unsub_timers.clear()
        _LOGGER.debug("Cleaned up schedule timers for %s", self.master_entity_id)


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

        # schedule manager
        self.schedule_manager = ScheduleManager(hass, entry, self.master_entity_id)

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

        # setup schedule manager
        await self.schedule_manager.async_setup()

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

        # cleanup schedule manager
        self.schedule_manager.cleanup()

        _LOGGER.info("Coordinator cleanup complete for %s", self.master_entity_id)
