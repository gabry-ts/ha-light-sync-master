# Frontend Built Files

This directory contains the built frontend files for Light Sync Master.

## Files

- `light-sync-panel.js` - Custom sidebar panel
- `light-sync-card.js` - Lovelace card component

## Building

To rebuild the frontend:

```bash
cd ../frontend
npm install
npm run build
```

Files will be automatically output to this directory.

## Note

These files are automatically served by Home Assistant at `/<domain>/` when the integration loads.
