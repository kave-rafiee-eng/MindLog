import React, { forwardRef, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { registerType, picMonitorType } from "./../types";

import { componentMonitorPropType, getValueByAdd } from "./typeFunction";

let readRegisters: number[] = [10001];
const ModesString: string[] = [
  "Default",
  "Auto Reset",
  "Revision",
  "Calibre",
  "Enc Calibre",
  "Speed Calibre",
  "Normal",
  "Error",
  "EMG",
  "Force Stop",
  "High Force Stop",
  "Relevel",
];
export function Monitor_mode({
  registers,
  addToPoolAddressesFn,
}: componentMonitorPropType) {
  const test = useRef(0);
  useEffect(() => {
    addToPoolAddressesFn(readRegisters);
  });

  let mode = "";
  const value = getValueByAdd(registers, 10001);
  if (value != null) mode = ModesString[value];

  return (
    <Box width={"100%"} height={"10%"} sx={{ background: "green" }}>
      Mode : {mode}
    </Box>
  );
}
