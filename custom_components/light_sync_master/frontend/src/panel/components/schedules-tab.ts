/**
 * Schedules Tab Component
 * Visual schedule management with timeline and calendar views
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LightSyncStatus, LightSyncConfig, Schedule } from '../../types';
import { commonStyles } from '../../shared/styles';
import { rgbToCss, formatScheduleTime, getWeekdayName, getBrightnessPercent } from '../../shared/utils';

type ViewMode = 'list' | 'timeline' | 'calendar';

@customElement('schedules-tab')
export class SchedulesTab extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public status!: LightSyncStatus;
  @property({ attribute: false }) public config!: LightSyncConfig;
  @property({ type: String }) public entryId!: string;

  @state() private _viewMode: ViewMode = 'list';

  private _parseScheduleTime(schedule: Schedule, isFrom: boolean): number | null {
    // Parse schedule time to minutes from midnight
    // This is simplified - real calculation would handle sunrise/sunset
    const type = isFrom ? schedule.from_type : schedule.to_type;
    const time = isFrom ? schedule.from_time : schedule.to_time;
    const offset = isFrom ? schedule.from_offset : schedule.to_offset;

    if (type === 'time' && time) {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }

    // For sunrise/sunset, use approximate times
    if (type === 'sunrise') {
      return 7 * 60 + offset; // ~7:00 AM + offset
    }
    if (type === 'sunset') {
      return 19 * 60 + offset; // ~7:00 PM + offset
    }

    return null;
  }

  private _renderViewToggle() {
    return html`
      <div class="view-toggle">
        <button
          class="view-button ${this._viewMode === 'list' ? 'active' : ''}"
          @click=${() => this._viewMode = 'list'}
        >
          <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
          Lista
        </button>
        <button
          class="view-button ${this._viewMode === 'timeline' ? 'active' : ''}"
          @click=${() => this._viewMode = 'timeline'}
        >
          <ha-icon icon="mdi:timeline"></ha-icon>
          Timeline 24h
        </button>
        <button
          class="view-button ${this._viewMode === 'calendar' ? 'active' : ''}"
          @click=${() => this._viewMode = 'calendar'}
        >
          <ha-icon icon="mdi:calendar-week"></ha-icon>
          Calendario
        </button>
      </div>
    `;
  }

  private _renderSchedulesList() {
    const schedules = this.config.schedules || [];

    if (schedules.length === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:clock-outline"></ha-icon>
          <h3>Nessuna Schedule</h3>
          <p>Crea la tua prima schedule dal menu Dispositivi & Servizi</p>
        </div>
      `;
    }

    return html`
      <div class="schedules-list">
        ${schedules.map((schedule, index) => this._renderScheduleCard(schedule, index))}
      </div>
    `;
  }

  private _renderScheduleCard(schedule: Schedule, index: number) {
    const color = rgbToCss(schedule.rgb_color);
    const brightness = getBrightnessPercent(schedule.brightness);

    return html`
      <div class="schedule-card ${!schedule.enabled ? 'disabled' : ''}">
        <div class="schedule-header">
          <div class="color-preview" style="background: ${color}">
            <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
          </div>
          <div class="schedule-info">
            <div class="schedule-name">${schedule.name}</div>
            <div class="schedule-time-display">${formatScheduleTime(schedule)}</div>
          </div>
          <span class="badge ${schedule.enabled ? 'success' : ''}">${schedule.enabled ? 'Attiva' : 'Disattiva'}</span>
        </div>

        <div class="schedule-details">
          <div class="detail-grid">
            <div class="detail-item">
              <ha-icon icon="mdi:brightness-6"></ha-icon>
              <span>${brightness}%</span>
            </div>
            <div class="detail-item">
              <ha-icon icon="mdi:palette"></ha-icon>
              <span>RGB(${schedule.rgb_color.join(', ')})</span>
            </div>
          </div>

          <div class="weekdays">
            ${[0, 1, 2, 3, 4, 5, 6].map(day => html`
              <div class="weekday-chip ${schedule.weekdays.includes(day) ? 'active' : ''}">
                ${getWeekdayName(day, true)}
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  private _renderTimeline() {
    const schedules = (this.config.schedules || []).filter(s => s.enabled);

    return html`
      <div class="timeline-view">
        <div class="timeline-header">
          <h3>Timeline 24 Ore</h3>
          <p>Vista oraria delle schedule attive per oggi</p>
        </div>
        <div class="timeline-container">
          <div class="timeline-hours">
            ${Array.from({ length: 24 }, (_, i) => html`
              <div class="hour-mark">
                <div class="hour-label">${i.toString().padStart(2, '0')}:00</div>
                <div class="hour-line"></div>
              </div>
            `)}
          </div>
          <div class="timeline-schedules">
            ${schedules.map(schedule => this._renderTimelineSchedule(schedule))}
          </div>
        </div>
      </div>
    `;
  }

  private _renderTimelineSchedule(schedule: Schedule) {
    const fromMinutes = this._parseScheduleTime(schedule, true);
    const toMinutes = this._parseScheduleTime(schedule, false);

    if (fromMinutes === null || toMinutes === null) {
      return html``;
    }

    const left = (fromMinutes / (24 * 60)) * 100;
    const width = ((toMinutes - fromMinutes) / (24 * 60)) * 100;
    const color = rgbToCss(schedule.rgb_color);
    const brightness = getBrightnessPercent(schedule.brightness);

    return html`
      <div
        class="timeline-bar"
        style="left: ${left}%; width: ${width}%; background: ${color}; opacity: ${brightness / 100}"
        title="${schedule.name}: ${formatScheduleTime(schedule)}"
      >
        <div class="timeline-bar-label">${schedule.name}</div>
      </div>
    `;
  }

  private _renderCalendar() {
    const schedules = (this.config.schedules || []).filter(s => s.enabled);
    const weekdays = [0, 1, 2, 3, 4, 5, 6];

    return html`
      <div class="calendar-view">
        <div class="calendar-header">
          <h3>Vista Settimanale</h3>
          <p>Schedule per giorno della settimana</p>
        </div>
        <div class="calendar-grid">
          ${weekdays.map(day => {
            const daySchedules = schedules.filter(s => s.weekdays.includes(day));

            return html`
              <div class="calendar-day">
                <div class="day-header">
                  <div class="day-name">${getWeekdayName(day)}</div>
                  <div class="day-count">${daySchedules.length} schedule</div>
                </div>
                <div class="day-schedules">
                  ${daySchedules.length === 0 ? html`
                    <div class="no-schedules">Nessuna schedule</div>
                  ` : daySchedules.map(schedule => {
                    const color = rgbToCss(schedule.rgb_color);
                    const brightness = getBrightnessPercent(schedule.brightness);

                    return html`
                      <div class="calendar-schedule">
                        <div class="color-preview small" style="background: ${color}">
                          <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
                        </div>
                        <div class="calendar-schedule-info">
                          <div class="calendar-schedule-name">${schedule.name}</div>
                          <div class="calendar-schedule-time">${formatScheduleTime(schedule)}</div>
                        </div>
                      </div>
                    `;
                  })}
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
    const color = rgbToCss(schedule.rgb_color);
    const brightness = getBrightnessPercent(schedule.brightness);

    return html`
      <div class="section">
        <div class="card next-schedule-card">
          <div class="next-schedule-header">
            <ha-icon icon="mdi:clock-check"></ha-icon>
            <div>
              <div class="next-schedule-label">Prossima Schedule</div>
              <div class="next-schedule-name">${schedule.name}</div>
            </div>
          </div>
          <div class="next-schedule-content">
            <div class="next-schedule-time">
              <ha-icon icon="mdi:calendar-clock"></ha-icon>
              ${new Date(schedule.trigger_time).toLocaleString('it-IT')}
            </div>
            <div class="next-schedule-preview">
              <div class="color-preview large" style="background: ${color}">
                <div class="brightness-overlay" style="opacity: ${1 - brightness / 100}"></div>
              </div>
              <div class="preview-details">
                <div class="preview-brightness">${brightness}%</div>
                <div class="preview-rgb">RGB(${schedule.rgb_color.join(', ')})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="schedules-tab">
        ${this._renderNextSchedule()}

        <div class="section">
          <div class="row space-between">
            <h2 class="section-title">
              <ha-icon icon="mdi:calendar-multiple"></ha-icon>
              Schedule (${this.config.schedules?.length || 0})
            </h2>
            ${this._renderViewToggle()}
          </div>
        </div>

        <div class="section">
          ${this._viewMode === 'list' ? this._renderSchedulesList() : ''}
          ${this._viewMode === 'timeline' ? this._renderTimeline() : ''}
          ${this._viewMode === 'calendar' ? this._renderCalendar() : ''}
        </div>

        <div class="section">
          <div class="card info-card">
            <ha-icon icon="mdi:information"></ha-icon>
            <div>
              <div class="info-title">Gestione Schedule</div>
              <div class="info-text">
                Per creare, modificare o eliminare schedule, vai in <strong>Impostazioni → Dispositivi e Servizi → Light Sync Master</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static styles = [
    commonStyles,
    css`
      .schedules-tab {
        max-width: 1400px;
        margin: 0 auto;
      }

      .view-toggle {
        display: flex;
        gap: 4px;
        background: var(--secondary-background-color);
        padding: 4px;
        border-radius: 8px;
      }

      .view-button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: transparent;
        border: none;
        border-radius: 6px;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .view-button:hover {
        background: var(--divider-color);
        color: var(--primary-text-color);
      }

      .view-button.active {
        background: var(--primary-color);
        color: white;
      }

      .schedules-list {
        display: grid;
        gap: 16px;
      }

      .schedule-card {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 16px;
        border: 2px solid var(--divider-color);
        transition: all 0.2s ease;
      }

      .schedule-card:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .schedule-card.disabled {
        opacity: 0.5;
      }

      .schedule-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .schedule-info {
        flex: 1;
      }

      .schedule-name {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .schedule-time-display {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }

      .schedule-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-left: 44px;
      }

      .detail-grid {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .weekdays {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .weekday-chip {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }

      .weekday-chip.active {
        background: var(--primary-color);
        color: white;
      }

      /* Timeline View */
      .timeline-view {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 20px;
      }

      .timeline-header {
        margin-bottom: 24px;
      }

      .timeline-header h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        color: var(--primary-text-color);
      }

      .timeline-header p {
        margin: 0;
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .timeline-container {
        position: relative;
        height: 200px;
      }

      .timeline-hours {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        display: flex;
      }

      .hour-mark {
        flex: 1;
        position: relative;
      }

      .hour-label {
        font-size: 10px;
        color: var(--secondary-text-color);
        position: absolute;
        top: 0;
        left: 0;
        transform: translateX(-50%);
      }

      .hour-line {
        position: absolute;
        top: 20px;
        left: 0;
        width: 1px;
        height: 180px;
        background: var(--divider-color);
      }

      .timeline-schedules {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .timeline-bar {
        position: absolute;
        height: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        color: white;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .timeline-bar:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }

      .timeline-bar-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Calendar View */
      .calendar-view {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 20px;
      }

      .calendar-header {
        margin-bottom: 24px;
      }

      .calendar-header h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        color: var(--primary-text-color);
      }

      .calendar-header p {
        margin: 0;
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
      }

      .calendar-day {
        background: var(--secondary-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .day-header {
        background: var(--primary-color);
        color: white;
        padding: 12px;
        text-align: center;
      }

      .day-name {
        font-weight: 600;
        font-size: 14px;
      }

      .day-count {
        font-size: 11px;
        opacity: 0.9;
        margin-top: 2px;
      }

      .day-schedules {
        padding: 8px;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .no-schedules {
        color: var(--disabled-text-color);
        font-size: 12px;
        text-align: center;
        padding: 20px 0;
      }

      .calendar-schedule {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--card-background-color);
        border-radius: 6px;
      }

      .calendar-schedule-info {
        flex: 1;
        min-width: 0;
      }

      .calendar-schedule-name {
        font-size: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .calendar-schedule-time {
        font-size: 10px;
        color: var(--secondary-text-color);
      }

      /* Next Schedule Card */
      .next-schedule-card {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        color: white;
      }

      .next-schedule-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .next-schedule-header ha-icon {
        font-size: 32px;
      }

      .next-schedule-label {
        font-size: 12px;
        opacity: 0.9;
      }

      .next-schedule-name {
        font-size: 20px;
        font-weight: 600;
      }

      .next-schedule-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .next-schedule-time {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
      }

      .next-schedule-preview {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .preview-details {
        text-align: right;
      }

      .preview-brightness {
        font-size: 18px;
        font-weight: 600;
      }

      .preview-rgb {
        font-size: 12px;
        opacity: 0.9;
      }

      /* Info Card */
      .info-card {
        display: flex;
        gap: 16px;
        background: var(--info-color, #2196f3);
        color: white;
      }

      .info-card ha-icon {
        font-size: 32px;
        flex-shrink: 0;
      }

      .info-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .info-text {
        font-size: 14px;
        opacity: 0.95;
        line-height: 1.5;
      }

      @media (max-width: 1200px) {
        .calendar-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (max-width: 768px) {
        .calendar-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .view-toggle {
          flex-wrap: wrap;
        }

        .timeline-container {
          overflow-x: auto;
        }
      }
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'schedules-tab': SchedulesTab;
  }
}
