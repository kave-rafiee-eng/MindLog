import { menuTypes } from "./../defMenuType";

import { Button, TextField, Stack } from "@mui/material";
import { useState, useRef } from "react";

import CardSetting from "./card";

export default function MenuOneParameter({ currentMenu }) {
  let setting = {
    minValue: 0,
    maxValue: 0,
    factor: 0,
    addition: 0,
    unit: "",
    address: 0,
    stepValue: 1,
  };

  let item = currentMenu.items.find(
    (item) => item.type === menuTypes.ITEM_TYPE_SETTING_ON_PARAMETER,
  );

  setting.address = item.data.setting.value;
  setting.addition = item.data.setting.addition;
  setting.unit = item.data.setting.unit;
  setting.factor = item.data.setting.factor;
  if (setting.factor == 0) setting.stepValue = 1;
  else if (setting.factor > 0) setting.stepValue = setting.factor;
  else setting.stepValue = 1 / Math.abs(setting.factor);
  setting.minValue = item.data.setting.minValue * setting.stepValue;
  setting.maxValue = item.data.setting.maxValue * setting.stepValue;

  console.log(setting);

  const [valueSetting, setvalueSetting] = useState(0);
  const intervalRef = useRef(null);
  const speedRef = useRef(150);

  const startChange = (direction) => {
    if (intervalRef.current) return;
    speedRef.current = 500;
    const run = () => {
      setvalueSetting((prev) => {
        let newValue = prev + setting.stepValue * direction;
        return CheckRange(
          newValue,
          setting.minValue,
          setting.maxValue,
          setting.stepValue,
        );
      });
      speedRef.current *= 0.85;
      intervalRef.current = setTimeout(run, speedRef.current);
    };
    run();
  };

  const stopChange = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const CardChild = () => {
    return (
      <>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            onMouseDown={() => startChange(-1)}
            onMouseUp={stopChange}
            onMouseLeave={stopChange}
          >
            ↓
          </Button>

          <TextField
            value={valueSetting}
            size="small"
            sx={{ width: 80 }}
            step={setting.stepValue}
            InputProps={{
              readOnly: true,
            }}
          />

          <Button
            variant="contained"
            onMouseDown={() => startChange(1)}
            onMouseUp={stopChange}
            onMouseLeave={stopChange}
          >
            ↑
          </Button>
        </Stack>
      </>
    );
  };
  return (
    <>
      <CardSetting title={currentMenu.title} Child={CardChild} />
    </>
  );
}

function roundToStep(value, min, step) {
  return +(Math.round((value - min) / step) * step + min).toFixed(2);
}

function CheckRange(value, min, max, step) {
  if (value < min) value = min;
  else if (value > max) value = max;
  else value = roundToStep(value, min, step);
  return value;
}
/*
            onChange={(e) => {
              let newValue = Number(e.target.value);
              if (typeof newValue === "number" && !isNaN(newValue)) {
              } else newValue = minValue;

              setvalueSetting(
                CheckRange(
                  newValue,
                  setting.minValue,
                  setting.maxValue,
                  setting.stepValue,
                ),
              );
            }}*/
