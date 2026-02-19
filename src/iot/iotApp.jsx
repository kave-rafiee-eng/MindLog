import { BrowserRouter, Routes, Route } from "react-router-dom";
import IotHome from "./iotHome";

import IotNavBar from "./iotNavBar";
import NumberInput from "./menuComponent/menuOneParameter";

import { useSocketStore } from "./socketStore";
import { useEffect } from "react";
import BasicModal from "./component/modal";
import { useState } from "react";

import { Button, TextField, Stack } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import MiniDrawer from "./miniDrawer";
import MyAppBar from "./component/AppBar";
import Typography from "@mui/material/Typography";

import { useTranslation } from "react-i18next";

function AppIot() {
  const { t } = useTranslation();

  const connect = useSocketStore((s) => s.connect);
  const connected = useSocketStore((s) => s.connected);
  const SetCommModalState = useSocketStore((s) => s.SetCommModalState);

  const [commModal, setCommModal] = useState({
    open: false,
    severity: "warning",
    title: "",
  });

  SetCommModalState(setCommModal);

  useEffect(() => {
    connect();
    //PciSend();
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Snackbar
        open={commModal.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => {}}
      >
        <Alert
          onClose={() => {}}
          severity={commModal.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {commModal.title}
          {commModal.severity === "warning" && <LinearProgress />}
        </Alert>
      </Snackbar>

      <BasicModal
        open={false}
        handleCloseBtn={() => {}}
        title={"Delvice..."}
        body={"please Wait"}
      />

      <BasicModal
        open={!connected}
        handleCloseBtn={() => {}}
        title={"Cooecting to Ws..."}
        body={"please Wait"}
      />

      <Box sx={{ display: "flex" }}>
        <MyAppBar
          handleDrawerOpen={() => setDrawerOpen(true)}
          open={drawerOpen}
        />
        <MiniDrawer setOpen={setDrawerOpen} open={drawerOpen} />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography sx={{ marginBottom: 2 }}>
            {t("welcomeMess", { user: "kave" })}
          </Typography>

          <Routes>
            <Route path="/" element={<IotHome />} />
            <Route path="/setting" element={<IotHome />} />
            <Route path="/monitoring" element={<IotHome />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default AppIot;

/*
      {<IotNavBar />}
      <Routes>
        <Route path="/" element={<IotHome />} />
        <Route path="/test" element={<MiniDrawer />} />
      </Routes>*/
