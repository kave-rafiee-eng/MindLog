import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home"; // adjust path/filename if needed (case-sensitive!)
import Log from "./log"; // ← add this import (create the file if missing)

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import NavBar from "./navBar";

/*
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={8}>size=8</Grid>
        <Grid size={4}>size=8</Grid>
        <Grid size={4}>size=8</Grid>
        <Grid size={8}>size=8</Grid>
      </Grid>
    </div>
  );
  */
// If this is your main app component, consider renaming it to App
function AppRecorder() {
  return (
    <>
      {<NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log" element={<Log />} />{" "}
      </Routes>
    </>
  );
}

export default AppRecorder;
