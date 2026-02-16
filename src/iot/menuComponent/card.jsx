import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

export default function CardSetting({ title, Child }) {
  return (
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
