import { menuTypes } from "../defMenuType";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CardSetting from "./card";

import { Button, TextField, Stack } from "@mui/material";
import { useState, useRef, useEffect, useReducer, useMemo } from "react";

import { useSocketStore } from "../socketStore";

import BtnReadSave from "./btnReadSave";
import { useFlashReset } from "../hooks/useFlashReset";
import { useAutoUpdate } from "../hooks/useAutoUpdate";

import menuesJson from "../MenuDataJson.json";

import { TableBasic, TableBasicProps } from "../component/tableBasic";

type menusType = typeof menuesJson;

type settingType = {
  addresses: number[];
  numItems: number;
  options: string[];
  itemLabels: string[];
};

type StateType = {
  valueChenged: boolean[];
  valueSetting: number[];
  commFault: boolean;
};

type stateRefType = {
  processRun: boolean;
  userEngage: boolean;
  F_userEngage: boolean;
};

function ExtractMenu(menu: currentMenuType, allMenu: menusType): settingType {
  let setting: settingType = {
    addresses: [],
    numItems: 0,
    options: [],
    itemLabels: [],
  };

  let item = menu.items.find(
    (item) => item.type === menuTypes.ITEM_TYPE_SETTING_MULTY_SELECT_ONE_STAGE,
  );

  setting.numItems = item?.data.MselectOne.numItems ?? 0;
  const startAdd: number = item?.data.MselectOne.values ?? 0;

  setting.addresses = Array.from({ length: setting.numItems }, (_, index) => {
    return startAdd + index;
  });

  if (
    Array.isArray(
      allMenu[item?.data.MselectOne.options as keyof typeof allMenu],
    )
  ) {
    setting.options = allMenu[
      item?.data.MselectOne.options as keyof typeof allMenu
    ] as string[];
  }

  if (
    Array.isArray(
      allMenu[item?.data.MselectOne.itemLabels as keyof typeof allMenu],
    )
  ) {
    setting.itemLabels = allMenu[
      item?.data.MselectOne.itemLabels as keyof typeof allMenu
    ] as string[];
  }

  return setting;
}

