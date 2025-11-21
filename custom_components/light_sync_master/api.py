"""
API views for Light Sync Master frontend
"""
import logging
from datetime import datetime
from typing import Any

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# In-memory log storage (limited to last 200 entries per instance)
_LOGS: dict[str, list[dict[str, Any]]] = {}
MAX_LOGS = 200


def setup_api(hass: HomeAssistant) -> None:
    """Set up the API views."""
    hass.http.register_view(LightSyncStatusView)
    hass.http.register_view(LightSyncConfigView)
    hass.http.register_view(LightSyncLogsView)
    hass.http.register_view(LightSyncClearLogsView)
    hass.http.register_view(LightSyncTestSyncView)
    hass.http.register_view(LightSyncTestAllLightsView)
    hass.http.register_view(LightSyncExportConfigView)
    hass.http.register_view(LightSyncUpdateConfigView)


def add_log_entry(entry_id: str, log_type: str, message: str, entity_id: str | None = None, details: Any = None) -> None:
    """Add a log entry."""
    if entry_id not in _LOGS:
        _LOGS[entry_id] = []

    _LOGS[entry_id].append({
        "timestamp": datetime.now().isoformat(),
        "type": log_type,
        "message": message,
        "entity_id": entity_id,
        "details": details
    })

    # Keep only last MAX_LOGS entries
    if len(_LOGS[entry_id]) > MAX_LOGS:
        _LOGS[entry_id] = _LOGS[entry_id][-MAX_LOGS:]


class LightSyncStatusView(HomeAssistantView):
    """View to get current status."""

    url = "/api/light_sync_master/{entry_id}/status"
    name = "api:light_sync_master:status"

    async def get(self, request: web.Request, entry_id: str) -> web.Response:
        """Get status."""
        hass: HomeAssistant = request.app["hass"]

        entry = hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return self.json_message("Entry not found", status_code=404)

        # Get coordinator
        coordinator = hass.data[DOMAIN].get(entry_id)
        if not coordinator:
            return self.json_message("Coordinator not found", status_code=404)

        # Get master light and sync switch entities
        entity_registry = er.async_get(hass)
        master_light = None
        sync_switch = None

        for entity in er.async_entries_for_config_entry(entity_registry, entry_id):
            if entity.domain == "light":
                master_light = hass.states.get(entity.entity_id)
            elif entity.domain == "switch":
                sync_switch = hass.states.get(entity.entity_id)

        if not master_light or not sync_switch:
            return self.json_message("Entities not found", status_code=404)

        # Get slave lights status
        slave_lights = []
        slave_entities = entry.options.get("slave_entities", entry.data.get("slave_entities", []))

        for slave_id in slave_entities:
            slave_entity = hass.states.get(slave_id)
            if slave_entity:
                slave_lights.append({
                    "entity_id": slave_id,
                    "name": slave_entity.attributes.get("friendly_name", slave_id),
                    "state": slave_entity.state,
                    "brightness": slave_entity.attributes.get("brightness"),
                    "rgb_color": slave_entity.attributes.get("rgb_color"),
                    "is_synced": slave_entity.state == "on",  # Simplified check
                    "last_event": None,
                    "available": slave_entity.state != "unavailable"
                })

        # Get next schedule (simplified - would need full implementation)
        next_schedule = None
        schedules = entry.options.get("schedules", [])
        if schedules:
            enabled_schedules = [s for s in schedules if s.get("enabled", True)]
            if enabled_schedules:
                next_schedule = {
                    "name": enabled_schedules[0]["name"],
                    "trigger_time": datetime.now().isoformat(),
                    "rgb_color": enabled_schedules[0]["rgb_color"],
                    "brightness": enabled_schedules[0]["brightness"]
                }

        # Build response
        status = {
            "master_light": {
                "entity_id": master_light.entity_id,
                "state": master_light.state,
                "brightness": master_light.attributes.get("brightness", 255),
                "rgb_color": master_light.attributes.get("rgb_color"),
                "hs_color": master_light.attributes.get("hs_color"),
                "xy_color": master_light.attributes.get("xy_color"),
                "color_temp": master_light.attributes.get("color_temp")
            },
            "sync_switch": {
                "entity_id": sync_switch.entity_id,
                "state": sync_switch.state == "on"
            },
            "slave_lights": slave_lights,
            "last_sync": None,  # Would track this in coordinator
            "next_schedule": next_schedule,
            "statistics": {
                "total_syncs": len(_LOGS.get(entry_id, [])),
                "syncs_today": len([l for l in _LOGS.get(entry_id, []) if l["type"] == "sync"]),
                "active_lights": len([s for s in slave_lights if s["state"] == "on"]),
                "total_lights": len(slave_lights),
                "uptime": "N/A"
            }
        }

        return self.json(status)


