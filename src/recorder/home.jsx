import { useEffect, useState } from "react";
import SimpleCharts from "./chart";
import SimpleLineChart from "./lineChart";
import axios from "axios";

import TableProp from "./tableProp";
import RecordInputs from "./select";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import StickyHeadTable from "./stickyTable";

import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { P5Test } from "./p5Test";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const periodArr = [7, 30, 90, 360];
const PeriodOptions = ["week", "1 month", "6 month", "1 year"];

function Home() {
  const [selectedChart, setSelectedChart] = useState("bar");
  const [selectPeriod, setselectPeriod] = useState(PeriodOptions[0]);

  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    value: 0,
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/record/history");
      console.log(res.data);
      setData(res.data);
    } catch {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log("Error:" + err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostFrom = async (data) => {
    console.log("/record/new");
    let postData = [];
    postData.push(data);

    try {
      const res = await api.post("/record/new", postData);
      console.log(res.data);
    } catch {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log("Error:" + err.message);
      }
    }

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await api.post("/record/delete", { id: id });
      console.log(res.data);
    } catch {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log("Error:" + err.message);
      }
    }
    fetchData();
  };

  //let v = periodArr[PeriodOptions.findIndex((v) => v == selectPeriod)];
  //console.log(`period ${v}`);

  return (
    <div>
      <h3>Home</h3>
      <P5Test />
      <Grid container spacing={1} direction="column">
        <Grid container spacing={2}>
          <Grid item size={{ md: 3, sm: 12 }}>
            <RecordInputs handlePostRecord={handlePostFrom} />
          </Grid>
          <Grid item size={9}>
            {<StickyHeadTable tableData={data} deleteId={handleDelete} />}
          </Grid>
          {/*
          <Grid item xs={3} md={3}>
            <TableProp tableData={data} deleteId={handleDelete} />
          </Grid>*/}
        </Grid>

        <Grid container spacing={2} alignItems="flex-start">
          <Grid item size={{ md: 2, sm: 6 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="chart-select-label">Select Chart</InputLabel>
              <Select
                labelId="chart-select-label"
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
                input={<OutlinedInput label="Select Chart" />}
              >
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="line">Line Chart</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="date-select-label">Select Date</InputLabel>
              <Select
                labelId="date-select-label"
                value={selectPeriod}
                onChange={(e) => {
                  setselectPeriod(e.target.value);
                  console.log(e.target.value);
                }}
                input={<OutlinedInput label="Select Date" />}
              >
                {PeriodOptions.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={{ md: 10, sm: 12 }}>
            {selectedChart === "bar" && (
              <SimpleCharts
                chartData={data}
                period={
                  periodArr[PeriodOptions.findIndex((v) => v == selectPeriod)]
                }
              />
            )}
            {selectedChart === "line" && (
              <SimpleLineChart
                chartData={data}
                period={
                  periodArr[PeriodOptions.findIndex((v) => v == selectPeriod)]
                }
              />
            )}
          </Grid>
          <Grid item size={{ md: 10, sm: 12 }}></Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;

/*
  let now = new Date();
  let timestamp = now.getTime();

  console.log("timestamp" + timestamp);

  let iso = now.toISOString();
  console.log("iso : " + iso);

  let result = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  console.log(result);
  */
