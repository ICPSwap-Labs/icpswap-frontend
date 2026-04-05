import { Flex } from "@icpswap/ui";
import Background from "components/Background";
import { GlobalTips } from "components/Layout/GlobalTips";
import { Box, CssBaseline, useTheme } from "components/Mui";
import Header from "components/swap/pro/layout/Header";
import type React from "react";

export interface SwapProLayoutProps {
  children: React.ReactNode;
}

export function SwapProLayout({ children }: SwapProLayoutProps) {
  const theme = useTheme();

  return (
    <>
      <CssBaseline />

      <Box sx={{ position: "fixed", backgroundColor: "#0B132F" }}>
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

      <Box
        sx={{
          paddingTop: "64px",
          [theme.breakpoints.down("md")]: {
            paddingTop: "60px",
          },
        }}
      >
        <GlobalTips />
        <Box
          component="main"
          sx={{
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
          }}
        >
          {children}
        </Box>
      </Box>

      <Background />
    </>
  );
}
