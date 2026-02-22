import React, { forwardRef, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { registerType, picMonitorType } from "./types";
import { useMonitorStore } from "./monitorStor";
import { Segment } from "./monitorComponent/segment";
import { useAddressesPool } from "./hooks/adrressPool";

type SectionProps = {
  color: string;
  id: number;
};
type adrressesPoolType = number[];

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ color, id }, ref) => {
    const AddReadRegister = useMonitorStore((state) => state.AddReadRegister);

    const { addToPool } = useAddressesPool(id);
    /*const adrressesPool = useRef<adrressesPoolType>([]);
    const AddToAddPool = (addresses: number[]) => {
      addresses.forEach((address) => {
        if (!adrressesPool.current.includes(address)) {
          adrressesPool.current.push(address);
        }
      });
    };
    useEffect(() => {
      console.log("render Section id : " + id);
      console.log(adrressesPool.current);
      AddReadRegister(id, [...adrressesPool.current]);
      adrressesPool.current.length = 0;
    });*/

    const registers = useMonitorStore(
      (state) => state.monitorData[id].registers,
    );

    return (
      <Box
        ref={ref}
        sx={{
          height: "100%",
          scrollSnapAlign: "start",
          bgcolor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexDirection: "column",
          p: 0,
          gap: 0,
        }}
      >
        <h3> id = {id}</h3>
        <Segment registers={registers} addToPoolAddressesFn={addToPool} />
        {registers.length > 0
          ? registers.map((register) => {
              return (
                <Typography>
                  {register.add} = {register.value}
                </Typography>
              );
            })
          : ""}
      </Box>
    );
  },
);

Section.displayName = "Section";
export default Section;
