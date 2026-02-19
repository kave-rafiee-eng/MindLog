import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import React from "react";

type CardSettingProps = {
  title: string;
  children: React.ReactNode;
};

export default function CardSetting({ title, children }: CardSettingProps) {
  React.useEffect(() => {
    console.log("CardSetting---------------");
  }, []);
  return (
    <Grid container direction="column" spacing={1}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: "100%",
            },
            background: "#dfdbdb",
          }}
        >
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  background: "#e6e3e3",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Typography variant="h6">{title}</Typography>
              </Box>
            </CardContent>

            <CardActions>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "center",
                  width: "100%",
                  //background: "#b1b1b1",
                  m: 1,
                  py: 2,
                  alignItems: "center",
                }}
              >
                {children}
              </Box>
            </CardActions>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
