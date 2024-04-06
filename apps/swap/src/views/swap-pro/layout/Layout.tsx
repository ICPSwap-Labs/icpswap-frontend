import React, { useState } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import { AppBar, CssBaseline, Grid, Box } from "@mui/material";
import { Theme } from "@mui/material/styles";
import Background from "components/Background";
import { GlobalTips } from "@icpswap/ui";

import Header from "./Header";

const useStyles = makeStyles((theme: Theme) => {
  return {
    appBar: {
      backgroundColor: "#0B132F",
    },
    content: {
      background: "transparent",
      width: "100%",
      minHeight: "calc(100vh - 64px)",
      flexGrow: 1,
      padding: "8px",
      borderRadius: `${theme.customization.borderRadius}px`,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down("md")]: {
        padding: "8px",
        minHeight: "calc(100vh - 60px)",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "8px",
        backgroundColor: "transparent",
      },
    },

    mainContent: {
      paddingTop: "64px",
      [theme.breakpoints.down("md")]: {
        paddingTop: "60px",
      },
    },
  };
});

export interface SwapProLayoutProps {
  children: React.ReactNode;
}

export function SwapProLayout({ children }: SwapProLayoutProps) {
  const theme = useTheme() as Theme;
  const classes = useStyles();
  const [globalTipShow, setGlobalTipShow] = useState(false);

  return (
    <>
      <CssBaseline />

      <AppBar position="fixed" color="inherit" elevation={0} className={classes.appBar}>
        <Grid
          container
          alignItems="center"
          sx={{
            padding: "0 20px",
            height: "64px",
            [theme.breakpoints.down("md")]: {
              height: "60px",
              padding: "0 12px",
            },
          }}
        >
          <Header />
        </Grid>
      </AppBar>

      <Box className={classes.mainContent}>
        {globalTipShow ? <GlobalTips onClose={() => setGlobalTipShow(false)} /> : null}
        <main className={classes.content}>{children}</main>
      </Box>

      <Background />
    </>
  );
}
