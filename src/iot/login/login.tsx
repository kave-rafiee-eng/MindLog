import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import {
  Grid,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Stack,
  Link,
  Divider,
} from "@mui/material";
import LoginInternet from "./loginInternet";
import { useLoginStore } from "./loginStor";
import LoginLocal from "./loginLocal";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function LoginPage() {
  const connectionType = useLoginStore((state) => state.connectionType);
  const changeLoginType = useLoginStore((state) => state.changeLoginType);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    changeLoginType(newValue === 0 ? "mqtt" : "ws");
  };

  const activeTab = connectionType == "mqtt" ? 0 : 1;

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "70vh",
        mt: 1,
      }}
    >
      <Grid size={{ lg: 4, md: 6, sm: 8, xs: 12 }} direction={"row"}>
        <Paper
          elevation={3}
          sx={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack direction={"row"} sx={{ mt: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ pr: 10 }}>
              Sign in
            </Typography>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
          </Stack>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Internet" {...a11yProps(0)} />
              <Tab label="Local" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={activeTab} index={0}>
            <LoginInternet />
          </CustomTabPanel>
          <CustomTabPanel value={activeTab} index={1}>
            <LoginLocal />
          </CustomTabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
}
