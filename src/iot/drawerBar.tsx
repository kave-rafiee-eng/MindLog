import { Button } from "@mui/material";
import MyAppBar from "./component/AppBar";
import MiniDrawer from "./component/miniDrawer";
import { useState } from "react";

export default function DrawewrBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <MiniDrawer setOpen={setDrawerOpen} open={drawerOpen} />

      <MyAppBar
        handleDrawerOpen={() => setDrawerOpen(true)}
        open={drawerOpen}
      />
    </>
  );
  return (
    <>
      <Button
        variant="contained"
        onClick={() => setDrawerOpen((prev) => !prev)}
      >
        {drawerOpen == true ? "sss" : "aaa"}sss
      </Button>
      <MyAppBar
        handleDrawerOpen={() => setDrawerOpen(true)}
        open={drawerOpen}
      />
      <MiniDrawer setOpen={setDrawerOpen} open={drawerOpen} />
    </>
  );
}
