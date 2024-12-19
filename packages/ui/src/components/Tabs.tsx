import { ReactNode } from "react";

import { Box, Typography, BoxProps, useTheme } from "./Mui";

export interface SmallTabButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  background?: string;
  borderRadius?: string;
  padding?: string;
}

export function SmallTabButton({
  children,
  active,
  background,
  borderRadius = "50px",
  padding = "0 10px",
  onClick,
}: SmallTabButtonProps) {
  const theme = useTheme();

  return (
    <Typography
      component="span"
      color={active ? "text.primary" : "text.secondary"}
      sx={{
        background: active ? background ?? theme.palette.background.level3 : "transparent",
        borderRadius,
        display: "flex",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: 400,
        padding,
      }}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
}

interface SmallTabsButtonWrapperProps {
  sx?: BoxProps["sx"];
  background?: string;
  children?: ReactNode;
  padding?: string;
  borderRadius?: string;
  border?: string;
}

export function SmallTabsButtonWrapper({
  children,
  borderRadius = "50px",
  background,
  padding = "2px",
  border = "none",
  sx,
}: SmallTabsButtonWrapperProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding,
        background: background ?? theme.palette.background.level4,
        borderRadius,
        border,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
