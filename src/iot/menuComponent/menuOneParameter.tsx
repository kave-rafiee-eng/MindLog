import { menuTypes } from "../defMenuType";

import { Button, TextField, Stack } from "@mui/material";
import { useState, useRef, useEffect, useMemo } from "react";

import CardSetting from "./card";

import { useSocketStore } from "../socketStore";
import BtnReadSave from "./btnReadSave";

import { useFlashReset } from "../hooks/useFlashReset";
import { useAutoUpdate } from "../hooks/useAutoUpdate";

import { TableBasic, TableBasicProps } from "../component/tableBasic";

import menuesJson from "../MenuDataJson.json";
import { currentMenuType, MenuPropsType } from "./currentMenuTypes";
import { CalculateColorState } from "./genericFn";
type menusType = typeof menuesJson;

type settingType = {
  address: number;
  addition: number;
  unit: string;
  factor: number;
  minValue: number;
  maxValue: number;
  lable: string;
};

function extractMenu(menu: currentMenuType): settingType | false {
  for (const item of menu.items) {
    if (item.data?.setting) {
      const setting = item.data.setting;
      return {
        lable: item.label,
        address: setting.value,
        addition: setting.addition,
        unit: setting.unit,
        factor: setting.factor,
        minValue: setting.minValue,
        maxValue: setting.maxValue,
      };
    }
  }
  return false;
}

type stateType = {
  valueSetting: number;
  commFault: boolean;
};

type useRefType = {
  interval: ReturnType<typeof setTimeout> | null;
  speed: number;
  userEngage: boolean;
  processRun: boolean;
};
export default function MenuOneParameter({ currentMenu }: MenuPropsType) {
  const setting = useMemo(() => {
    return extractMenu(currentMenu);
  }, []);

  const [state, setState] = useState<stateType>({
    valueSetting: 0,
    commFault: false,
  });

  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);

  const [flash, setFlash] = useFlashReset(false, 500);

  const stateRef = useRef<useRefType>({
    interval: null,
    speed: 150,
    userEngage: false,
    processRun: false,
  });

  if (typeof setting == "boolean")
    return (
      <>
        <h3>extractMenu Error</h3>
      </>
    );

  const startChange = (direction: number) => {
    stateRef.current.userEngage = true;

    if (stateRef.current.interval) return;
    stateRef.current.speed = 500;
    const run = () => {
      setState((prev) => {
        let newValue = prev.valueSetting + 1 * direction;
        if (newValue > setting.maxValue) newValue = setting.maxValue;
        if (newValue <= setting.minValue) newValue = setting.minValue;
        return {
          ...prev,
          valueSetting: newValue,
        };
      });
      stateRef.current.speed *= 0.85;
      stateRef.current.interval = setTimeout(run, stateRef.current.speed);
    };
    run();
  };

  const stopChange = () => {
    if (stateRef.current.interval != null)
      clearInterval(stateRef.current.interval);
    stateRef.current.interval = null;
  };

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
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            onMouseDown={() => startChange(-1)}
            onMouseUp={stopChange}
            onMouseLeave={stopChange}
            disabled={stateRef.current.processRun}
            onTouchStart={() => startChange(-1)}
            onTouchEnd={stopChange}
            onTouchCancel={stopChange}
            onTouchMove={stopChange}
          >
            ↓
          </Button>

          <TextField
            type="number"
            value={CalShowValue(
              state.valueSetting,
              setting.factor,
              setting.addition,
            )}
            size="small"
            sx={{
              width: "80%",
              bgcolor: bgColor,
            }}
            InputProps={{
              readOnly: true,
            }}
          />

          <Button
            variant="contained"
            onMouseDown={() => startChange(1)}
            onMouseUp={stopChange}
            onMouseLeave={stopChange}
            onTouchStart={() => startChange(1)}
            onTouchEnd={stopChange}
            onTouchCancel={stopChange}
            disabled={stateRef.current.processRun}
          >
            ↑
          </Button>
        </Stack>
        <BtnReadSave
          disabledRead={stateRef.current.processRun}
          disabledSave={stateRef.current.processRun}
          handleRead={() => processPCI(false)}
          handleSave={() => processPCI(true)}
        />
      </>
    );
  };
  return (
    <CardSetting title={setting.lable + ":" + setting.unit}>
      <CardChild />
    </CardSetting>
  );
}

function CalShowValue(value: number, factor: number, addition: number) {
  let step = 1;
  if (factor == 0) step = 1;
  else if (factor > 0) step = factor;
  else step = 1 / Math.abs(factor);

  return ((value + addition) * step).toFixed(2);
}
/*
function roundToStep(value, min, step) {
  return +(Math.round((value - min) / step) * step + min).toFixed(2);
}

function CheckRange(value, min, max, step) {
  if (value < min) value = min;
  else if (value > max) value = max;
  else value = roundToStep(value, min, step);
  return value;
}
  */
