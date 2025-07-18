import React, { useState, useMemo } from "react";
import { makeStyles, Box, Theme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { useLocation } from "react-router-dom";
import Background from "components/Background";

import V3Event from "./V3Event";
import Header from "./Header";
import { SubnetState } from "./SubnetState";
import { GlobalTips } from "./GlobalTips";
import { Ads } from "./ads/Ad";

const useStyles = makeStyles((theme: Theme) => {
  return {
    content: {
      background: "transparent",
      width: "100%",
      flexGrow: 1,
      padding: "0 16px",
      borderRadius: "8px",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      "&.pro-padding": {
        padding: "0 12px",
      },
      "&.info": {
        padding: 0,
      },
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down("md")]: {
        padding: "0 16px",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "0 12px",
        backgroundColor: "transparent",
      },
    },
    mainContent: {
      position: "relative",
      minHeight: "calc(100vh - 64px)",
      // For network state
      paddingBottom: `${90 + 53}px`,
      "&.pro": {
        background: theme.palette.background.level1,
      },
    },
  };
});

export function MainLayout({ children }: { children: React.ReactNode }) {
  const classes = useStyles();
  const location = useLocation();

  const [show, setShow] = useState(true);

  const isSwapPro = useMemo(() => {
    return location.pathname === "/swap/pro";
  }, [location]);

  return (
    <>
      <Flex
        fullWidth
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
        vertical
        align="flex-start"
      >
        <Ads />
        <Header />
      </Flex>

      <Box className={`${classes.mainContent} ${location.pathname === "/swap/pro" ? "pro" : ""}`}>
        {show && location.pathname.includes("/swap/v2") ? <V3Event onClick={() => setShow(false)} /> : null}

        <GlobalTips />

        <main
          className={`${classes.content}${isSwapPro ? " pro-padding" : ""}${
            location.pathname.includes("info") ? " info" : ""
          }`}
        >
          {children}
        </main>

        <SubnetState fullWidth={isSwapPro} wrapperSx={{ padding: isSwapPro ? "0 12px" : "0px" }} />
      </Box>

      <Background />
    </>
  );
}
