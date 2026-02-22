import React, { forwardRef, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { registerType, picMonitorType } from "./../types";

import { componentMonitorPropType, getValueByAdd } from "./typeFunction";

let readRegisters: number[] = [1, 1];

export function Segment({
  registers,
  addToPoolAddressesFn,
}: componentMonitorPropType) {
  const test = useRef(0);
  useEffect(() => {
    console.log("Segment ");
    readRegisters[0] = test.current;
    test.current++;
    addToPoolAddressesFn(readRegisters);
  });

  return (
    <Box width={"100%"} height={"10%"} sx={{ background: "green" }}>
      {getValueByAdd(registers, 1)}
    </Box>
  );
}
