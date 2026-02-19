import { menuTypes } from "../defMenuType";

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

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { Key } from "@mui/icons-material";

export default function MenuNavBar({
  allMenus,
  menuStackArr,
  handleMenuChenge,
}) {
  const CalculateNewStack = (menuId) => {
    let index = menuStackArr.findIndex((value) => value === menuId);
    let copyStack = menuStackArr.slice(0, index + 1);
    console.log(copyStack);
    handleMenuChenge(copyStack);
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          CurrentMenu = {allMenus[menuStackArr[menuStackArr.length - 1]].title}
        </Typography>
        <Typography variant="body2">
          num Of stack {menuStackArr.length}
        </Typography>
      </CardContent>

      <CardActions>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          {menuStackArr.map((menu, index) => {
            return (
              <Typography
                color="primary"
                key={`index ${index}`}
                onClick={() => CalculateNewStack(menu)}
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {allMenus[menu].title}/
              </Typography>
            );
          })}
        </Box>
      </CardActions>
    </Card>
  );
}

/*


      
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
