import type React from "react";
import { Box, type BoxProps } from "./Mui";

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
  const surface =
    level === 2
      ? "var(--color-base-200)"
      : level === 4 || level === 5
        ? "var(--color-base-300)"
        : "var(--color-base-100)";

  return (
    <Box
      id={id}
      sx={{
        backgroundColor: surface,
        border: `1px solid color-mix(in srgb, var(--color-base-content) ${border ? "12%" : "7%"}, transparent)`,
        borderRadius: borderRadius ?? "20px",
        padding: padding ?? "24px",
        width: "100%",
        overflow: "hidden",
        boxShadow:
          "0 8px 32px color-mix(in srgb, var(--color-neutral) 8%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-base-content) 3%, transparent)",
        transition: "border-color 180ms ease, box-shadow 180ms ease",
        ...(onClick
          ? {
              "&:hover": {
                borderColor: "color-mix(in srgb, var(--color-primary) 35%, transparent)",
                boxShadow: "0 12px 36px color-mix(in srgb, var(--color-primary) 6%, transparent)",
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
