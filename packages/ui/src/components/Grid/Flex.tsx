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
  sx?: BoxProps["sx"];
  className?: string;
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
  sx,
  className,
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
        ...sx,
      }}
      className={className}
    >
      {children}
    </Box>
  );
}
