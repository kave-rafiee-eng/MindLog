import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import axios from "axios";
import { AxiosError, AxiosResponse } from "axios";

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

import { useLoginStore } from "./loginStor";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

type userInputType = {
  name: string;
  pass: string;
};

export default function LoginInternet() {
  const setLogin = useLoginStore((state) => state.setLogin);

  const [userInputs, setUserInput] = useState<userInputType>({
    name: "",
    pass: "",
  });
  const setUserData = useLoginStore((state) => state.setUserData);

  const handleLogin = () => {
    getToken(userInputs.name, userInputs.pass)
      .then((res) => {
        if (res) {
          console.log(res);
        }
      })
      .catch((err) => {
        //console.log("err");
        console.log(err);
      });
  };
  return (
    <Stack spacing={3} alignItems="center">
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        value={userInputs.name}
        onChange={(e) =>
          setUserInput((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={userInputs.pass}
        onChange={(e) =>
          setUserInput((prev) => ({
            ...prev,
            pass: e.target.value,
          }))
        }
      />

      <Button fullWidth variant="contained" size="large" onClick={handleLogin}>
        Login
      </Button>

      <Divider flexItem />

      <Stack direction="row" spacing={1}>
        <Link href="#">Forgot password?</Link>
        <Typography>|</Typography>
        <Link href="#">Register</Link>
      </Stack>
    </Stack>
  );
}

function getToken(name: string, pass: string): Promise<any> {
  const data = {
    username: name,
    pass: pass,
  };

  return api
    .post<{ accessToken: string }>("/login", data)
    .then((res) => {
      //console.log(res.data);
      if (res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        api.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.accessToken}`;

        return api.get("/posts");
      } else {
        throw "cant get Token";
      }
    })
    .then((res) => {
      if (res) {
        return res.data;
      }
    })
    .catch((err) => {
      let error: string | undefined = "";
      if (err instanceof AxiosError) {
        if (err.response) {
          error = err.response.data;
        } else {
          error = err.message;
        }
      } else {
        error = err;
      }
      console.log(error);
      throw error;
    });
}
/*
async function getToken(name: string, pass: string) {
  const data = {
    username: name,
    pass: pass,
  };
  try {
    const res = await api.post("/login", data);
    console.log(res.data);
    if (res.data.accessToken) {
      localStorage.setItem("token", res.data.accessToken);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.accessToken}`;

      try {
        const res = await api.get("/posts");
        console.log(res);
      } catch {}
    }
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      console.log(err.response?.data);
    } else {
      console.log(err);
    }
  }
}
*/
//api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//localStorage.setItem("token", token);
