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
            >
              {item.label}
            </Button>
          ))}
      </>
    );
  };
  return (
    <>
      <CardSetting title={currentMenu.title} Child={CardChild} />
    </>
  );
}

/*

      <Grid container direction={"column"} spacing={1}>
        <Grid item size={{ md: 12, sm: 12 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                width: "100%",
              },
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">{currentMenu.title}</Typography>
                <Typography variant="body2">
                  num Of Items = {currentMenu.items.length}
                </Typography>
              </CardContent>

              <CardActions>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  {currentMenu.items
                    .filter(
                      (item) =>
                        item.type === menuTypes.ITEM_TYPE_SUBMENU_GRAPHC,
                    )
                    .map((item, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        onClick={() =>
                          handleSubMenuClick(item.data.subMenuGraphic.submenu)
                        }
                        disabled={!isEnable(item.data.subMenuGraphic.submenu)}
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
                      >
                        {item.label}
                      </Button>
                    ))}
                </Box>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
      
            <Paper sx={{ borderRadius: "25px" }} elevation={5}>
              <Box p={1}>
                <Typography variant="h6">{mainMenu.title}</Typography>
                <Typography variant="body2">
                  num Of Items = {mainMenu.items.length}
                </Typography>
              </Box>

              <Button size="small" color="primary">
                Primary
              </Button>
            </Paper>

            */
