import { Box, type BoxProps, useTheme } from "components/Mui";
import type React from "react";

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
      className="card swap-pro-panel"
      sx={{
        "--swap-pro-surface": theme.palette.background[background],
        background: background === "level3" ? "var(--color-base-100)" : "var(--color-base-200)",
        padding,
        borderRadius: "4px",
        overflow,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