class LightSyncConfigView(HomeAssistantView):
    """View to get configuration."""

    url = "/api/light_sync_master/{entry_id}/config"
    name = "api:light_sync_master:config"

    async def get(self, request: web.Request, entry_id: str) -> web.Response:
        """Get configuration."""
        hass: HomeAssistant = request.app["hass"]

        entry = hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return self.json_message("Entry not found", status_code=404)

        config = {
            "entry_id": entry_id,
            "name": entry.data.get("name"),
            "slave_entities": entry.options.get("slave_entities", entry.data.get("slave_entities", [])),
            "transition_time": entry.options.get("transition_time", 1.0),
            "sync_enabled_default": entry.options.get("sync_enabled_default", True),
            "sync_on_enable": entry.options.get("sync_on_enable", True),
            "enable_debug_logging": entry.options.get("enable_debug_logging", False),
            "schedules": entry.options.get("schedules", [])
        }

        return self.json(config)


class LightSyncLogsView(HomeAssistantView):
    """View to get logs."""

    url = "/api/light_sync_master/{entry_id}/logs"
    name = "api:light_sync_master:logs"

    async def get(self, request: web.Request, entry_id: str) -> web.Response:
        """Get logs."""
        logs = _LOGS.get(entry_id, [])
        return self.json(logs)


class LightSyncClearLogsView(HomeAssistantView):
    """View to clear logs."""

    url = "/api/light_sync_master/{entry_id}/clear_logs"
    name = "api:light_sync_master:clear_logs"

    async def post(self, request: web.Request, entry_id: str) -> web.Response:
        """Clear logs."""
        if entry_id in _LOGS:
            _LOGS[entry_id] = []
        return self.json({"success": True})


class LightSyncTestSyncView(HomeAssistantView):
    """View to test sync."""

    url = "/api/light_sync_master/{entry_id}/test_sync"
    name = "api:light_sync_master:test_sync"

    async def post(self, request: web.Request, entry_id: str) -> web.Response:
        """Test sync."""
        hass: HomeAssistant = request.app["hass"]

        entry = hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return self.json_message("Entry not found", status_code=404)

        coordinator = hass.data[DOMAIN].get(entry_id)
        if not coordinator:
            return self.json_message("Coordinator not found", status_code=404)

        add_log_entry(entry_id, "info", "Test sincronizzazione avviato manualmente")

        # Trigger sync
        await coordinator.async_sync_all_on_slaves()

        add_log_entry(entry_id, "sync", "Test sincronizzazione completato")

        return self.json({"success": True})


class LightSyncTestAllLightsView(HomeAssistantView):
    """View to test all lights connectivity."""

    url = "/api/light_sync_master/{entry_id}/test_all_lights"
    name = "api:light_sync_master:test_all_lights"

    async def post(self, request: web.Request, entry_id: str) -> web.Response:
        """Test all lights."""
        hass: HomeAssistant = request.app["hass"]

        entry = hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return self.json_message("Entry not found", status_code=404)

        add_log_entry(entry_id, "info", "Test connettività luci avviato")

        slave_entities = entry.options.get("slave_entities", entry.data.get("slave_entities", []))

        for slave_id in slave_entities:
            slave_entity = hass.states.get(slave_id)
            if not slave_entity:
                add_log_entry(entry_id, "error", f"Luce non trovata", slave_id)
            elif slave_entity.state == "unavailable":
                add_log_entry(entry_id, "error", f"Luce non disponibile", slave_id)
            else:
                add_log_entry(entry_id, "info", f"Luce disponibile - Stato: {slave_entity.state}", slave_id)

        return self.json({"success": True})


class LightSyncExportConfigView(HomeAssistantView):
    """View to export configuration."""

    url = "/api/light_sync_master/{entry_id}/export_config"
    name = "api:light_sync_master:export_config"

    async def get(self, request: web.Request, entry_id: str) -> web.Response:
        """Export configuration."""
        hass: HomeAssistant = request.app["hass"]

        entry = hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return self.json_message("Entry not found", status_code=404)

        config = {
            "version": 1,
            "entry_id": entry_id,
            "data": dict(entry.data),
            "options": dict(entry.options),
            "exported_at": datetime.now().isoformat()
        }

        return self.json(config)


class LightSyncUpdateConfigView(HomeAssistantView):
    """View to update configuration."""

    url = "/api/light_sync_master/{entry_id}/update_config"
    name = "api:light_sync_master:update_config"

    async def post(self, request: web.Request, entry_id: str) -> web.Response:
        """Update configuration."""
        hass: HomeAssistant = request.app["hass"]

        entry = hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return self.json_message("Entry not found", status_code=404)

        data = await request.json()

        # Update options
        new_options = dict(entry.options)
        if "slave_entities" in data:
            new_options["slave_entities"] = data["slave_entities"]
        if "transition_time" in data:
            new_options["transition_time"] = data["transition_time"]
        if "sync_on_enable" in data:
            new_options["sync_on_enable"] = data["sync_on_enable"]

        hass.config_entries.async_update_entry(entry, options=new_options)

        add_log_entry(entry_id, "info", "Configurazione aggiornata tramite API")

        return self.json({"success": True})
