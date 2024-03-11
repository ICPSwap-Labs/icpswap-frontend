import { ReactNode } from "react";
import { Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    box: {
      width: "95%",
      maxWidth: "1400px",
      background: "radial-gradient(50% 50% at 50% 50%,rgba(255, 143, 224, 0.1) 0,rgba(255,255,255,0) 100%)",
      padding: "20px 0",
      "@media (max-width: 640px)": {
        padding: "10px 0",
      },
    },
  };
});

export default function Wrapper({ children }: { children: ReactNode | ReactNode[] }) {
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
