import React, { useState, useMemo } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import { AppBar, CssBaseline, Grid, Box } from "@mui/material";
import { Theme } from "@mui/material/styles";
import Background from "components/Background";
import { GlobalTips } from "@icpswap/ui";
import { useLocation } from "react-router-dom";
import V3Event from "./V3Event";
import Header from "./Header";
import { SnsTips } from "./SnsTips";

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
      padding: "16px",
      borderRadius: "8px",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      "&.small-padding": {
        padding: "8px 12px",
      },
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down("md")]: {
        padding: "16px",
        minHeight: "calc(100vh - 60px)",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "10px",
        marginRight: "10px",
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

const SMALL_PADDING_PATH = ["/swap/pro"];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme() as Theme;
  const classes = useStyles();
  const location = useLocation();

  const [show, setShow] = useState(true);
  const [globalTipShow, setGlobalTipShow] = useState(true);
  const [snsTipShow, setSnsTipShow] = useState(true);

  const isSmallPadding = useMemo(() => {
    return SMALL_PADDING_PATH.includes(location.pathname);
  }, [location]);

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
            },
          }}
        >
          <Header />
        </Grid>
      </AppBar>

      <Box className={classes.mainContent}>
        {show && location.pathname.includes("/swap/v2") ? <V3Event onClick={() => setShow(false)} /> : null}
        {globalTipShow ? <GlobalTips onClose={() => setGlobalTipShow(false)} /> : null}
        {snsTipShow && location.pathname.includes("sns") ? <SnsTips onClose={() => setSnsTipShow(false)} /> : null}

        <main className={`${classes.content} ${isSmallPadding ? "small-padding" : ""}`}>{children}</main>
      </Box>

      <Background />
    </>
  );
}
