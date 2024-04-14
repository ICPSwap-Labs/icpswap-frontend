import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";

export interface FlexProps {
  width?: string;
  align?: BoxProps["alignItems"];
  justify?: BoxProps["justifyContent"];
  padding?: string;
  border?: string;
  borderRadius?: string;
  children: ReactNode;
  margin?: string;
  gap?: BoxProps["gap"];
  vertical?: boolean;
}

export function Flex({
  vertical,
  gap,
  children,
  width,
  align,
  justify,
  padding,
  border,
  borderRadius,
  margin,
}: FlexProps) {
  return (
    <Box
      sx={{
        flexDirection: vertical ? "column" : "row",
        gridAutoRows: "auto",
        display: "flex",
        width: width ?? "auto",
        alignItems: align ?? "center",
        justifyContent: justify ?? "flex-start",
        padding: padding ?? 0,
        border,
        borderRadius,
        margin: margin ?? 0,
        gap,
      }}
    >
      {children}
    </Box>
  );
}
