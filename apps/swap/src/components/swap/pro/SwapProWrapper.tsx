import React from "react";
import { Box, useTheme, BoxProps } from "components/Mui";

export interface SwapProCardWrapperProps {
  children: React.ReactNode;
  padding?: string;
  background?: "level2" | "level3";
  overflow?: "hidden" | "visible";
  sx?: BoxProps["sx"];
}

export function SwapProCardWrapper({
  children,
  overflow = "hidden",
  padding = "16px",
  background = "level3",
  sx,
}: SwapProCardWrapperProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: background === "level3" ? theme.palette.background.level3 : theme.palette.background.level2,
        padding,
        borderRadius: "12px",
        overflow,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
