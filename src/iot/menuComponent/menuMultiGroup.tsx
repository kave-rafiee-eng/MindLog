import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useState, useRef, useEffect, useReducer, useMemo } from "react";

import menuesJson from "../MenuDataJson.json";
import { currentMenuType, MenuPropsType } from "./currentMenuTypes";
import { CalculateColorState } from "./genericFn";

import { TableBasic, TableBasicProps } from "../component/tableBasic";

import BtnReadSave from "./btnReadSave";

//Coustom hooks
import { useFlashReset } from "../hooks/useFlashReset";
import { useAutoUpdate } from "../hooks/useAutoUpdate";
import { useSocketStore } from "../socketStore";

type menusType = typeof menuesJson;

type settingSelectType = {
  address: number;
  options: string[];
  lable: string;
};

type settingNumberType = {
  address: number;
  addition: number;
  unit: string;
  factor: number;
  minValue: number;
  maxValue: number;
  lable: string;
};

type settingType = {
  number?: settingNumberType;
  select?: settingSelectType;
};

type stateAddType = {
  stateIndex: number;
  address: number;
};

type StateType = {
  filter: number;
  valueChenged: boolean[];
  valueSetting: number[];
  commFault: boolean;
};

function extractMenu(menu: currentMenuType, allmenu: menusType): settingType[] {
  let extract: settingType[] = [];

  for (const item of menu.items) {
    //----------Select
    if (item.data?.settingOption) {
      //if (item.label != "Seg L") continue;
      const settingOption = item.data.settingOption;
      if (settingOption.options in allmenu) {
        let itemSelect: settingSelectType = {
          lable: item.label,
          address: settingOption.value,
          options: allmenu[
            settingOption.options as keyof typeof allmenu
          ] as string[],
        };
        extract.push({ select: itemSelect });
      }
    }
    //----------Number
    if (item.data?.setting) {
      const setting = item.data.setting;
      let itemNumber = {
        lable: item.label,
        address: setting.value,
        addition: setting.addition,
        unit: setting.unit,
        factor: setting.factor,
        minValue: setting.minValue,
        maxValue: setting.maxValue,
      };
      extract.push({ number: itemNumber });
    }
  }

  return extract;
}

function stateAddExtractor(
  settingBuf: settingType[],
  numOfFloor: number,
): stateAddType[] {
  const result: stateAddType[] = [];

  result.push({
    address: 1,
    stateIndex: 0,
  });
  let globalIndex = 1;
  for (const setting of settingBuf) {
    const baseAddress = setting.number?.address ?? setting.select?.address;
    if (baseAddress === undefined) continue;
    for (let i = 0; i < numOfFloor; i++) {
      result.push({
        address: baseAddress + i,
        stateIndex: globalIndex + i,
      });
    }
    globalIndex += numOfFloor;
  }
  return result;
}

export default function MenuMultyGroup({
  currentMenu,
  allMenu,
}: MenuPropsType) {
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);
  const stateRef = useRef<stateRefType>({
    processRun: false,
    userEngage: false,
    F_userEngage: false,
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [flash, setFlash] = useFlashReset(false, 500);

  let setting = extractMenu(currentMenu, allMenu);
  const [state, setState] = useState<StateType>({
    valueChenged: Array(setting.length * 24).fill(0),
    valueSetting: Array(setting.length * 24).fill(0),
    commFault: false,
    filter: 0,
  });

  const nof = state.valueSetting[0];
  const stateAddBuf = stateAddExtractor(setting, nof);

  //----------

  const filterOptions: string[] = setting.map((item) => {
    if (item.number?.lable) return item.number.lable;
    else if (item.select?.lable) return item.select.lable;
    return "";
  });

  const filter = filterOptions[state.filter];
  let settingFilter = setting.find((value) => {
    if (value.select?.lable == filter) return true;
    return false;
  });

  type renderValuesType = {
    stateIndex: number;
    number?: settingNumberType;
    select?: settingSelectType;
  };
  type MyRow = {
    id: number;
    floor: number;
    renderValues: renderValuesType;
  };

  //-----------Creat  Table Rows
  let tableData: MyRow[] = [];

  if (settingFilter?.select) {
    const startAdd = settingFilter.select?.address ?? 0;
    let globalCounter = 0;
    for (let i = 0; i < nof; i++) {
      const Add = startAdd + i;
      const found = stateAddBuf.find((value) => value.address === Add);
      if (found) {
        const indexState = found?.stateIndex;
        tableData.push({
          id: globalCounter,
          floor: i + 1,
          renderValues: {
            stateIndex: indexState,
            select: settingFilter.select,
          },
        });
        globalCounter++;
      }
    }
  }

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
        stateAddBuf.map((stateAdd) => {
          return stateAdd.address;
        }),
        write ? state.valueSetting : [],
        write,
        true,
      );

      let newValues: (number | null)[] = Array(stateAddBuf.length).fill(null);

      res.registers.forEach((register) => {
        const found = stateAddBuf.find((stateAdd) => {
          if (stateAdd.address == register.add) return true;
          else return false;
        });
        if (found) {
          newValues[found.stateIndex] = register.value;
        }
      });

      if (
        newValues.every((val) => val != null) &&
        newValues.length < state.valueSetting.length
      ) {
        setState((prev) => ({
          ...prev,
          valueSetting: [
            ...newValues,
            ...prev.valueSetting.slice(newValues.length),
          ],
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

  const tableProps: TableBasicProps<MyRow> = {
    columns: [
      {
        id: "floor",
        label: "Floor",
      },
      {
        id: "renderValues",
        label: () => {
          return (
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label"></InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={state.filter}
                onChange={(e) => {
                  setState((prev) => {
                    return {
                      ...prev,
                      filter: e.target.value,
                    };
                  });
                }}
              >
                {filterOptions.map((name, index) => (
                  <MenuItem key={name} value={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
        render: (row) => {
          if (row.renderValues.select) {
            return (
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label"></InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={state.valueSetting[row.renderValues.stateIndex]}
                  onOpen={() => {
                    if (!stateRef.current.userEngage)
                      stateRef.current.F_userEngage = true;
                    stateRef.current.userEngage = true;
                  }}
                  onClose={() => {
                    if (stateRef.current.F_userEngage) {
                      stateRef.current.F_userEngage = false;
                      //forceUpdate();
                    }
                  }}
                  onChange={(e) => {
                    setState((prev) => {
                      let newState: StateType = { ...prev };
                      newState.valueSetting[row.renderValues.stateIndex] =
                        e.target.value;
                      newState.valueChenged[row.renderValues.stateIndex] = true;
                      return newState;
                    });
                  }}
                  sx={{
                    bgcolor: bgColor[row.renderValues.stateIndex],
                    textAlign: "center",
                  }}
                >
                  {row.renderValues.select.options.map((name, index) => (
                    <MenuItem key={name} value={index}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
          return "row.floor";
        },
      },
    ],
    tableData: tableData,
  };

  return (
    <>
      {" "}
      <TableBasic
        columns={tableProps.columns}
        tableData={tableProps.tableData}
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

type stateRefType = {
  processRun: boolean;
  userEngage: boolean;
  F_userEngage: boolean;
};
