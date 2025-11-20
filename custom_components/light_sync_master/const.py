"""Constants for Light Sync Master integration."""
from typing import Final

DOMAIN: Final = "light_sync_master"

# configuration keys
CONF_MASTER_NAME: Final = "name"
CONF_SLAVE_ENTITIES: Final = "slave_entities"
CONF_TRANSITION_TIME: Final = "transition_time"
CONF_SYNC_ENABLED_DEFAULT: Final = "sync_enabled_default"
CONF_SYNC_ON_ENABLE: Final = "sync_on_enable"
CONF_ENABLE_DEBUG_LOGGING: Final = "enable_debug_logging"
CONF_SCHEDULES: Final = "schedules"

# schedule configuration keys
CONF_SCHEDULE_NAME: Final = "schedule_name"
CONF_SCHEDULE_FROM_TYPE: Final = "from_type"
CONF_SCHEDULE_FROM_TIME: Final = "from_time"
CONF_SCHEDULE_FROM_OFFSET: Final = "from_offset"
CONF_SCHEDULE_TO_TYPE: Final = "to_type"
CONF_SCHEDULE_TO_TIME: Final = "to_time"
CONF_SCHEDULE_TO_OFFSET: Final = "to_offset"
CONF_SCHEDULE_RGB_COLOR: Final = "rgb_color"
CONF_SCHEDULE_BRIGHTNESS: Final = "brightness"
CONF_SCHEDULE_WEEKDAYS: Final = "weekdays"
CONF_SCHEDULE_ENABLED: Final = "enabled"

# defaults
DEFAULT_TRANSITION_TIME: Final = 1.0
DEFAULT_SYNC_ENABLED: Final = True
DEFAULT_SYNC_ON_ENABLE: Final = True

# entity id prefixes
LIGHT_PREFIX: Final = "lsm"
SWITCH_PREFIX: Final = "lsm"

# attributes to sync (exclude effects)
SYNC_ATTRIBUTES: Final = [
    "brightness",
    "rgb_color",
    "hs_color",
    "xy_color",
    "color_temp",
]

# schedule types
SCHEDULE_TYPE_TIME: Final = "time"
SCHEDULE_TYPE_SUNRISE: Final = "sunrise"
SCHEDULE_TYPE_SUNSET: Final = "sunset"

# weekdays (0=Monday, 6=Sunday)
WEEKDAYS: Final = {
    0: "monday",
    1: "tuesday",
    2: "wednesday",
    3: "thursday",
    4: "friday",
    5: "saturday",
    6: "sunday",
}
