/**
 * Light Sync Master Lovelace Card
 * Configurable card with small/medium/large layouts
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LightSyncCardConfig } from '../types';
import { getEntityColor, getBrightnessPercent, formatRelativeTime, getFriendlyName } from '../shared/utils';

@customElement('light-sync-card')
export class LightSyncCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: LightSyncCardConfig;

  public setConfig(config: LightSyncCardConfig): void {
    if (!config.entity) {
      throw new Error('You need to define an entity (master light)');
    }

    this._config = {
      layout: 'medium',
      show_brightness: true,
      show_next_schedule: true,
      show_slave_count: true,
      ...config,
      type: 'custom:light-sync-card'
    };
  }

  public getCardSize(): number {
    switch (this._config.layout) {
      case 'small': return 2;
      case 'large': return 5;
      default: return 3;
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }

    if (changedProps.has('hass') && this.hass && this._config) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass) return true;

      const masterEntity = this.hass.states[this._config.entity];
      const oldMasterEntity = oldHass.states[this._config.entity];

      if (!masterEntity || !oldMasterEntity) return true;

      return (
        masterEntity.state !== oldMasterEntity.state ||
        JSON.stringify(masterEntity.attributes) !== JSON.stringify(oldMasterEntity.attributes)
      );
    }

    return false;
  }

  private _getSyncSwitchEntity(): string | null {
    // Convert light.lsm_xxx to switch.lsm_xxx
    const entityId = this._config.entity;
    if (entityId.startsWith('light.lsm_')) {
      return entityId.replace('light.lsm_', 'switch.lsm_');
    }
    return null;
  }

  private _getSlaveEntities(): any[] {
    // This would need to be provided by config or fetched from API
    // For now, return empty array
    return [];
  }

  private async _toggleSync() {
    const switchEntity = this._getSyncSwitchEntity();
    if (!switchEntity) return;

    const syncSwitch = this.hass.states[switchEntity];
    const service = syncSwitch?.state === 'on' ? 'turn_off' : 'turn_on';

    await this.hass.callService('switch', service, { entity_id: switchEntity });
  }

  private async _adjustBrightness(value: number) {
    await this.hass.callService('light', 'turn_on', {
      entity_id: this._config.entity,
      brightness: value
    });
  }

  private _openPanel() {
    window.location.href = '/light-sync';
  }

  private _renderSmallLayout() {
    const masterEntity = this.hass.states[this._config.entity];
    if (!masterEntity) {
      return html`<div class="error">Entità non trovata: ${this._config.entity}</div>`;
    }

    const color = getEntityColor(masterEntity);
    const brightness = getBrightnessPercent(masterEntity.attributes.brightness || 255);
    const syncSwitch = this._getSyncSwitchEntity();
    const isSyncOn = syncSwitch ? this.hass.states[syncSwitch]?.state === 'on' : false;

    return html`
      <div class="small-layout" @click=${this._openPanel}>
        <div class="color-display" style="background: ${color}">
          <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
          <div class="sync-indicator ${isSyncOn ? 'active' : ''}">
            <ha-icon icon="mdi:sync"></ha-icon>
          </div>
        </div>
        <div class="info">
          <div class="name">${this._config.name || getFriendlyName(this.hass, this._config.entity)}</div>
          <div class="brightness">${brightness}%</div>
        </div>
      </div>
    `;
  }

  private _renderMediumLayout() {
    const masterEntity = this.hass.states[this._config.entity];
    if (!masterEntity) {
      return html`<div class="error">Entità non trovata: ${this._config.entity}</div>`;
    }

    const color = getEntityColor(masterEntity);
    const brightness = getBrightnessPercent(masterEntity.attributes.brightness || 255);
    const syncSwitch = this._getSyncSwitchEntity();
    const isSyncOn = syncSwitch ? this.hass.states[syncSwitch]?.state === 'on' : false;

    return html`
      <div class="medium-layout">
        <div class="header" @click=${this._openPanel}>
          <div class="color-preview" style="background: ${color}">
            <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
          </div>
          <div class="header-info">
            <div class="name">${this._config.name || getFriendlyName(this.hass, this._config.entity)}</div>
            <div class="subtitle">Master Light</div>
          </div>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </div>

        ${this._config.show_brightness ? html`
          <div class="brightness-control">
            <ha-icon icon="mdi:brightness-6"></ha-icon>
            <input
              type="range"
              min="1"
              max="255"
              .value=${masterEntity.attributes.brightness?.toString() || '255'}
              @input=${(e: Event) => {
                const value = parseInt((e.target as HTMLInputElement).value);
                this._adjustBrightness(value);
              }}
              @click=${(e: Event) => e.stopPropagation()}
            />
            <span>${brightness}%</span>
          </div>
        ` : ''}

        <div class="footer">
          <button class="sync-toggle ${isSyncOn ? 'active' : ''}" @click=${this._toggleSync}>
            <ha-icon icon="mdi:sync"></ha-icon>
            <span>Sync ${isSyncOn ? 'ON' : 'OFF'}</span>
          </button>
          ${this._config.show_slave_count ? html`
            <div class="slave-count">
              <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
              <span>${this._getSlaveEntities().length} luci</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private _renderLargeLayout() {
    const masterEntity = this.hass.states[this._config.entity];
    if (!masterEntity) {
      return html`<div class="error">Entità non trovata: ${this._config.entity}</div>`;
    }

    const color = getEntityColor(masterEntity);
    const brightness = getBrightnessPercent(masterEntity.attributes.brightness || 255);
    const syncSwitch = this._getSyncSwitchEntity();
    const isSyncOn = syncSwitch ? this.hass.states[syncSwitch]?.state === 'on' : false;
    const rgb = masterEntity.attributes.rgb_color;

    return html`
      <div class="large-layout">
        <div class="header" @click=${this._openPanel}>
          <ha-icon icon="mdi:lightbulb-group"></ha-icon>
          <div class="header-info">
            <div class="name">${this._config.name || getFriendlyName(this.hass, this._config.entity)}</div>
            <div class="subtitle">Light Sync Master</div>
          </div>
          <ha-icon icon="mdi:open-in-new"></ha-icon>
        </div>

        <div class="color-section">
          <div class="color-display-large" style="background: ${color}">
            <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
          </div>
          <div class="color-info">
            <div class="color-label">Colore Attuale</div>
            <div class="color-value">${rgb ? `RGB(${rgb.join(', ')})` : 'N/A'}</div>
            <div class="brightness-value">${brightness}%</div>
          </div>
        </div>

        ${this._config.show_brightness ? html`
          <div class="brightness-control">
            <div class="control-label">Luminosità</div>
            <div class="slider-row">
              <ha-icon icon="mdi:brightness-5"></ha-icon>
              <input
                type="range"
                min="1"
                max="255"
                .value=${masterEntity.attributes.brightness?.toString() || '255'}
                @input=${(e: Event) => {
                  const value = parseInt((e.target as HTMLInputElement).value);
                  this._adjustBrightness(value);
                }}
              />
              <span class="brightness-label">${brightness}%</span>
            </div>
          </div>
        ` : ''}

        <div class="sync-section">
          <button class="sync-button ${isSyncOn ? 'active' : ''}" @click=${this._toggleSync}>
            <ha-icon icon="mdi:sync${isSyncOn ? '' : '-off'}"></ha-icon>
            <div>
              <div class="sync-label">Sincronizzazione</div>
              <div class="sync-status">${isSyncOn ? 'Attiva' : 'Disattiva'}</div>
            </div>
          </button>
        </div>

        ${this._config.show_slave_count ? html`
          <div class="stats-row">
            <div class="stat-item">
              <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
              <div>
                <div class="stat-value">${this._getSlaveEntities().length}</div>
                <div class="stat-label">Luci Slave</div>
              </div>
            </div>
            <div class="stat-item">
              <ha-icon icon="mdi:lightbulb-on"></ha-icon>
              <div>
                <div class="stat-value">${this._getSlaveEntities().filter((e: any) => e.state === 'on').length}</div>
                <div class="stat-label">Accese</div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) {
      return html`<div class="error">Configurazione mancante</div>`;
    }

    const layout = this._config.layout || 'medium';

    return html`
      <ha-card>
        ${layout === 'small' ? this._renderSmallLayout() : ''}
        ${layout === 'medium' ? this._renderMediumLayout() : ''}
        ${layout === 'large' ? this._renderLargeLayout() : ''}
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      --lsm-primary-color: var(--primary-color);
      --lsm-text-color: var(--primary-text-color);
      --lsm-secondary-text-color: var(--secondary-text-color);
      --lsm-card-background: var(--card-background-color);
      --lsm-divider-color: var(--divider-color);
    }

    ha-card {
      padding: 16px;
      cursor: default;
    }

    .error {
      color: var(--error-color);
      padding: 16px;
      text-align: center;
    }

    /* Small Layout */
    .small-layout {
      display: flex;
      gap: 16px;
      align-items: center;
      cursor: pointer;
    }

    .small-layout .color-display {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .brightness-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: black;
      border-radius: inherit;
    }

    .sync-indicator {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--lsm-card-background);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--lsm-card-background);
      color: var(--lsm-secondary-text-color);
    }

    .sync-indicator.active {
      color: var(--lsm-primary-color);
    }

    .small-layout .info {
      flex: 1;
    }

    .small-layout .name {
      font-size: 16px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .small-layout .brightness {
      font-size: 14px;
      color: var(--lsm-secondary-text-color);
    }

    /* Medium Layout */
    .medium-layout {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 4px;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .header:hover {
      background: var(--lsm-divider-color);
    }

    .color-preview {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }

    .header-info {
      flex: 1;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .subtitle {
      font-size: 12px;
      color: var(--lsm-secondary-text-color);
    }

    .brightness-control {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }

    .brightness-control input[type="range"] {
      flex: 1;
      height: 4px;
      background: var(--lsm-divider-color);
      border-radius: 2px;
      outline: none;
      -webkit-appearance: none;
    }

    .brightness-control input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--lsm-primary-color);
      cursor: pointer;
    }

    .brightness-control span {
      font-size: 14px;
      font-weight: 500;
      color: var(--lsm-text-color);
      min-width: 40px;
      text-align: right;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .sync-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 2px solid var(--lsm-divider-color);
      border-radius: 8px;
      background: transparent;
      color: var(--lsm-secondary-text-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;
    }

    .sync-toggle:hover {
      background: var(--lsm-divider-color);
    }

    .sync-toggle.active {
      border-color: var(--lsm-primary-color);
      background: var(--lsm-primary-color);
      color: white;
    }

    .slave-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--lsm-secondary-text-color);
    }

    /* Large Layout */
    .large-layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .color-section {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .color-display-large {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 16px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .color-info {
      flex: 1;
    }

    .color-label {
      font-size: 12px;
      color: var(--lsm-secondary-text-color);
      margin-bottom: 4px;
    }

    .color-value {
      font-size: 16px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .brightness-value {
      font-size: 24px;
      font-weight: 600;
      color: var(--lsm-primary-color);
      margin-top: 4px;
    }

    .control-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--lsm-secondary-text-color);
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brightness-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--lsm-text-color);
      min-width: 50px;
      text-align: right;
    }

    .sync-section {
      border-top: 1px solid var(--lsm-divider-color);
      padding-top: 16px;
    }

    .sync-button {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px;
      border: 2px solid var(--lsm-divider-color);
      border-radius: 12px;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .sync-button ha-icon {
      font-size: 32px;
      color: var(--lsm-secondary-text-color);
    }

    .sync-button:hover {
      background: var(--lsm-divider-color);
    }

    .sync-button.active {
      border-color: var(--lsm-primary-color);
      background: var(--lsm-primary-color);
    }

    .sync-button.active ha-icon,
    .sync-button.active .sync-label,
    .sync-button.active .sync-status {
      color: white;
    }

    .sync-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .sync-status {
      font-size: 12px;
      color: var(--lsm-secondary-text-color);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }

    .stat-item ha-icon {
      font-size: 32px;
      color: var(--lsm-primary-color);
    }

    .stat-value {
      font-size: 20px;
      font-weight: 600;
      color: var(--lsm-text-color);
    }

    .stat-label {
      font-size: 11px;
      color: var(--lsm-secondary-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'light-sync-card': LightSyncCard;
  }

  interface Window {
    customCards: any[];
  }
}

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'light-sync-card',
  name: 'Light Sync Master Card',
  description: 'Card per il controllo del Light Sync Master',
  preview: true,
  documentationURL: 'https://github.com/gabry-ts/ha-light-sync-master'
});

// For backward compatibility
(window as any).customElements.define('light-sync-card', LightSyncCard);
