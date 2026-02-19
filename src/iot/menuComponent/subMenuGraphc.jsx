import { menuTypes } from "./../defMenuType";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import RestorePageIcon from "@mui/icons-material/RestorePage";
import SettingsIcon from "@mui/icons-material/Settings";
import CardSetting from "./card";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { Key } from "@mui/icons-material";

function Icon(label) {
  switch (label) {
    case "History":
      return <RestorePageIcon />;
    case "Full Set":
      return <SettingsIcon />;
    default:
      return null;
  }
}
export default function SubMenuGraphic({
  allMenus,
  currentMenu,
  handleSubMenuClick,
}) {
  console.log(allMenus);
  function isEnable(subMenu) {
    if (allMenus[subMenu]) return true;
    return false;
  }

  const CardChild = () => {
    return (
      <>
        {currentMenu.items
          .filter((item) => item.type === menuTypes.ITEM_TYPE_SUBMENU_GRAPHC)
          .map((item, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() =>
                handleSubMenuClick(item.data.subMenuGraphic.submenu)
              }
              disabled={!isEnable(item.data.subMenuGraphic.submenu)}
              sx={{
                width: "80%",
              }}
            >
              {item.label}
              {Icon(item.label)}
            </Button>
          ))}
        {currentMenu.items
          .filter((item) => item.type === menuTypes.MENU_TYPE_SUBMENU)
          .map((item, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleSubMenuClick(item.data.submenu)}
              disabled={!isEnable(item.data.submenu)}
              sx={{
                width: "80%",
              }}
            >
              {item.label}
            </Button>
          ))}
      </>
    );
  };
  return (
    <>
      <CardSetting title={currentMenu.title}>
        <CardChild />
      </CardSetting>
    </>
  );
}
