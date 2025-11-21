/**
 * Shared utility functions for Light Sync Master frontend
 */

import { HomeAssistant, ColorData, Schedule } from '../types';

/**
 * Format RGB color as CSS string
 */
export function rgbToCss(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * Convert HS color to RGB
 */
export function hsToRgb(h: number, s: number): [number, number, number] {
  s = s / 100;
  const c = s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = 0;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

/**
 * Get color from entity attributes
 */
export function getEntityColor(entity: any): string {
  if (entity.attributes.rgb_color) {
    return rgbToCss(entity.attributes.rgb_color);
  } else if (entity.attributes.hs_color) {
    const rgb = hsToRgb(entity.attributes.hs_color[0], entity.attributes.hs_color[1]);
    return rgbToCss(rgb);
  }
  return 'rgb(255, 255, 255)'; // Default white
}

/**
 * Format time string (HH:MM)
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s fa`;
  if (diffMin < 60) return `${diffMin}m fa`;
  if (diffHour < 24) return `${diffHour}h fa`;
  return `${diffDay}g fa`;
}

/**
 * Get weekday name
 */
export function getWeekdayName(day: number, short: boolean = false): string {
  const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  const daysShort = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  return short ? daysShort[day] : days[day];
}

/**
 * Calculate next schedule trigger time
 */
export function calculateNextTrigger(schedule: Schedule, now: Date = new Date()): Date | null {
  // This is a simplified version - the real calculation happens in Python
  // This is just for display purposes
  return null;
}

/**
 * Format schedule time display
 */
export function formatScheduleTime(schedule: Schedule): string {
  let fromStr = '';
  let toStr = '';

  if (schedule.from_type === 'time') {
    fromStr = schedule.from_time || '00:00';
  } else if (schedule.from_type === 'sunrise') {
    fromStr = `🌅 ${schedule.from_offset > 0 ? '+' : ''}${schedule.from_offset}m`;
  } else if (schedule.from_type === 'sunset') {
    fromStr = `🌇 ${schedule.from_offset > 0 ? '+' : ''}${schedule.from_offset}m`;
  }

  if (schedule.to_type === 'time') {
    toStr = schedule.to_time || '00:00';
  } else if (schedule.to_type === 'sunrise') {
    toStr = `🌅 ${schedule.to_offset > 0 ? '+' : ''}${schedule.to_offset}m`;
  } else if (schedule.to_type === 'sunset') {
    toStr = `🌇 ${schedule.to_offset > 0 ? '+' : ''}${schedule.to_offset}m`;
  }

  return `${fromStr} → ${toStr}`;
}

/**
 * Get brightness percentage
 */
export function getBrightnessPercent(brightness: number): number {
  return Math.round((brightness / 255) * 100);
}

/**
 * Call Home Assistant service
 */
export async function callService(
  hass: HomeAssistant,
  domain: string,
  service: string,
  data: any = {}
): Promise<void> {
  await hass.callService(domain, service, data);
}

/**
 * Fetch data from API
 */
export async function fetchApi<T>(
  hass: HomeAssistant,
  path: string
): Promise<T> {
  return await hass.callApi<T>('GET', path);
}

/**
 * Post data to API
 */
export async function postApi<T>(
  hass: HomeAssistant,
  path: string,
  data: any
): Promise<T> {
  return await hass.callApi<T>('POST', path, data);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if entity is available
 */
export function isEntityAvailable(hass: HomeAssistant, entityId: string): boolean {
  const entity = hass.states[entityId];
  return entity && entity.state !== 'unavailable';
}

/**
 * Get friendly name for entity
 */
export function getFriendlyName(hass: HomeAssistant, entityId: string): string {
  const entity = hass.states[entityId];
  return entity?.attributes?.friendly_name || entityId;
}
