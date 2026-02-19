import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import React from "react";

type CardSettingProps = {
  title: string;
  Child: React.ComponentType;
};

export default function CardSetting({ title, Child }: CardSettingProps) {
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
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">{title}</Typography>
              <Typography variant="body2">--</Typography>
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
                <Child />
              </Box>
            </CardActions>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
