import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  colors,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Fragment, useRef, useState, useEffect, useLayoutEffect } from "react";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { ReactNode } from "react";
import { JSX } from "react";

import { registerType, picMonitorType } from "./types";

import SectionTest from "./secstionTest";

type scrolRefType = {
  activeIndex: number;
  timeout: ReturnType<typeof setTimeout> | null;
};
type pageBufType = {
  branch: string;
  order: number;
  component: "SecHome" | "SecLocation";
};

import { useMonitorStore } from "./monitorStor";
import { Segment } from "./monitorComponent/segment";

import SecHome from "./sections/secHome";
import SecLocation from "./sections/secLocation";

export default function FullPageScroll() {
  const MonitorPciProcess = useMonitorStore((state) => state.MonitorPciProcess);
  const ResetMonitorData = useMonitorStore((state) => state.ResetMonitorData);

  useEffect(() => {
    //ResetMonitorData(5);
  }, []);

  const AddReadRegister = useMonitorStore((state) => state.AddReadRegister);

  console.log("FullPageScroll ---");
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const pageBuf = useRef<pageBufType[]>([
    {
      branch: "a",
      order: 0,
      component: "SecHome",
    },
    {
      branch: "a",
      order: 1,
      component: "SecLocation",
    },
  ]);

  const scrolRef = useRef<scrolRefType>({
    timeout: null,
    activeIndex: 0,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (element: HTMLDivElement | null) => {
    if (element != undefined) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    clearTimeout(scrolRef.current.timeout!);
    scrolRef.current.timeout = setTimeout(() => {
      const container = containerRef.current!;
      const scrollY = container.scrollTop;
      const sectionHeight = container.clientHeight;
      scrolRef.current.activeIndex = Math.round(scrollY / sectionHeight);
    }, 150);
  };

  const colors = ["red", "green", "blue"];

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
        direction={"column"}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 0.5,
          bgcolor: "background.paper",
          height: "90vh",
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            width: "100%",
            flexDirection: "column",
            flexGrow: 1,
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
          }}
          onScroll={handleScroll}
        >
          {pageBuf.current.map((section, index) => {
            let ComponentToRender;
            switch (section.component) {
              case "SecLocation":
                ComponentToRender = SecLocation;
                break;
              case "SecHome":
                ComponentToRender = SecHome;
                break;
            }
            return (
              <ComponentToRender
                id={index}
                key={index}
                color={colors[index % 3]}
                ref={(el) => {
                  sectionsRef.current[index] = el;
                }}
              />
            );
          })}
        </Box>

        <Paper
          elevation={3}
          sx={{
            height: "10vh",
            mt: "auto",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            background: "#9e9e9e",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              MonitorPciProcess(scrolRef.current.activeIndex);
            }}
          >
            set State
          </Button>
          <SectionTest />
          <IconButton onClick={() => {}}>
            <KeyboardDoubleArrowUpIcon />
          </IconButton>
        </Paper>
      </Grid>
    </Grid>
  );
}
