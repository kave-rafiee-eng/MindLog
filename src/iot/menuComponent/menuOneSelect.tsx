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
type menusType = typeof menuesJson;

import { currentMenuType, MenuPropsType } from "./currentMenuTypes";
import { CalculateColorState } from "./genericFn";

type useRefType = {
  userEngage: boolean;
  processRun: boolean;
};

type stateType = {
  valueSetting: number;
  commFault: boolean;
};

type settingType = {
  address: number;
  options: string[];
  lable: string;
};

function extractMenu(
  menu: currentMenuType,
  allmenu: menusType,
): settingType | false {
  for (const item of menu.items) {
    if (item.data?.settingOption) {
      const settingOption = item.data.settingOption;
      if (settingOption.options in allmenu) {
        return {
          lable: item.label,
          address: settingOption.value,
          options: allmenu[
            settingOption.options as keyof typeof allmenu
          ] as string[],
        };
      }
    }
  }
  return false;
}

export default function MenuOneSelect({ currentMenu, allMenu }: MenuPropsType) {
  const setting = useMemo(() => {
    return extractMenu(currentMenu, allMenu);
  }, []);

  console.log(setting);
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);
  const [flash, setFlash] = useFlashReset(false, 500);

  const [state, setState] = useState<stateType>({
    valueSetting: 0,
    commFault: false,
  });

  const stateRef = useRef<useRefType>({
    userEngage: false,
    processRun: false,
  });

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  if (typeof setting == "boolean")
    return (
      <>
        <h3>extractMenu Error</h3>
      </>
    );

  const bgColor = useMemo(() => {
    return CalculateColorState({
      flash: flash,
      userEngage: stateRef.current.userEngage,
      commFault: state.commFault,
      chnage: true,
    });
  }, [flash, state, stateRef.current.userEngage, state.commFault]);

  const processPCI = async (write: boolean) => {
    if (stateRef.current.processRun) return;

    stateRef.current.userEngage = false;
    stateRef.current.processRun = true;

    try {
      const res = await PCI_Setting(
        [setting.address],
        write ? [state.valueSetting] : [],
        write,
        true,
      );

      res.registers.forEach((register) => {
        if (register.add == setting.address) {
          setState((prev) => {
            return {
              ...prev,
              valueSetting: register.value,
              commFault: false,
            };
          });

          setFlash(true);
        }
      });
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        commFault: true,
      }));
    }

    stateRef.current.processRun = false;
  };

  useAutoUpdate({
    ProcessRead: () => {
      processPCI(false);
    },
    StopFn: () => {
      return stateRef.current.userEngage || stateRef.current.processRun;
    },
  });

  const CardChild = () => {
    return (
      <>
        <Stack
          direction="column"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            //background: "red",
            width: "100%",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="DateSelect-lable">{setting.lable}</InputLabel>
            <Select
              labelId="DateSelect-lable"
              value={state.valueSetting}
              onOpen={() => {
                stateRef.current.userEngage = true;
              }}
              onClose={() => {
                forceUpdate();
              }}
              onChange={(e) => {
                setState((prev) => {
                  return {
                    ...prev,
                    valueSetting: e.target.value,
                  };
                });
              }}
              sx={{
                width: "100%",
                bgcolor: bgColor,
                justifyContent: "center",
                textAlign: "center",
              }}
              input={<OutlinedInput label={setting.lable} />}
            >
              {setting.options.map((name, index) => (
                <MenuItem key={name} value={index}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <BtnReadSave
            disabledRead={stateRef.current.processRun}
            disabledSave={stateRef.current.processRun}
            handleRead={() => processPCI(false)}
            handleSave={() => processPCI(true)}
          />
        </Stack>
      </>
    );
  };
  return (
    <CardSetting title={setting.lable}>
      <CardChild />
    </CardSetting>
  );

  return <></>;
}
