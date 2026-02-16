import { BrowserRouter, Routes, Route } from "react-router-dom";
import IotHome from "./iotHome";

import IotNavBar from "./iotNavBar";
import NumberInput from "./menuComponent/menuOneParameter";
function AppIot() {
  return (
    <>
      {<IotNavBar />}
      <Routes>
        <Route path="/" element={<IotHome />} />
        <Route path="/test" element={<NumberInput />} />
      </Routes>
    </>
  );
}

export default AppIot;
