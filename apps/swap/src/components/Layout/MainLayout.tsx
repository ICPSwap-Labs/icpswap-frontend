import React, { useState, useMemo } from "react";
import { makeStyles, useTheme, Box, Theme, Typography } from "components/Mui";
import { Flex, GlobalTips } from "@icpswap/ui";
import { useLocation } from "react-router-dom";
import Background from "components/Background";

import V3Event from "./V3Event";
import Header from "./Header";
import { SnsTips } from "./SnsTips";

const useStyles = makeStyles((theme: Theme) => {
  return {
    content: {
      background: "transparent",
      width: "100%",
      minHeight: "calc(100vh - 64px)",
      flexGrow: 1,
      padding: "0 16px",
      borderRadius: "8px",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      "&.small-padding": {
        padding: "0 12px",
      },
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down("md")]: {
        padding: "0 16px",
        minHeight: "calc(100vh - 60px)",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "0 12px",
        backgroundColor: "transparent",
      },
    },
    mainContent: {
      paddingTop: "64px",
      "&.pro": {
        background: theme.palette.background.level1,
      },
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
  const [globalTipShow, setGlobalTipShow] = useState(false);
  const [snsTipShow, setSnsTipShow] = useState(true);

  const isSmallPadding = useMemo(() => {
    return SMALL_PADDING_PATH.includes(location.pathname);
  }, [location]);

  return (
    <>
      <Flex
        fullWidth
        sx={{
          position: "fixed",
          top: 0,
          padding: "0 20px",
          height: "64px",
          backgroundColor: "#0B132F",
          zIndex: 2,
          [theme.breakpoints.down("md")]: {
            height: "60px",
          },
        }}
      >
        <Header />
      </Flex>

      <Box className={`${classes.mainContent} ${location.pathname === "/swap/pro" ? "pro" : ""}`}>
        {show && location.pathname.includes("/swap/v2") ? <V3Event onClick={() => setShow(false)} /> : null}
        {globalTipShow ? <GlobalTips onClose={() => setGlobalTipShow(false)} /> : null}
        {snsTipShow && location.pathname.includes("sns") ? <SnsTips onClose={() => setSnsTipShow(false)} /> : null}
        {location.pathname.includes("/stake/v1") ? (
          <GlobalTips>
            <Typography
              sx={{
                color: "#ffffff",
                cursor: "pointer",
                "@media(max-width: 640px)": { fontSize: "12px" },
              }}
            >
              Support for Staking Pool V1 will end on{" "}
              <Typography
                component="span"
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
                  "@media(max-width: 640px)": { fontSize: "12px" },
                }}
              >
                November 5, 2024
              </Typography>
              . Please&nbsp;
              <Typography
                component="span"
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
                  "@media(max-width: 640px)": { fontSize: "12px" },
                }}
              >
                Withdraw Your Rewards & Tokens
              </Typography>
              &nbsp; before this date. Thank you for your understanding!
            </Typography>
          </GlobalTips>
        ) : null}

        <main className={`${classes.content} ${isSmallPadding ? "small-padding" : ""}`}>{children}</main>
      </Box>

      <Background />
    </>
  );
}
