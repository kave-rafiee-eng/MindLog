import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import axios from "axios";
import { AxiosError, AxiosResponse } from "axios";

import { Snackbar, Alert } from "@mui/material";

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
  Icon,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoginStore } from "./loginStor";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useSocketStore } from "./../socketStore";

import { useNavigate } from "react-router-dom";
import ErrorSnackbar from "./errorSnakBar";

type userInputType = {
  pass: string | null;
};

export default function LoginLocal() {
  const connected = useSocketStore((s) => s.connected);
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);

  const setLogin = useLoginStore((state) => state.setLogin);
  const navigate = useNavigate();

  console.log("con : " + connected);
  const [userInputs, setUserInput] = useState<userInputType>({
    pass: null,
  });

  const [pciStatus, setPciStatus] = useState<"run" | null | "ok" | "error">(
    null,
  );

  const [openErrorSnack, setOpenErrorSnack] = useState(false);

  //

  return (
    <Stack spacing={3} alignItems="center">
      <ErrorSnackbar
        open={openErrorSnack}
        onClose={() => setOpenErrorSnack(false)}
        message="Wrong password"
      />

      <Stack
        direction={"row"}
        sx={{
          mt: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ pr: 2 }}>
          socket
        </Typography>
        {!connected && <CircularProgress size={20} />}

        {connected && (
          <Icon color="success">
            <TaskAltIcon />
          </Icon>
        )}
      </Stack>

      {pciStatus != null && (
        <Stack
          direction="row"
          sx={{
            mt: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ pr: 2 }}>
            device
          </Typography>

          {pciStatus == "run" && <CircularProgress size={20} />}
          {pciStatus === "ok" && <TaskAltIcon color="success" />}
          {pciStatus === "error" && (
            <Typography variant="h6" color="red">
              Error
            </Typography>
          )}
        </Stack>
      )}

      <TextField
        fullWidth
        type="number"
        label="Password"
        variant="outlined"
        value={userInputs.pass}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value) && value.length < 5) {
            setUserInput((prev) => ({
              ...prev,
              pass: value,
            }));
          }
        }}
      />
      <Button
        fullWidth
        disabled={pciStatus === "run"}
        variant="contained"
        size="large"
        onClick={async () => {
          setPciStatus("run");
          try {
            const res = await PCI_Setting([1], [], false, false);
            setPciStatus("ok");

            if (userInputs.pass === "1234") {
              setLogin(true);
              navigate("/setting");
            } else {
              setOpenErrorSnack(true);
            }
          } catch {
            setPciStatus("error");
          }
        }}
      >
        Login
      </Button>

      <Divider flexItem />
    </Stack>
  );
}
