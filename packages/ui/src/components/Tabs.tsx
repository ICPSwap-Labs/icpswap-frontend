import type { ReactNode } from "react";

import { Box, type BoxProps, Typography, useTheme } from "./Mui";

export interface SmallTabButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  background?: string;
  borderRadius?: string;
  padding?: string;
}

export function SmallTabButton({ children, active, background, borderRadius, padding, onClick }: SmallTabButtonProps) {
  const isClassicDesign = useTheme().customization?.designVersion !== "modern";
  const theme = useTheme();
  borderRadius ??= isClassicDesign ? "50px" : "4px";
  padding ??= isClassicDesign ? "0 10px" : "8px 12px";

  if (isClassicDesign) {
    return (
      <Typography
        component="span"
        color={active ? "text.primary" : "text.secondary"}
        sx={{
          background: active ? (background ?? theme.palette.background.level3) : "transparent",
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

  return (
    <Typography
      className={`tab ics-tab ${active ? "tab-active" : ""}`}
      component="span"
      color={active ? "text.primary" : "text.secondary"}
      sx={{
        background: active ? (background ?? "var(--color-secondary)") : "transparent",
        color: active
          ? background
            ? "var(--color-base-content)"
            : "var(--color-secondary-content)"
          : "color-mix(in srgb, var(--color-base-content) 58%, transparent)",
        borderRadius,
        display: "flex",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: active ? 600 : 500,
        padding,
        height: "auto",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        transition: "background 180ms ease, color 180ms ease",
        boxShadow: "none",
        "&:hover": {
          color: active && !background ? "var(--color-secondary-content)" : "var(--color-base-content)",
          backgroundColor: active ? (background ?? "var(--color-secondary)") : "var(--color-base-300)",
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
  borderRadius,
  background,
  padding,
  border = "none",
  sx,
}: SmallTabsButtonWrapperProps) {
  const isClassicDesign = useTheme().customization?.designVersion !== "modern";
  const theme = useTheme();
  borderRadius ??= isClassicDesign ? "50px" : "6px";
  padding ??= isClassicDesign ? "2px" : "4px";

  if (isClassicDesign) {
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
        boxShadow: "none",
        borderRadius,
        border,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