export default function MenuMultySelect({
  currentMenu,
  allMenu,
}: MenuMultySelectPropType) {
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);

  const setting = useMemo(() => {
    return ExtractMenu(currentMenu, allMenu);
  }, [currentMenu, allMenu]);

  const [state, setState] = useState<StateType>({
    valueChenged: Array(setting?.itemLabels?.length ?? 0).fill(0),
    valueSetting: Array(setting?.itemLabels?.length ?? 0).fill(0),
    commFault: false,
  });

  const stateRef = useRef<stateRefType>({
    processRun: false,
    userEngage: false,
    F_userEngage: false,
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [flash, setFlash] = useFlashReset(false, 500);

  const bgColor = useMemo(() => {
    return Array.from({ length: state.valueChenged.length }, (_, index) => {
      if (flash) return "success.light";
      else if (stateRef.current.userEngage) {
        if (state.valueChenged[index]) return "#ffcc80";
        else return "#fff3e0";
      } else if (state.commFault) return "error.light";
      else return "white";
    });
  }, [flash, state, stateRef.current.userEngage, state.commFault]);

  const processPCI = async (write: boolean) => {
    if (stateRef.current.processRun) return;

    stateRef.current.userEngage = false;
    stateRef.current.processRun = true;

    try {
      const res = await PCI_Setting(
        setting.addresses,
        write ? state.valueSetting : [],
        write,
        true,
      );

      let newValues: (number | null)[] = Array(state.valueSetting.length).fill(
        null,
      );

      res.registers.forEach((register) => {
        let offset = register.add - setting.addresses[0];
        if (offset >= 0 && offset < newValues.length) {
          newValues[offset] = register.value;
        }
      });

      if (newValues.every((val) => val != null)) {
        setState((prev) => ({
          ...prev,
          valueSetting: newValues,
          commFault: false,
          valueChenged: prev.valueChenged.map(() => false),
        }));
      }

      setFlash(true);
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        commFault: true,
      }));
    }

    stateRef.current.processRun = false;
  };

  type MyRow = {
    id: number;
    state: string;
    prog: string;
  };

  let tableData: MyRow[] = Array.from(
    { length: setting.itemLabels.length },
    (_, index) => {
      return {
        id: index,
        state: setting.itemLabels[index],
        prog: setting.itemLabels[index],
      };
    },
  );

  const props: TableBasicProps<MyRow> = {
    columns: [
      {
        id: "prog",
        label: "prog",
      },
      {
        id: "state",
        label: "state",
        render: (row) => {
          return (
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                {row.state}
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={state.valueSetting[row.id]}
                onOpen={() => {
                  if (!stateRef.current.userEngage)
                    stateRef.current.F_userEngage = true;
                  stateRef.current.userEngage = true;
                }}
                onClose={() => {
                  if (stateRef.current.F_userEngage) {
                    stateRef.current.F_userEngage = false;
                    forceUpdate();
                  }
                }}
                onChange={(e) => {
                  setState((prev) => {
                    let newState: StateType = { ...prev };
                    newState.valueSetting[row.id] = e.target.value;
                    newState.valueChenged[row.id] = true;
                    return newState;
                  });
                }}
                sx={{
                  bgcolor: bgColor[row.id],
                  textAlign: "center",
                }}
              >
                {setting.options.map((name, index) => (
                  <MenuItem key={name} value={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
      },
    ],
    tableData: tableData,
  };

  return (
    <>
      <TableBasic
        columns={props.columns}
        tableData={props.tableData}
      ></TableBasic>

      <BtnReadSave
        disabledRead={stateRef.current.processRun}
        disabledSave={stateRef.current.processRun}
        handleRead={() => processPCI(false)}
        handleSave={() => processPCI(true)}
      />
    </>
  );
}

type MenuMultySelectPropType = {
  currentMenu: currentMenuType;
  allMenu: menusType;
};

type MenuItemDataType = {
  MselectOne: {
    values: number;
    def: number;
    numOptions: number;
    numItems: number;
    options: string;
    itemLabels: string;
  };
};

type MenuItemType = {
  label: string;
  type: number;
  data: MenuItemDataType;
};

type currentMenuType = {
  type: number;
  title: string;
  items: MenuItemType[];
  itemCount: number;
};

/*
type SubmenuData = {
  submenu: Menu;
};

type CustomFunctionData = {
  costonFunction: (self: Menu) => void;
};

type MultiGroupPropertyData = {
  numOfGroup: number[];
};

type ShowOptionsData = {
  offset: number;
  factor: number;
  addition: number;
  step: number;
};

type SettingData = {
  value: number[];
  minValue: number;
  maxValue: number;
  def: number[];
  offset: number;
  factor: number;
  addition: number;
  unit: string; // unit[3] → string
};

type SettingOptionData = {
  value: number[];
  options: string[];
  numOptions: number;
  DynamicNumOptions?: number[];
  def?: number[];
};

type MselectOneData = {
  def?: number[];
  values?: number[];
  numItems?: number;
  itemLabels?: string[];
  options?: string[];
  numOptions?: number;
  preventDuplicateSelection?: boolean;
};

type MenuItem = {
  label: string;
  type: MenuItemType;

  disConditionItem?: number[]; // uint8_t* → number[]
  disTriggerItem?: number[];
  VisMode: VIS_MODE;

  runValue?: number[];

  data?:
    | SubmenuData
    | CustomFunctionData
    | MultiGroupPropertyData
    | ShowOptionsData
    | SettingData
    | SettingOptionData
    | MselectOneData;
};

type Menu = {
  type: MenuItemType;
  title: string;
  items: MenuItem[];
  itemCount: number;
};

*/
