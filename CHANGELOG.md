# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-08-02

### Added
- Optional daily re-activation of all per-area "follow master" switches (Options → "Sync Behavior Settings"): enable it and pick a time, and every day at that hour every room's follow switch is turned back on (which also re-syncs each area to the master). Requires the per-area switches to be enabled.

[1.4.0]: https://github.com/gabry-ts/ha-light-sync-master/releases/tag/v1.4.0

## [1.3.0] - 2026-07-27

### Added
- Per-area sync configuration (Options → "Per-Area Sync"): for each area choose whether it follows the master's brightness, color and color temperature independently.
- Per-area brightness mode: **Follow** (same as master), **Scale** (a percentage of the master's brightness) or **Limit** (cap at a maximum percentage). Great for keeping one room dimmer, e.g. a screen bias light capped low.

### Changed
- Color is now synced based on the master's active `color_mode` and guards against `None` color values, avoiding pushing empty color attributes to slaves.

[1.3.0]: https://github.com/gabry-ts/ha-light-sync-master/releases/tag/v1.3.0

## [1.2.0] - 2026-07-26

### Added
- Per-area "follow master" switches: one switch per area (`switch.<master>_follow_<area>`) so a room can be detached from the master while its lights stay on. Can be disabled via the new "Sync Behavior" option.
- Options changes now reload the entry automatically (`OptionsFlowWithReload`).

### Fixed
- Master light failed to be added on restart when its last state was `color_temp` (HA reports inactive color attributes as `None`, causing `TypeError: 'NoneType' object is not iterable`). State is now restored from the stored `color_mode` and only ever within supported color modes.
- Options page raised `AttributeError` on HA 2024.11+ because `OptionsFlow.config_entry` became a read-only property; removed the manual assignment.
- Editing options in one sub-step (behavior/advanced) no longer wipes the values set in the other; modifying slaves no longer resets all options.

[1.2.0]: https://github.com/gabry-ts/ha-light-sync-master/releases/tag/v1.2.0

## [1.1.0] - 2026-02-26

### Fixed
- Migrated color temperature from mireds to kelvin (`ATTR_COLOR_TEMP` → `ATTR_COLOR_TEMP_KELVIN`) to comply with HA 2026.1+ deprecation ([#8](https://github.com/gabry-ts/ha-light-sync-master/issues/8))

[1.1.0]: https://github.com/gabry-ts/ha-light-sync-master/releases/tag/v1.1.0

## [1.0.0] - 2025-11-20

### Added
- Initial release of Light Sync Master integration
- Virtual master light entity that controls multiple slave lights
- Real-time synchronization of color, brightness, and color temperature
- Sync enable/disable switch entity
- UI-based configuration (no YAML required)
- State persistence across Home Assistant restarts
- Options flow for reconfiguration
- Smooth transitions (configurable 0-10 seconds)
- English and Italian translations
- HACS compatibility
- Support for RGB, HS, XY color modes and color temperature
- Smart sync logic (only syncs to lights that are currently ON)
- Auto-sync when slave lights turn ON
- Configurable sync behavior on switch enable
- Error handling for unavailable slave lights
- Comprehensive logging (info, debug, warning levels)

### Features
- **Virtual Master Light**: Always ON, cannot be turned OFF
- **Sync Switch**: Enable/disable synchronization with one switch
- **Slave Auto-sync**: Newly turned ON slaves automatically match master state
- **Transition Support**: Configurable smooth transitions (0-10 seconds)
- **Multi-language**: Full English and Italian translations
- **Reconfigurable**: Easily modify slaves and settings via UI

### Technical Details
- Home Assistant 2024.1+ required
- Python 3.11+ required
- Event-driven architecture (no polling)
- RestoreEntity for state persistence
- EntitySelector for intuitive slave selection

[1.0.0]: https://github.com/gabry-ts/ha-light-sync-master/releases/tag/v1.0.0
