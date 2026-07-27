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
CONF_PER_AREA_TOGGLES: Final = "per_area_toggles"

# per-area sync configuration (stored in options under CONF_AREA_CONFIG as
# {area_id: {sync_brightness, sync_color, sync_color_temp,
#            brightness_mode, brightness_value}})
CONF_AREA_CONFIG: Final = "area_config"
CONF_AREA_ID: Final = "area_id"
CONF_SYNC_BRIGHTNESS: Final = "sync_brightness"
CONF_SYNC_COLOR: Final = "sync_color"
CONF_SYNC_COLOR_TEMP: Final = "sync_color_temp"
CONF_BRIGHTNESS_MODE: Final = "brightness_mode"
CONF_BRIGHTNESS_VALUE: Final = "brightness_value"

# brightness modes for a following area
BRIGHTNESS_MODE_FOLLOW: Final = "follow"  # same brightness as master
BRIGHTNESS_MODE_SCALE: Final = "scale"    # master brightness * value%
BRIGHTNESS_MODE_CAP: Final = "cap"        # min(master, value% of full)

# defaults
DEFAULT_TRANSITION_TIME: Final = 1.0
DEFAULT_SYNC_ENABLED: Final = True
DEFAULT_SYNC_ON_ENABLE: Final = True
DEFAULT_PER_AREA_TOGGLES: Final = True
DEFAULT_SYNC_BRIGHTNESS: Final = True
DEFAULT_SYNC_COLOR: Final = True
DEFAULT_SYNC_COLOR_TEMP: Final = True
DEFAULT_BRIGHTNESS_MODE: Final = BRIGHTNESS_MODE_FOLLOW
DEFAULT_BRIGHTNESS_VALUE: Final = 100

# entity id prefixes
LIGHT_PREFIX: Final = "lsm"
SWITCH_PREFIX: Final = "lsm"
# infix for the per-area "follow master" switches,
# e.g. switch.lsm_master_light_follow_sala
FOLLOW_SWITCH_INFIX: Final = "follow"

# attributes to sync (exclude effects)
SYNC_ATTRIBUTES: Final = [
    "brightness",
    "rgb_color",
    "hs_color",
    "xy_color",
    "color_temp_kelvin",
]
