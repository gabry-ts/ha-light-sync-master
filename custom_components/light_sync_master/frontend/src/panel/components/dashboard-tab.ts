/**
 * Dashboard Tab Component
 * Overview with statistics and real-time status
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, LightSyncStatus, LightSyncConfig } from '../../types';
import { commonStyles } from '../../shared/styles';
import { getEntityColor, getBrightnessPercent, formatRelativeTime, getFriendlyName } from '../../shared/utils';

@customElement('dashboard-tab')
export class DashboardTab extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public status!: LightSyncStatus;
  @property({ attribute: false }) public config!: LightSyncConfig;
  @property({ type: String }) public entryId!: string;

  private async _toggleSync() {
    const entity_id = this.status.sync_switch.entity_id;
    const service = this.status.sync_switch.state ? 'turn_off' : 'turn_on';
    await this.hass.callService('switch', service, { entity_id });
  }

  private async _adjustBrightness(value: number) {
    const entity_id = this.status.master_light.entity_id;
    await this.hass.callService('light', 'turn_on', {
      entity_id,
      brightness: value
    });
  }

  private _renderStatistics() {
    const stats = this.status.statistics;

    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:chart-line"></ha-icon>
          Statistiche
        </h2>
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${stats.active_lights}</div>
                <div class="stat-label">Luci Attive</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:lightbulb-on"></ha-icon>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${stats.total_lights}</div>
                <div class="stat-label">Totale Luci</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:lightbulb-group"></ha-icon>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${stats.syncs_today}</div>
                <div class="stat-label">Sync Oggi</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:sync"></ha-icon>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${stats.total_syncs}</div>
                <div class="stat-label">Sync Totali</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:counter"></ha-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderMasterLight() {
    const master = this.status.master_light;
    const color = getEntityColor(this.hass.states[master.entity_id]);
    const brightness = getBrightnessPercent(master.brightness);

    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:lightbulb"></ha-icon>
          Master Light
        </h2>
        <div class="card">
          <div class="master-light-display">
            <div class="color-display" style="background: ${color}">
              <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
            </div>
            <div class="master-info">
              <div class="master-name">${getFriendlyName(this.hass, master.entity_id)}</div>
              <div class="master-details">
                <div class="detail-item">
                  <ha-icon icon="mdi:brightness-6"></ha-icon>
                  <span>${brightness}%</span>
                </div>
                ${master.rgb_color ? html`
                  <div class="detail-item">
                    <ha-icon icon="mdi:palette"></ha-icon>
                    <span>RGB(${master.rgb_color.join(', ')})</span>
                  </div>
                ` : ''}
              </div>
              <div class="brightness-control">
                <ha-icon icon="mdi:brightness-5"></ha-icon>
                <input
                  type="range"
                  min="1"
                  max="255"
                  .value=${master.brightness.toString()}
                  @input=${(e: Event) => {
                    const value = parseInt((e.target as HTMLInputElement).value);
                    this._adjustBrightness(value);
                  }}
                />
                <span>${brightness}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderSyncControl() {
    const syncSwitch = this.status.sync_switch;
    const isOn = syncSwitch.state;

    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:sync"></ha-icon>
          Sincronizzazione
        </h2>
        <div class="card">
          <div class="sync-control">
            <div class="sync-status">
              <ha-icon icon="mdi:${isOn ? 'sync' : 'sync-off'}"></ha-icon>
              <div class="col">
                <div class="sync-label">Sincronizzazione ${isOn ? 'Attiva' : 'Disattiva'}</div>
                ${this.status.last_sync ? html`
                  <div class="sync-time">Ultima sync: ${formatRelativeTime(this.status.last_sync)}</div>
                ` : html`
                  <div class="sync-time">Nessuna sincronizzazione recente</div>
                `}
              </div>
            </div>
            <ha-switch
              .checked=${isOn}
              @change=${this._toggleSync}
            ></ha-switch>
          </div>
        </div>
      </div>
    `;
  }

  private _renderSlaveStatus() {
    const slaves = this.status.slave_lights;

    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
          Stato Luci Slave
        </h2>
        <div class="slaves-grid">
          ${slaves.map(slave => {
            const color = slave.rgb_color ? `rgb(${slave.rgb_color.join(',')})` : '#ccc';
            const isOn = slave.state === 'on';

            return html`
              <div class="slave-card ${!slave.available ? 'unavailable' : ''}">
                <div class="slave-header">
                  <div class="color-preview" style="background: ${isOn ? color : '#333'}"></div>
                  <div class="slave-name">${slave.name}</div>
                  <span class="badge ${isOn ? 'success' : ''}">
                    ${isOn ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div class="slave-details">
                  ${isOn && slave.brightness ? html`
                    <div class="detail-row">
                      <ha-icon icon="mdi:brightness-6"></ha-icon>
                      <span>${getBrightnessPercent(slave.brightness)}%</span>
                    </div>
                  ` : ''}
                  <div class="detail-row">
                    <ha-icon icon="mdi:${slave.is_synced ? 'check-circle' : 'close-circle'}"></ha-icon>
                    <span>${slave.is_synced ? 'Sincronizzato' : 'Non sincronizzato'}</span>
                  </div>
                  ${!slave.available ? html`
                    <div class="detail-row error">
                      <ha-icon icon="mdi:alert"></ha-icon>
                      <span>Non disponibile</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderNextSchedule() {
    if (!this.status.next_schedule) {
      return html``;
    }

    const schedule = this.status.next_schedule;
    const color = `rgb(${schedule.rgb_color.join(',')})`;
    const brightness = getBrightnessPercent(schedule.brightness);

    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:clock-check"></ha-icon>
          Prossima Schedule
        </h2>
        <div class="card next-schedule">
          <div class="row space-between">
            <div class="col" style="flex: 1">
              <div class="schedule-name">${schedule.name}</div>
              <div class="schedule-time">
                <ha-icon icon="mdi:clock-outline"></ha-icon>
                ${new Date(schedule.trigger_time).toLocaleString('it-IT')}
              </div>
            </div>
            <div class="schedule-preview">
              <div class="color-preview large" style="background: ${color}">
                <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
              </div>
              <div class="schedule-brightness">${brightness}%</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="dashboard">
        ${this._renderStatistics()}
        <div class="grid grid-2">
          <div>
            ${this._renderMasterLight()}
            ${this._renderSyncControl()}
          </div>
          <div>
            ${this._renderNextSchedule()}
            ${this._renderSlaveStatus()}
          </div>
        </div>
      </div>
    `;
  }

  static styles = [
    commonStyles,
    css`
      .dashboard {
        max-width: 1400px;
        margin: 0 auto;
      }

      .master-light-display {
        display: flex;
        gap: 24px;
        align-items: center;
      }

      .color-display {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        flex-shrink: 0;
      }

      .brightness-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: black;
        border-radius: 50%;
        pointer-events: none;
      }

      .master-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .master-name {
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .master-details {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .brightness-control {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .brightness-control input[type="range"] {
        flex: 1;
        height: 4px;
        background: var(--divider-color);
        border-radius: 2px;
        outline: none;
        -webkit-appearance: none;
      }

      .brightness-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
      }

      .sync-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .sync-status {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .sync-status ha-icon {
        font-size: 32px;
        color: var(--primary-color);
      }

      .sync-label {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .sync-time {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .slaves-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 12px;
      }

      .slave-card {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        border: 1px solid var(--divider-color);
      }

      .slave-card.unavailable {
        opacity: 0.5;
      }

      .slave-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .slave-name {
        flex: 1;
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .slave-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-left: 44px;
      }

      .detail-row {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .detail-row.error {
        color: var(--error-color, #f44336);
      }

      .next-schedule {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        color: white;
      }

      .schedule-name {
        font-size: 18px;
        font-weight: 500;
      }

      .schedule-time {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        opacity: 0.9;
      }

      .schedule-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .schedule-brightness {
        font-size: 14px;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .master-light-display {
          flex-direction: column;
          text-align: center;
        }

        .slaves-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-tab': DashboardTab;
  }
}
