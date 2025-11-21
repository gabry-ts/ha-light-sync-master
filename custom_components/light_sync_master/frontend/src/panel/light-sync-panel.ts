/**
 * Light Sync Master Panel
 * Main panel component with tabbed interface
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LightSyncStatus, LightSyncConfig } from '../types';
import { commonStyles } from '../shared/styles';
import { fetchApi } from '../shared/utils';

import './components/dashboard-tab';
import './components/lights-tab';
import './components/schedules-tab';
import './components/diagnostics-tab';

type TabType = 'dashboard' | 'lights' | 'schedules' | 'diagnostics';

@customElement('light-sync-panel')
export class LightSyncPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: String }) public panel!: any;

  @state() private _activeTab: TabType = 'dashboard';
  @state() private _status?: LightSyncStatus;
  @state() private _config?: LightSyncConfig;
  @state() private _loading = true;
  @state() private _error?: string;

  private _wsUnsubscribe?: () => void;
  private _updateInterval?: number;

  connectedCallback() {
    super.connectedCallback();
    this._loadData();
    this._setupWebSocket();
    // Fallback polling every 5 seconds
    this._updateInterval = window.setInterval(() => this._loadData(), 5000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._wsUnsubscribe) {
      this._wsUnsubscribe();
    }
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
    }
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass) {
      this._updateFromHass();
    }
  }

  private async _loadData() {
    try {
      this._loading = true;
      this._error = undefined;

      // Get entry_id from panel config
      const entryId = this.panel?.config?.entry_id;
      if (!entryId) {
        throw new Error('No entry_id found in panel config');
      }

      // Load status and config
      const [status, config] = await Promise.all([
        fetchApi<LightSyncStatus>(this.hass, `/api/light_sync_master/${entryId}/status`),
        fetchApi<LightSyncConfig>(this.hass, `/api/light_sync_master/${entryId}/config`)
      ]);

      this._status = status;
      this._config = config;
      this._loading = false;
    } catch (err: any) {
      console.error('Error loading Light Sync Master data:', err);
      this._error = err.message || 'Failed to load data';
      this._loading = false;
    }
  }

  private _setupWebSocket() {
    // Subscribe to WebSocket updates
    if (!this.hass?.connection) return;

    this.hass.connection.subscribeMessage(
      (msg: any) => this._handleWsMessage(msg),
      {
        type: 'light_sync_master/subscribe',
        entry_id: this.panel?.config?.entry_id
      }
    ).then((unsub: () => void) => {
      this._wsUnsubscribe = unsub;
    }).catch((err: any) => {
      console.warn('WebSocket subscription failed, using polling:', err);
    });
  }

  private _handleWsMessage(msg: any) {
    if (msg.type === 'status_update') {
      this._status = msg.data;
    }
  }

  private _updateFromHass() {
    // Update status from hass.states if WebSocket is not available
    if (!this._status || !this._config) return;

    const masterEntity = this.hass.states[this._status.master_light.entity_id];
    const syncEntity = this.hass.states[this._status.sync_switch.entity_id];

    if (masterEntity) {
      this._status = {
        ...this._status,
        master_light: {
          entity_id: masterEntity.entity_id,
          state: masterEntity.state,
          brightness: masterEntity.attributes.brightness || 255,
          rgb_color: masterEntity.attributes.rgb_color,
          hs_color: masterEntity.attributes.hs_color,
          xy_color: masterEntity.attributes.xy_color,
          color_temp: masterEntity.attributes.color_temp
        }
      };
    }

    if (syncEntity) {
      this._status = {
        ...this._status,
        sync_switch: {
          entity_id: syncEntity.entity_id,
          state: syncEntity.state === 'on'
        }
      };
    }
  }

  private _handleTabClick(tab: TabType) {
    this._activeTab = tab;
  }

  private _renderTabs() {
    return html`
      <div class="tabs">
        <button
          class="tab ${this._activeTab === 'dashboard' ? 'active' : ''}"
          @click=${() => this._handleTabClick('dashboard')}
        >
          <ha-icon icon="mdi:view-dashboard"></ha-icon>
          <span>Dashboard</span>
        </button>
        <button
          class="tab ${this._activeTab === 'lights' ? 'active' : ''}"
          @click=${() => this._handleTabClick('lights')}
        >
          <ha-icon icon="mdi:lightbulb-group"></ha-icon>
          <span>Luci</span>
        </button>
        <button
          class="tab ${this._activeTab === 'schedules' ? 'active' : ''}"
          @click=${() => this._handleTabClick('schedules')}
        >
          <ha-icon icon="mdi:clock-outline"></ha-icon>
          <span>Schedule</span>
        </button>
        <button
          class="tab ${this._activeTab === 'diagnostics' ? 'active' : ''}"
          @click=${() => this._handleTabClick('diagnostics')}
        >
          <ha-icon icon="mdi:stethoscope"></ha-icon>
          <span>Diagnostica</span>
        </button>
      </div>
    `;
  }

  private _renderContent() {
    if (this._loading) {
      return html`
        <div class="loading">
          <div class="spinner"></div>
        </div>
      `;
    }

    if (this._error) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <h2>Errore</h2>
          <p>${this._error}</p>
          <button class="button" @click=${this._loadData}>Riprova</button>
        </div>
      `;
    }

    if (!this._status || !this._config) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:information"></ha-icon>
          <p>Nessun dato disponibile</p>
        </div>
      `;
    }

    const entryId = this.panel?.config?.entry_id;

    switch (this._activeTab) {
      case 'dashboard':
        return html`
          <dashboard-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${entryId}
          ></dashboard-tab>
        `;
      case 'lights':
        return html`
          <lights-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${entryId}
            @config-changed=${this._loadData}
          ></lights-tab>
        `;
      case 'schedules':
        return html`
          <schedules-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${entryId}
            @config-changed=${this._loadData}
          ></schedules-tab>
        `;
      case 'diagnostics':
        return html`
          <diagnostics-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${entryId}
          ></diagnostics-tab>
        `;
      default:
        return html``;
    }
  }

  render() {
    return html`
      <div class="panel">
        <div class="header">
          <h1>
            <ha-icon icon="mdi:lightbulb-group"></ha-icon>
            Light Sync Master
          </h1>
          ${this._config ? html`<span class="config-name">${this._config.name}</span>` : ''}
        </div>
        ${this._renderTabs()}
        <div class="content">
          ${this._renderContent()}
        </div>
      </div>
    `;
  }

  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color);
      }

      .panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: var(--card-background-color);
        padding: 16px 24px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--primary-text-color);
      }

      .header h1 ha-icon {
        color: var(--primary-color);
      }

      .config-name {
        font-size: 14px;
        color: var(--secondary-text-color);
        padding: 4px 12px;
        background: var(--secondary-background-color);
        border-radius: 16px;
      }

      .tabs {
        display: flex;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
        padding: 0 24px;
        gap: 8px;
      }

      .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .tab:hover {
        color: var(--primary-text-color);
        background: var(--secondary-background-color);
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      .tab ha-icon {
        font-size: 20px;
      }

      .content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }

      @media (max-width: 768px) {
        .header {
          padding: 12px 16px;
        }

        .header h1 {
          font-size: 20px;
        }

        .tabs {
          padding: 0 8px;
          overflow-x: auto;
        }

        .tab {
          padding: 12px 16px;
          font-size: 13px;
        }

        .tab span {
          display: none;
        }

        .content {
          padding: 16px;
        }
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'light-sync-panel': LightSyncPanel;
  }
}

// Register the panel
(window as any).customPanels = (window as any).customPanels || [];
(window as any).customPanels.push({
  name: 'light-sync-panel',
  path: 'light-sync',
  title: 'Light Sync Master',
  icon: 'mdi:lightbulb-group',
  component: 'light-sync-panel'
});
