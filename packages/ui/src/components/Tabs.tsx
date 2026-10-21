import type { ReactNode } from "react";

import { Box, type BoxProps, Typography } from "./Mui";

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
  borderRadius = "9px",
  padding = "8px 12px",
  onClick,
}: SmallTabButtonProps) {
  return (
    <Typography
      className={`tab ics-tab ${active ? "tab-active" : ""}`}
      component="span"
      color={active ? "text.primary" : "text.secondary"}
      sx={{
        background: active
          ? (background ?? "color-mix(in srgb, var(--color-primary) 15%, var(--color-base-100))")
          : "transparent",
        color: active ? "var(--color-base-content)" : "color-mix(in srgb, var(--color-base-content) 58%, transparent)",
        borderRadius,
        display: "flex",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: active ? 600 : 500,
        padding,
        height: "auto",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        transition: "background 180ms ease, color 180ms ease, box-shadow 180ms ease",
        boxShadow: active ? "inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 20%, transparent)" : "none",
        "&:hover": {
          color: "var(--color-base-content)",
          backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
        },
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
  borderRadius = "12px",
  background,
  padding = "4px",
  border = "none",
  sx,
}: SmallTabsButtonWrapperProps) {
  return (
    <Box
      className="tabs tabs-box ics-tabs"
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding,
        background: background ?? "var(--color-base-200)",
        gap: "2px",
        boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-base-content) 5%, transparent)",
        borderRadius,
        border,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
