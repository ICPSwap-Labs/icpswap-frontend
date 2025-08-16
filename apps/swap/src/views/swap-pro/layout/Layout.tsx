import React, { useEffect, useState } from "react";
import { CssBaseline, Box, makeStyles, useTheme, Theme } from "components/Mui";
import Background from "components/Background";
import { Flex } from "@icpswap/ui";
import { useSettingGlobalTips } from "@icpswap/hooks";
import { GlobalTips } from "components/Layout/GlobalTips";

import Header from "./Header";

const useStyles = makeStyles((theme: Theme) => {
  return {
    appBar: {
      position: "fixed",
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
  const theme = useTheme();
  const classes = useStyles();

  const [globalTipsShow, setGlobalTipsShow] = useState<boolean>(true);
  const [globalTipsContent, setGlobalTipsContent] = useState<string | undefined>(undefined);

  const { result: globalTips } = useSettingGlobalTips();

  useEffect(() => {
    if (globalTips) {
      setGlobalTipsContent(globalTips.content);
    }
  }, [globalTips]);

  return (
    <>
      <CssBaseline />

      <Box className={classes.appBar}>
        <Flex
          fullWidth
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
        </Flex>
      </Box>

      <Box className={classes.mainContent}>
        <GlobalTips />
        <main className={classes.content}>{children}</main>
      </Box>

      <Background />
    </>
  );
}
