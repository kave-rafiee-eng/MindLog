import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";

export default function SimpleCharts({ chartData, period }) {
  const allDates = [];
  const allValues = [];

  const dateNow = new Date();

  for (let i = period; i >= 0; i--) {
    const currentDate = dateNow.getTime() - i * 24 * 60 * 60 * 1000;
    allDates.push(
      new Date(currentDate).toLocaleDateString("fa-IR-u-ca-persian"),
    );
  }

  allDates.forEach((dateString) => {
    const findedData = chartData.find(
      (data) =>
        new Date(data.Date).toLocaleDateString("fa-IR-u-ca-persian") ===
        dateString,
    );

    allValues.push(findedData ? Number(findedData.value) : 0);
  });

  return (
    <BarChart
      xAxis={[
        {
          id: "x-axis",
          data: allDates,
        },
      ]}
      series={[
        {
          data: allValues,
          label: "Value",
          colorGetter: (point) => (point.value < 0 ? "red" : "#1976d2"),
        },
      ]}
      height={300}
    />
  );
}
