import { ReactNode } from "react";
import { Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    box: {
      width: "100%",
      maxWidth: "1400px",
    },
  };
});

export default function Wrapper({ children }: { children: ReactNode }) {
  const classes = useStyles();

  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
        className={classes.box}
      >
        {children}
      </Box>
    </Grid>
  );
}
