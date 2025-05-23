import React, { useMemo } from "react";

import { Box, BoxProps, useTheme } from "./Mui";

export type MainCardBorder = "level1" | "level2" | "level3" | "level4";

export interface MainCardProps {
  border?: MainCardBorder;
  children: React.ReactNode;
  level?: number;
  onClick?: (event: any) => void;
  padding?: string;
  sx?: BoxProps["sx"];
  borderRadius?: string;
  className?: string;
  id?: string;
}

export function MainCard({
  id,
  border,
  level,
  onClick,
  padding,
  children,
  sx,
  borderRadius,
  className,
}: MainCardProps) {
  const theme = useTheme();

  const cardStyles = useMemo(() => {
    const _border =
      border === "level1"
        ? theme.palette.background.level1
        : border === "level2"
        ? theme.palette.background.level2
        : border === "level3"
        ? theme.palette.background.level3
        : border === "level4"
        ? theme.palette.background.level4
        : undefined;

    switch (level) {
      case 1:
        return {
          background: theme.palette.background.level1,
          ...(_border ? { border: `1px solid ${_border}` } : {}),
        };
      case 2:
        return {
          background: theme.palette.background.level2,
          ...(border ? { border: "2px solid rgba(255, 255, 255, 0.04)" } : {}),
        };
      case 3:
        return {
          background: theme.palette.background.level3,
          ...(_border ? { border: `1px solid ${_border}` } : {}),
        };
      case 4:
        return {
          background: theme.palette.background.level4,
          ...(_border ? { border: `1px solid ${_border}` } : {}),
        };
      case 5:
        return {
          background: "#273051",
          border: "0.5px solid #404558",
        };
      default:
        return {
          background: theme.palette.background.level3,
          ...(_border ? { border: `1px solid ${_border}` } : {}),
        };
    }
  }, [level, border]);

  return (
    <Box
      id={id}
      sx={{
        backgroundColor: cardStyles.background,
        ...(cardStyles.border ? { border: cardStyles.border } : {}),
        borderRadius: borderRadius ?? "16px",
        padding: padding ?? "24px",
        width: "100%",
        overflow: "hidden",
        "@media(max-width: 640px)": {
          padding: padding ?? "16px",
        },
        ...sx,
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </Box>
  );
}
