# Light Sync Master for Home Assistant

A custom Home Assistant integration that creates a virtual master light to synchronize multiple slave lights in real-time.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/gabry-ts/ha-light-sync-master)

## Features

- **Virtual Master Light**: Create a virtual light entity that controls multiple physical lights
- **Real-time Synchronization**: Changes to the master light (color, brightness, temperature) instantly propagate to all slave lights
- **Sync Switch**: Enable/disable synchronization with a simple switch
- **UI Configuration**: Complete setup through Home Assistant UI (no YAML required)
- **Smart Sync Logic**: Only syncs to lights that are currently ON
- **Auto-sync on Turn On**: When a slave light turns on, it automatically matches the master's state
- **Persistent State**: All settings and states persist across Home Assistant restarts
- **Reconfigurable**: Easily modify slave lights and settings through the options flow
- **Transition Support**: Smooth color/brightness transitions (configurable 0-10 seconds)
- **Multi-language**: English and Italian translations included

## Use Case

Control multiple lights simultaneously by changing a single virtual master light. Perfect for:
- Synchronizing bedroom lamps
- Coordinating living room lighting
- Managing multiple RGB strips as one
- Creating unified lighting scenes across rooms

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Integrations"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/gabry-ts/ha-light-sync-master`
6. Select category: "Integration"
7. Click "Add"
8. Click "Install" on the Light Sync Master card
9. Restart Home Assistant

### Manual Installation

1. Download the `light_sync_master` folder from this repository
2. Copy it to your `custom_components` directory in your Home Assistant config folder
3. Restart Home Assistant

## Configuration

### Initial Setup

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration**
3. Search for "Light Sync Master"
4. Enter a name for your master light (e.g., "Master Bedroom")
5. Select the slave lights you want to control
6. Click **Create**

Two entities will be created:
- `light.lsm_<name>` - The virtual master light
- `switch.lsm_<name>` - The sync enable/disable switch

### Options

After setup, you can modify settings by clicking **Configure** on the integration card:

#### Modify Slave Lights
- Add or remove slave lights from synchronization

#### Sync Behavior Settings
- **Default sync state on restart**: Enable/disable sync by default when HA restarts
- **Immediately sync on enable**: Sync all ON slaves when turning on the sync switch

#### Advanced Options
- **Transition time**: Set smooth transition duration (0-10 seconds)
- **Enable debug logging**: Turn on detailed logging for troubleshooting

## Usage

### Basic Usage

1. **Control the Master Light**:
   - Change color, brightness, or color temperature of `light.lsm_<name>`
   - All slave lights that are ON will automatically update to match

2. **Enable/Disable Sync**:
   - Turn `switch.lsm_<name>` ON to enable synchronization
   - Turn it OFF to disable (lights keep their current state)

3. **Individual Light Control**:
   - Turn slave lights ON/OFF individually
   - When a slave turns ON, it immediately syncs to the master's state
   - When OFF, it's not affected by master changes

### Example Automation

```yaml
# Disable sync at bedtime
automation:
  - alias: "Disable bedroom sync at night"
    trigger:
      - platform: time
        at: "23:00:00"
    action:
      - service: switch.turn_off
        target:
          entity_id: switch.lsm_master_bedroom

  - alias: "Enable bedroom sync in morning"
    trigger:
      - platform: time
        at: "07:00:00"
    action:
      - service: switch.turn_on
        target:
          entity_id: switch.lsm_master_bedroom
```

### Lovelace Card Example

```yaml
type: vertical-stack
cards:
  - type: light
    entity: light.lsm_master_bedroom
    name: Master Bedroom Light
  - type: entities
    entities:
      - entity: switch.lsm_master_bedroom
        name: Sync Enabled
  - type: entities
    title: Slave Lights
    entities:
      - light.bedroom_lamp_1
      - light.bedroom_lamp_2
      - light.hallway_spots
```

## How It Works

### Synchronization Logic

1. **Master Light Changes**:
   - When you change the master light's color/brightness/temperature
   - If sync switch is ON
   - All slave lights that are currently ON will update to match

2. **Slave Light Turns ON**:
   - When a slave light turns ON
   - If sync switch is ON
   - The slave immediately adopts the master's current state

3. **Sync Switch Turns ON**:
   - All currently ON slave lights immediately sync to master state

4. **Sync Switch Turns OFF**:
   - Synchronization stops
   - Slave lights keep their current state
   - No changes are propagated

### Important Notes

- **Master Light Cannot Turn OFF**: The master light is always ON (it's virtual)
- **Only ON Slaves Sync**: Lights that are OFF are not affected by master changes
- **Unavailable Slaves**: If a slave is unavailable, it's skipped with a warning in logs
- **No Effect Sync**: Light effects are not synchronized (only color, brightness, temperature)

## Troubleshooting

### Master light doesn't sync slaves

- Check that the sync switch is ON
- Verify slave lights are turned ON
- Check Home Assistant logs for warnings/errors

### Slave lights are not in the list

- Make sure they are light entities (domain: `light`)
- Restart Home Assistant after adding new lights
- Check they appear in **Developer Tools** → **States**

### Sync is slow or delayed

- Reduce the number of slave lights
- Decrease transition time in advanced options
- Check your Home Assistant system performance

### Enable Debug Logging

Add to `configuration.yaml`:

```yaml
logger:
  default: info
  logs:
    custom_components.light_sync_master: debug
```

Restart Home Assistant and check logs in **Settings** → **System** → **Logs**

## Technical Details

- **Platform**: Home Assistant 2024.1+
- **Language**: Python 3.11+
- **Configuration**: UI-based (config_flow)
- **State Persistence**: RestoreEntity for all entities
- **Event-driven**: Uses state change listeners (no polling)
- **Supported Color Modes**: RGB, HS, XY, Color Temperature

## Limitations (v1.0)

- Master light cannot be turned OFF (always ON by design)
- Light effects are not synchronized
- No bidirectional sync (slave changes don't affect master)
- No per-slave attribute selection

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/gabry-ts/ha-light-sync-master/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gabry-ts/ha-light-sync-master/discussions)

## License

MIT License - See LICENSE file for details

## Credits

Developed by Gabriele

---

**If you find this integration useful, please star the repository!**
