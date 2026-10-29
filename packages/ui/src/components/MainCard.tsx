import { useMemo } from "react";
import type React from "react";
import { Box, type BoxProps, useTheme } from "./Mui";

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
  const isClassicDesign = useTheme().customization?.designVersion !== "modern";
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
  }, [
    level,
    border,
    theme.palette.background.level1,
    theme.palette.background.level2,
    theme.palette.background.level3,
    theme.palette.background.level4,
  ]);

  const surface =
    level === 2
      ? "var(--color-base-200)"
      : level === 4 || level === 5
        ? "var(--color-base-300)"
        : "var(--color-base-100)";

  if (isClassicDesign) {
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

  return (
    <Box
      id={id}
      sx={{
        backgroundColor: surface,
        border: `1px solid color-mix(in srgb, var(--color-base-content) ${border ? "12%" : "7%"}, transparent)`,
        borderRadius: borderRadius ?? "8px",
        padding: padding ?? "24px",
        width: "100%",
        overflow: "hidden",
        boxShadow: "none",
        transition: "border-color 180ms ease, background-color 180ms ease",
        ...(onClick
          ? {
              "&:hover": {
                borderColor: "var(--color-secondary)",
              },
            }
          : {}),
        "@media(max-width: 640px)": {
          padding: padding ?? "16px",
        },
        ...sx,
      }}
      onClick={onClick}
      className={`ics-card bg-base-100 ${className ?? ""}`}
    >
      {children}
    </Box>
  );
}
