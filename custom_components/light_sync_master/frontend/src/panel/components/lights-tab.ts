/**
 * Lights Tab Component
 * Configuration and management of master and slave lights
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LightSyncStatus, LightSyncConfig } from '../../types';
import { commonStyles } from '../../shared/styles';
import { getFriendlyName, postApi } from '../../shared/utils';

@customElement('lights-tab')
export class LightsTab extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public status!: LightSyncStatus;
  @property({ attribute: false }) public config!: LightSyncConfig;
  @property({ type: String }) public entryId!: string;

  @state() private _editMode = false;
  @state() private _selectedSlaves: string[] = [];
  @state() private _transitionTime: number = 1;
  @state() private _syncOnEnable: boolean = true;
  @state() private _saving = false;

  connectedCallback() {
    super.connectedCallback();
    this._selectedSlaves = [...this.config.slave_entities];
    this._transitionTime = this.config.transition_time;
    this._syncOnEnable = this.config.sync_on_enable;
  }

  private _getAllLightEntities(): string[] {
    return Object.keys(this.hass.states).filter(
      entity_id => entity_id.startsWith('light.') &&
        entity_id !== this.status.master_light.entity_id
    );
  }

  private _toggleSlaveSelection(entityId: string) {
    if (this._selectedSlaves.includes(entityId)) {
      this._selectedSlaves = this._selectedSlaves.filter(id => id !== entityId);
    } else {
      this._selectedSlaves = [...this._selectedSlaves, entityId];
    }
    this.requestUpdate();
  }

  private async _saveConfiguration() {
    try {
      this._saving = true;

      await postApi(this.hass, `/api/light_sync_master/${this.entryId}/update_config`, {
        slave_entities: this._selectedSlaves,
        transition_time: this._transitionTime,
        sync_on_enable: this._syncOnEnable
      });

      this._editMode = false;
      this.dispatchEvent(new CustomEvent('config-changed'));
    } catch (err) {
      console.error('Error saving configuration:', err);
      alert('Errore nel salvataggio della configurazione');
    } finally {
      this._saving = false;
    }
  }

  private _cancelEdit() {
    this._editMode = false;
    this._selectedSlaves = [...this.config.slave_entities];
    this._transitionTime = this.config.transition_time;
    this._syncOnEnable = this.config.sync_on_enable;
  }

  private async _testSync() {
    try {
      await postApi(this.hass, `/api/light_sync_master/${this.entryId}/test_sync`, {});
      alert('Test sincronizzazione avviato!');
    } catch (err) {
      console.error('Error testing sync:', err);
      alert('Errore nel test di sincronizzazione');
    }
  }

  private _renderMasterLightInfo() {
    const master = this.status.master_light;

    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:lightbulb"></ha-icon>
          Master Light
        </h2>
        <div class="card">
          <div class="info-row">
            <div class="info-label">Entity ID</div>
            <div class="info-value">${master.entity_id}</div>
          </div>
          <div class="divider"></div>
          <div class="info-row">
            <div class="info-label">Nome</div>
            <div class="info-value">${getFriendlyName(this.hass, master.entity_id)}</div>
          </div>
          <div class="divider"></div>
          <div class="info-row">
            <div class="info-label">Stato</div>
            <div class="info-value">
              <span class="badge success">Sempre ON</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderSlaveConfiguration() {
    if (!this._editMode) {
      return html`
        <div class="section">
          <div class="row space-between">
            <h2 class="section-title">
              <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
              Luci Slave (${this.config.slave_entities.length})
            </h2>
            <button class="button" @click=${() => this._editMode = true}>
              <ha-icon icon="mdi:pencil"></ha-icon>
              Modifica
            </button>
          </div>
          <div class="slaves-list">
            ${this.config.slave_entities.map(entityId => html`
              <div class="list-item">
                <div class="list-item-icon">
                  <ha-icon icon="mdi:lightbulb"></ha-icon>
                </div>
                <div class="list-item-content">
                  <div class="list-item-title">${getFriendlyName(this.hass, entityId)}</div>
                  <div class="list-item-subtitle">${entityId}</div>
                </div>
                <span class="badge ${this.hass.states[entityId]?.state === 'on' ? 'success' : ''}">
                  ${this.hass.states[entityId]?.state?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
            `)}
          </div>
        </div>
      `;
    }

    const allLights = this._getAllLightEntities();

    return html`
      <div class="section">
        <div class="row space-between">
          <h2 class="section-title">
            <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
            Seleziona Luci Slave
          </h2>
          <div class="row" style="gap: 8px">
            <button class="button secondary" @click=${this._cancelEdit}>
              <ha-icon icon="mdi:close"></ha-icon>
              Annulla
            </button>
            <button class="button" @click=${this._saveConfiguration} ?disabled=${this._saving}>
              <ha-icon icon="mdi:check"></ha-icon>
              ${this._saving ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </div>
        <div class="card">
          <div class="selection-info">
            ${this._selectedSlaves.length} luc${this._selectedSlaves.length === 1 ? 'e' : 'i'} selezionat${this._selectedSlaves.length === 1 ? 'a' : 'e'}
          </div>
        </div>
        <div class="lights-selector">
          ${allLights.map(entityId => {
            const isSelected = this._selectedSlaves.includes(entityId);
            const entity = this.hass.states[entityId];
            const isOn = entity?.state === 'on';

            return html`
              <div class="selectable-light ${isSelected ? 'selected' : ''}" @click=${() => this._toggleSlaveSelection(entityId)}>
                <div class="checkbox">
                  <ha-icon icon="mdi:${isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}"></ha-icon>
                </div>
                <div class="list-item-icon">
                  <ha-icon icon="mdi:lightbulb${isOn ? '' : '-outline'}"></ha-icon>
                </div>
                <div class="list-item-content">
                  <div class="list-item-title">${getFriendlyName(this.hass, entityId)}</div>
                  <div class="list-item-subtitle">${entityId}</div>
                </div>
                <span class="badge ${isOn ? 'success' : ''}">
                  ${entity?.state?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderBehaviorSettings() {
    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:cog"></ha-icon>
          Impostazioni Comportamento
        </h2>
        <div class="card">
          <div class="toggle-row">
            <div class="col">
              <div class="setting-title">Sincronizza all'attivazione</div>
              <div class="setting-description">
                Sincronizza automaticamente tutte le luci accese quando si attiva lo switch
              </div>
            </div>
            <ha-switch
              .checked=${this._syncOnEnable}
              @change=${(e: Event) => {
                this._syncOnEnable = (e.target as any).checked;
                if (!this._editMode) {
                  this._saveConfiguration();
                }
              }}
            ></ha-switch>
          </div>
        </div>
      </div>
    `;
  }

  private _renderTransitionSettings() {
    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:timer"></ha-icon>
          Tempo di Transizione
        </h2>
        <div class="card">
          <div class="transition-control">
            <div class="transition-info">
              <div class="transition-value">${this._transitionTime.toFixed(1)}s</div>
              <div class="transition-label">Durata transizione</div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              .value=${this._transitionTime.toString()}
              @input=${(e: Event) => {
                this._transitionTime = parseFloat((e.target as HTMLInputElement).value);
                this.requestUpdate();
              }}
              @change=${() => {
                if (!this._editMode) {
                  this._saveConfiguration();
                }
              }}
            />
            <div class="transition-marks">
              <span>0s</span>
              <span>5s</span>
              <span>10s</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderTestActions() {
    return html`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:test-tube"></ha-icon>
          Test e Diagnostica
        </h2>
        <div class="card">
          <div class="test-actions">
            <button class="button" @click=${this._testSync}>
              <ha-icon icon="mdi:sync"></ha-icon>
              Test Sincronizzazione
            </button>
            <div class="test-description">
              Sincronizza immediatamente tutte le luci slave accese con il master light
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="lights-tab">
        <div class="grid grid-2">
          <div>
            ${this._renderMasterLightInfo()}
            ${this._renderBehaviorSettings()}
            ${this._renderTransitionSettings()}
          </div>
          <div>
            ${this._renderSlaveConfiguration()}
            ${!this._editMode ? this._renderTestActions() : ''}
          </div>
        </div>
      </div>
    `;
  }

  static styles = [
    commonStyles,
    css`
      .lights-tab {
        max-width: 1400px;
        margin: 0 auto;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
      }

      .info-label {
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .info-value {
        color: var(--primary-text-color);
      }

      .slaves-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .lights-selector {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 500px;
        overflow-y: auto;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .selectable-light {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
      }

      .selectable-light:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .selectable-light.selected {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: white;
      }

      .selectable-light.selected .list-item-title,
      .selectable-light.selected .list-item-subtitle {
        color: white;
      }

      .checkbox {
        color: var(--primary-color);
      }

      .selectable-light.selected .checkbox {
        color: white;
      }

      .selection-info {
        text-align: center;
        padding: 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 8px;
        font-weight: 500;
      }

      .setting-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .setting-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .transition-control {
        padding: 16px;
      }

      .transition-info {
        text-align: center;
        margin-bottom: 16px;
      }

      .transition-value {
        font-size: 32px;
        font-weight: 600;
        color: var(--primary-color);
      }

      .transition-label {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .transition-control input[type="range"] {
        width: 100%;
        height: 4px;
        background: var(--divider-color);
        border-radius: 2px;
        outline: none;
        -webkit-appearance: none;
      }

      .transition-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
      }

      .transition-marks {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .test-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
      }

      .test-description {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      @media (max-width: 768px) {
        .lights-selector {
          max-height: 400px;
        }
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'lights-tab': LightsTab;
  }
}
