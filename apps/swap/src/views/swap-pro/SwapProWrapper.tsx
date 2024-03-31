import React from "react";
import { Box, useTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";

export interface SwapProCardWrapperProps {
  children: React.ReactNode;
  padding?: string;
  background?: "level2" | "level3";
}

export function SwapProCardWrapper({ children, padding = "16px", background = "level3" }: SwapProCardWrapperProps) {
  const theme = useTheme() as Theme;

  return (
    <Box
      sx={{
        background: background === "level3" ? theme.palette.background.level3 : theme.palette.background.level2,
        padding,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}
