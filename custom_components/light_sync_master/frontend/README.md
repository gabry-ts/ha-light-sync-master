# Light Sync Master Frontend

Frontend components for Light Sync Master Home Assistant integration.

## Features

- **Custom Panel**: Full-featured sidebar panel with 4 tabs
  - Dashboard: Overview with real-time statistics
  - Lights: Configuration and management
  - Schedules: Timeline and calendar views
  - Diagnostics: Real-time logs and tools

- **Lovelace Card**: Configurable card with 3 layouts (small/medium/large)

## Development

### Prerequisites

- Node.js 18+ and npm

### Build

```bash
cd custom_components/light_sync_master/frontend
npm install
npm run build
```

Built files will be output to `../www/`:
- `light-sync-panel.js` - Custom panel
- `light-sync-card.js` - Lovelace card

### Watch Mode

For development with auto-rebuild:

```bash
npm run watch
```

## Technologies

- **Lit Element 3** - Web components framework
- **TypeScript** - Type-safe development
- **Chart.js** - Timeline visualizations
- **Rollup** - Module bundler

## File Structure

```
frontend/
├── src/
│   ├── panel/                    # Sidebar panel
│   │   ├── light-sync-panel.ts   # Main panel component
│   │   └── components/           # Tab components
│   │       ├── dashboard-tab.ts
│   │       ├── lights-tab.ts
│   │       ├── schedules-tab.ts
│   │       └── diagnostics-tab.ts
│   ├── card/                     # Lovelace card
│   │   └── light-sync-card.ts
│   ├── shared/                   # Shared utilities
│   │   ├── utils.ts
│   │   └── styles.ts
│   └── types.ts                  # TypeScript definitions
├── package.json
├── tsconfig.json
└── rollup.config.js
```

## Integration

The panel and card are automatically registered when the integration loads.

### Panel Access

Access the panel from the Home Assistant sidebar: **Light Sync**

### Lovelace Card Usage

Add to your dashboard:

```yaml
type: custom:light-sync-card
entity: light.lsm_your_master_light
layout: medium  # small, medium, or large
show_brightness: true
show_next_schedule: true
show_slave_count: true
```

## License

MIT
