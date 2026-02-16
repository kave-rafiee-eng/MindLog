export const menuTypes = {
  MENU_TYPE_SUBMENU: 0,
  MENU_TYPE_SUBMENU_GRAPHC: 1,
  MENU_TYPE_SETTING: 2,
  MENU_TYPE_SETTING_ON_PARAMETER: 3,
  MENU_TYPE_SETTING_ON_SELECT: 4,
  MENU_TYPE_SETTING_MULTY_SELECT_ONE_STAGE: 5,
  MENU_TYPE_MONITOR: 6,
  MENU_TYPE_HOME: 7,
  MENU_TYPE_SETTING_MULTY_GROUP: 8,
  MENU_TYPE_CHART: 9,

  ITEM_TYPE_SUBMENU_GRAPHC: 10,
  ITEM_TYPE_SETTING_ON_PARAMETER: 11,
  ITEM_TYPE_SETTING_ON_SELECT: 12,
  ITEM_TYPE_SETTING_MULTY_SELECT_ONE_STAGE: 13,
  ITEM_TYPE_SETTING_SHOW_OPTIONS: 14,

  ITEM_TYPE_MULTY_GROUP_PROPERTY: 15,

  ITEM_TYPE_MONITOR_SINGLE_INT: 16,
  ITEM_TYPE_MONITOR_SINGLE_INT16: 17,
  ITEM_TYPE_MONITOR_SINGLE_INT32: 18,
  ITEM_TYPE_MONITOR_SINGLE_FLOAT: 19,
  ITEM_TYPE_MONITOR_ON_SELECT: 20,
  ITEM_TYPE_MONITOR_LABEL: 21,

  ITEM_TYPE_COSTOM_FUNCTION: 22,
  ITEM_TYPE_COSTOM_FUNCTION_OK: 23,

  ITEM_TYPE_CHART: 24,
};

/*
typedef struct {
    char * label;
    MenuItemType type;

	  uint8_t *disConditionItem;
		uint8_t *disTriggerItem;
		VIS_MODE VisMode;

		uint8_t *runValue;

    union {
        struct Menu *submenu;

				void (*costonFunction)(struct Menu *self);

			  struct {
          uint8_t *numOfGroup;
        } multyGroupProperty;


         struct {
             uint8_t offset;
             int factor;
             uint8_t addition;
             uint8_t step;
        } ShowOptions;

        struct {
            uint8_t *value;
            uint8_t  minValue;
            uint8_t  maxValue;
						uint8_t *def;
            uint8_t offset;
            int factor;
            uint8_t addition;
						char unit[3];
        } setting;

		struct {
            uint8_t* value;
            char** options;
            uint8_t  numOptions;
						uint8_t *DynamicNumOptions;
						uint8_t *def;
        } settingOption;

        struct {
						uint8_t *def;
            uint8_t* values;
            uint8_t  numItems;
            char** itemLabels;

            char** options;
            uint8_t  numOptions;

						bool preventDuplicateSelection;

        } MselectOne;

    } data;
} MenuItem;

typedef struct Menu {
		MenuItemType type;
    const char *title;
    MenuItem *items;
    const uint8_t itemCount;
} Menu;
 */
