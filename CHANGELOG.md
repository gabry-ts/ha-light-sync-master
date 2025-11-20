# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
