import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import IotHome from "./iotHome";

import { useSocketStore } from "./socketStore";
import { useEffect } from "react";
import BasicModal from "./component/modal";

import Box from "@mui/material/Box";

import { useTranslation } from "react-i18next";
import FullPageScroll from "./monitoring/monitoringHome";
import { SnackBarPci } from "./component/snackBarPci";
import DrawewrBar from "./drawerBar";
import LoginPage from "./login/login";
import { useLoginStore } from "./login/loginStor";

function AppIot() {
  console.log("AppIot----");
  const { t } = useTranslation();

  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const connectionType = useLoginStore((s) => s.connectionType);

  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useLoginStore((s) => s.isLogin);

  if (isLogin != true && location.pathname != "/login") navigate("/login");

  //const connected = useSocketStore((s) => s.connected);
  //

  useEffect(() => {
    if (connectionType == "ws") {
      connect();
    } else {
      disconnect();
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackBarPci />
      {/*<BasicModal
        open={!connected}
        handleCloseBtn={() => {}}
        title={"Cooecting to Ws..."}
        body={"please Wait"}
      />*/}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          m: 0,
          p: 0,
          t: 0,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            background: "green",
            m: 0,
            p: 0,
            t: 0,
          }}
        >
          <DrawewrBar />
        </Box>

        <Box
          sx={{
            width: "100%",
            position: "absolute",
            p: 0,
            t: 0,
            m: 0,
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "85vw",
              p: 0,
              t: 0,
              m: 0,
              ml: "15vw",
              mt: "10vh",
            }}
          >
            <Routes>
              <Route path="/" element={<IotHome />} />
              <Route path="/setting" element={<IotHome />} />
              <Route path="/monitornig" element={<FullPageScroll />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AppIot;
