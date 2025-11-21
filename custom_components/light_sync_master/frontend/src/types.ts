/**
 * Light Sync Master TypeScript Types
 */

// Home Assistant types
export interface HomeAssistant {
  auth: any;
  connection: any;
  connected: boolean;
  states: { [entity_id: string]: HassEntity };
  config: any;
  themes: any;
  selectedTheme: any;
  panels: any;
  panelUrl: string;
  language: string;
  selectedLanguage: string | null;
  resources: any;
  localize: (key: string, ...args: any[]) => string;
  translationMetadata: any;
  suspendWhenHidden: boolean;
  enableShortcuts: boolean;
  vibrate: boolean;
  debugConnection: boolean;
  dockedSidebar: "docked" | "always_hidden" | "auto";
  defaultPanel: string;
  moreInfoEntityId: string | null;
  user?: any;
  hassUrl(path?: string): string;
  callService(domain: string, service: string, data?: any, target?: any): Promise<any>;
  callApi<T>(method: string, path: string, data?: any): Promise<T>;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: { [key: string]: any };
  last_changed: string;
  last_updated: string;
  context: any;
}

// Light Sync Master specific types
export interface LightSyncConfig {
  entry_id: string;
  name: string;
  slave_entities: string[];
  transition_time: number;
  sync_enabled_default: boolean;
  sync_on_enable: boolean;
  enable_debug_logging: boolean;
  schedules: Schedule[];
}

export interface Schedule {
  name: string;
  from_type: "time" | "sunrise" | "sunset";
  from_time?: string;
  from_offset: number;
  to_type: "time" | "sunrise" | "sunset";
  to_time?: string;
  to_offset: number;
  rgb_color: [number, number, number];
  brightness: number;
  weekdays: number[];
  enabled: boolean;
}

export interface LightSyncStatus {
  master_light: {
    entity_id: string;
    state: string;
    brightness: number;
    rgb_color?: [number, number, number];
    hs_color?: [number, number];
    xy_color?: [number, number];
    color_temp?: number;
  };
  sync_switch: {
    entity_id: string;
    state: boolean;
  };
  slave_lights: SlaveLight[];
  last_sync: string | null;
  next_schedule: NextSchedule | null;
  statistics: Statistics;
}

export interface SlaveLight {
  entity_id: string;
  name: string;
  state: string;
  brightness?: number;
  rgb_color?: [number, number, number];
  is_synced: boolean;
  last_event: string | null;
  available: boolean;
}

export interface NextSchedule {
  name: string;
  trigger_time: string;
  rgb_color: [number, number, number];
  brightness: number;
}

export interface Statistics {
  total_syncs: number;
  syncs_today: number;
  active_lights: number;
  total_lights: number;
  uptime: string;
}

export interface SyncLog {
  timestamp: string;
  type: "sync" | "schedule" | "error" | "info";
  message: string;
  entity_id?: string;
  details?: any;
}

export interface TimelineEvent {
  start: Date;
  end: Date;
  schedule: Schedule;
  isActive: boolean;
}

// Card configuration
export interface LightSyncCardConfig {
  type: string;
  entity: string;
  name?: string;
  layout?: "small" | "medium" | "large";
  show_brightness?: boolean;
  show_next_schedule?: boolean;
  show_slave_count?: boolean;
  theme?: string;
}

// Panel route
export interface PanelRoute {
  path: string;
  component: string;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// WebSocket message types
export interface WsMessage {
  type: string;
  data: any;
}

export interface WsStatusUpdate extends WsMessage {
  type: "status_update";
  data: LightSyncStatus;
}

export interface WsLogUpdate extends WsMessage {
  type: "log_update";
  data: SyncLog;
}

// Helper function types
export type ColorMode = "rgb" | "hs" | "xy" | "color_temp" | "brightness";

export interface ColorData {
  mode: ColorMode;
  rgb?: [number, number, number];
  hs?: [number, number];
  xy?: [number, number];
  color_temp?: number;
  brightness?: number;
}
