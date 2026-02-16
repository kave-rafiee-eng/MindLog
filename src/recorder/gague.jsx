import Stack from "@mui/material/Stack";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useEffect, useState } from "react";

export default function GaugeValueRange() {
  const [time, setTime] = useState(0);

  const color = time > 50 ? "#bc212e" : "#28b849";

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime >= 100 ? 0 : prevTime + 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 3 }}>
      <Gauge
        width={100}
        height={100}
        value={time}
        animationDuration={0}
        sx={{
          [`& .${gaugeClasses.valueText}`]: { fontSize: 20 },
          [`& .${gaugeClasses.valueArc}`]: { fill: color },
        }}
      />

      <Gauge width={100} height={100} value={50} valueMin={10} valueMax={60} />
    </Stack>
  );
}
