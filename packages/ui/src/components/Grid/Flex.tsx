import { ReactNode } from "react";

import { Box, BoxProps } from "../Mui";

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
  fullWidth?: boolean;
  className?: string;
  wrap?: BoxProps["flexWrap"];
  onClick?: BoxProps["onClick"];
  onMouseEnter?: BoxProps["onMouseEnter"];
  onMouseLeave?: BoxProps["onMouseLeave"];
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
  fullWidth,
  className,
  wrap,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FlexProps) {
  return (
    <Box
      sx={{
        flexDirection: vertical ? "column" : "row",
        gridAutoRows: "auto",
        display: "flex",
        width: width || (fullWidth ? "100%" : "auto"),
        alignItems: align ?? "center",
        justifyContent: justify ?? "flex-start",
        flexWrap: wrap,
        padding: padding ?? 0,
        border,
        borderRadius,
        margin: margin ?? 0,
        gap,
        ...sx,
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Box>
  );
}
