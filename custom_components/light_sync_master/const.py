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
