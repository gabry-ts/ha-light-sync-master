/**
 * Diagnostics Tab Component
 * Real-time logs and diagnostics tools
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LightSyncStatus, LightSyncConfig, SyncLog } from '../../types';
import { commonStyles } from '../../shared/styles';
import { formatRelativeTime, fetchApi, postApi } from '../../shared/utils';

@customElement('diagnostics-tab')
export class DiagnosticsTab extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public status!: LightSyncStatus;
  @property({ attribute: false }) public config!: LightSyncConfig;
  @property({ type: String }) public entryId!: string;

  @state() private _logs: SyncLog[] = [];
  @state() private _autoScroll = true;
  @state() private _filterType: string = 'all';
  @state() private _testing = false;

  private _logsContainer?: HTMLElement;
  private _updateInterval?: number;

  connectedCallback() {
    super.connectedCallback();
    this._loadLogs();
    // Update logs every 2 seconds
    this._updateInterval = window.setInterval(() => this._loadLogs(), 2000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
    }
  }

  protected firstUpdated() {
    this._logsContainer = this.shadowRoot?.querySelector('.logs-content') as HTMLElement;
  }

  protected updated() {
    if (this._autoScroll && this._logsContainer) {
      this._logsContainer.scrollTop = this._logsContainer.scrollHeight;
    }
  }

  private async _loadLogs() {
    try {
      const logs = await fetchApi<SyncLog[]>(
        this.hass,
        `/api/light_sync_master/${this.entryId}/logs`
      );
      this._logs = logs;
    } catch (err) {
      console.error('Error loading logs:', err);
    }
  }

  private async _clearLogs() {
    if (!confirm('Vuoi davvero cancellare tutti i log?')) {
      return;
    }

    try {
      await postApi(this.hass, `/api/light_sync_master/${this.entryId}/clear_logs`, {});
      this._logs = [];
    } catch (err) {
      console.error('Error clearing logs:', err);
      alert('Errore nella cancellazione dei log');
    }
  }

  private async _testAllLights() {
    this._testing = true;
    try {
      await postApi(this.hass, `/api/light_sync_master/${this.entryId}/test_all_lights`, {});
      alert('Test connettività avviato! Controlla i log per i risultati.');
    } catch (err) {
      console.error('Error testing lights:', err);
      alert('Errore nel test delle luci');
    } finally {
      this._testing = false;
    }
  }

  private async _exportConfig() {
    try {
      const config = await fetchApi<any>(
        this.hass,
        `/api/light_sync_master/${this.entryId}/export_config`
      );

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `light-sync-master-config-${this.config.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting config:', err);
      alert('Errore nell\'esportazione della configurazione');
    }
  }

  private _getFilteredLogs(): SyncLog[] {
    if (this._filterType === 'all') {
      return this._logs;
    }
    return this._logs.filter(log => log.type === this._filterType);
  }

  private _getLogIcon(type: string): string {
    switch (type) {
      case 'sync': return 'mdi:sync';
      case 'schedule': return 'mdi:clock-check';
      case 'error': return 'mdi:alert-circle';
      case 'info': return 'mdi:information';
      default: return 'mdi:circle';
    }
  }

  private _getLogClass(type: string): string {
    switch (type) {
      case 'sync': return 'info';
      case 'schedule': return 'success';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return '';
    }
  }

  private _renderLogStream() {
    const filteredLogs = this._getFilteredLogs();

    return html`
      <div class="section">
        <div class="row space-between">
          <h2 class="section-title">
            <ha-icon icon="mdi:text-box-multiple"></ha-icon>
            Log Stream (${filteredLogs.length})
          </h2>
          <div class="row" style="gap: 8px">
            <select
              .value=${this._filterType}
              @change=${(e: Event) => {
                this._filterType = (e.target as HTMLSelectElement).value;
              }}
              class="filter-select"
            >
              <option value="all">Tutti i log</option>
              <option value="sync">Sincronizzazioni</option>
              <option value="schedule">Schedule</option>
              <option value="error">Errori</option>
              <option value="info">Info</option>
            </select>
            <label class="auto-scroll-toggle">
              <input
                type="checkbox"
                .checked=${this._autoScroll}
                @change=${(e: Event) => {
                  this._autoScroll = (e.target as HTMLInputElement).checked;
                }}
              />
              Auto-scroll
            </label>
            <button class="icon-button" @click=${this._clearLogs} title="Cancella log">
              <ha-icon icon="mdi:delete"></ha-icon>
            </button>
          </div>
        </div>

        <div class="card logs-container">
          <div class="logs-content">
            ${filteredLogs.length === 0 ? html`
              <div class="empty-state">
                <ha-icon icon="mdi:text-box-remove"></ha-icon>
                <p>Nessun log disponibile</p>
              </div>
            ` : filteredLogs.map(log => html`
              <div class="log-entry ${this._getLogClass(log.type)}">
                <div class="log-icon">
                  <ha-icon icon="${this._getLogIcon(log.type)}"></ha-icon>
                </div>
                <div class="log-content">
                  <div class="log-header">
                    <span class="log-time">${formatRelativeTime(log.timestamp)}</span>
                    <span class="badge ${this._getLogClass(log.type)}">${log.type.toUpperCase()}</span>
                  </div>
                  <div class="log-message">${log.message}</div>
                  ${log.entity_id ? html`
                    <div class="log-entity">${log.entity_id}</div>
                  ` : ''}
                  ${log.details ? html`
                    <details class="log-details">
                      <summary>Dettagli</summary>
                      <pre>${JSON.stringify(log.details, null, 2)}</pre>
                    </details>
                  ` : ''}
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  private _renderSystemInfo() {
    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:information"></ha-icon>
          Informazioni Sistema
        </h2>
        <div class="card">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Entry ID</div>
              <div class="info-value">${this.entryId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Nome Configurazione</div>
              <div class="info-value">${this.config.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Luci Totali</div>
              <div class="info-value">${this.config.slave_entities.length}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Schedule Attive</div>
              <div class="info-value">
                ${(this.config.schedules || []).filter(s => s.enabled).length} /
                ${(this.config.schedules || []).length}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Tempo Transizione</div>
              <div class="info-value">${this.config.transition_time}s</div>
            </div>
            <div class="info-item">
              <div class="info-label">Debug Logging</div>
              <div class="info-value">
                <span class="badge ${this.config.enable_debug_logging ? 'success' : ''}">
                  ${this.config.enable_debug_logging ? 'Attivo' : 'Disattivo'}
                </span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Sync Default</div>
              <div class="info-value">
                <span class="badge ${this.config.sync_enabled_default ? 'success' : ''}">
                  ${this.config.sync_enabled_default ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Sync on Enable</div>
              <div class="info-value">
                <span class="badge ${this.config.sync_on_enable ? 'success' : ''}">
                  ${this.config.sync_on_enable ? 'Sì' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderTools() {
    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:tools"></ha-icon>
          Strumenti Diagnostica
        </h2>
        <div class="grid grid-2">
          <div class="card tool-card">
            <ha-icon icon="mdi:lightbulb-group"></ha-icon>
            <div class="tool-info">
              <div class="tool-title">Test Connettività Luci</div>
              <div class="tool-description">
                Verifica lo stato e la disponibilità di tutte le luci slave
              </div>
            </div>
            <button
              class="button"
              @click=${this._testAllLights}
              ?disabled=${this._testing}
            >
              ${this._testing ? 'Test in corso...' : 'Avvia Test'}
            </button>
          </div>

          <div class="card tool-card">
            <ha-icon icon="mdi:download"></ha-icon>
            <div class="tool-info">
              <div class="tool-title">Esporta Configurazione</div>
              <div class="tool-description">
                Scarica la configurazione completa in formato JSON
              </div>
            </div>
            <button class="button secondary" @click=${this._exportConfig}>
              Esporta
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderStatistics() {
    const stats = this.status.statistics;
    const uptime = stats.uptime || 'N/A';

    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:chart-box"></ha-icon>
          Statistiche Dettagliate
        </h2>
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="stat-value">${stats.total_syncs}</div>
            <div class="stat-label">Sincronizzazioni Totali</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.syncs_today}</div>
            <div class="stat-label">Sincronizzazioni Oggi</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.active_lights}</div>
            <div class="stat-label">Luci Attive</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${uptime}</div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="diagnostics-tab">
        ${this._renderStatistics()}
        ${this._renderSystemInfo()}
        ${this._renderTools()}
        ${this._renderLogStream()}
      </div>
    `;
  }

  static styles = [
    commonStyles,
    css`
      .diagnostics-tab {
        max-width: 1400px;
        margin: 0 auto;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .info-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
      }

      .info-value {
        font-size: 14px;
        color: var(--primary-text-color);
        font-weight: 500;
      }

      .tool-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        text-align: center;
      }

      .tool-card ha-icon {
        font-size: 48px;
        color: var(--primary-color);
      }

      .tool-info {
        flex: 1;
      }

      .tool-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .tool-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .filter-select {
        padding: 6px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
      }

      .auto-scroll-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      .logs-container {
        background: var(--secondary-background-color);
        padding: 0;
        max-height: 600px;
        overflow: hidden;
      }

      .logs-content {
        height: 600px;
        overflow-y: auto;
        padding: 16px;
      }

      .log-entry {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        margin-bottom: 8px;
        border-left: 4px solid var(--divider-color);
      }

      .log-entry.info {
        border-left-color: #2196f3;
      }

      .log-entry.success {
        border-left-color: #4caf50;
      }

      .log-entry.error {
        border-left-color: #f44336;
      }

      .log-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--secondary-background-color);
      }

      .log-entry.info .log-icon {
        background: rgba(33, 150, 243, 0.2);
        color: #2196f3;
      }

      .log-entry.success .log-icon {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .log-entry.error .log-icon {
        background: rgba(244, 67, 54, 0.2);
        color: #f44336;
      }

      .log-content {
        flex: 1;
        min-width: 0;
      }

      .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        gap: 8px;
      }

      .log-time {
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      .log-message {
        font-size: 14px;
        color: var(--primary-text-color);
        margin-bottom: 4px;
        word-wrap: break-word;
      }

      .log-entity {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-family: monospace;
      }

      .log-details {
        margin-top: 8px;
        font-size: 12px;
      }

      .log-details summary {
        cursor: pointer;
        color: var(--primary-color);
        font-weight: 500;
      }

      .log-details pre {
        margin: 8px 0 0 0;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 4px;
        overflow-x: auto;
        font-size: 11px;
        color: var(--primary-text-color);
      }

      @media (max-width: 768px) {
        .info-grid {
          grid-template-columns: 1fr;
        }

        .logs-container,
        .logs-content {
          max-height: 400px;
          height: 400px;
        }
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'diagnostics-tab': DiagnosticsTab;
  }
}
