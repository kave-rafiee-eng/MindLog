import { useState } from "react";

import { useSocketStore } from "../socketStore";

import { Button, TextField, Stack, Drawer } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";

import type { AlertColor } from "@mui/material/Alert";

type commModalType = {
  open: boolean;
  severity: AlertColor;
  title: string;
};

export function SnackBarPci() {
  const SetCommModalState = useSocketStore((s) => s.SetCommModalState);

  const [commModal, setCommModal] = useState<commModalType>({
    open: true,
    severity: "success",
    title: "",
  });
  SetCommModalState(setCommModal);

  return (
    <Snackbar
      open={commModal.open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={() => {
        //console.log("setCommModal");
      }}
    >
      <Alert
        onClose={() => {
          setCommModal((prev) => {
            return {
              ...prev,
              open: false,
            };
          });
        }}
        severity={commModal.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {commModal.title}
        {commModal.severity === "warning" && <LinearProgress />}
      </Alert>
    </Snackbar>
  );
}
