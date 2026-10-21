import { Box, type BoxProps } from "components/Mui";
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
  return (
    <Box
      className="card swap-pro-panel"
      sx={{
        background: background === "level3" ? "var(--color-base-100)" : "var(--color-base-200)",
        padding,
        borderRadius: "16px",
        overflow,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
