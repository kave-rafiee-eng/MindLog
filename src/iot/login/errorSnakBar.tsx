import React from "react";
import { Snackbar, Alert } from "@mui/material";

type ErrorSnackbarPrpsType = {
  open: boolean;
  message: string;
  onClose: () => void;
};
export default function ErrorSnackbar({
  open,
  message,
  onClose,
}: ErrorSnackbarPrpsType) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={onClose}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
