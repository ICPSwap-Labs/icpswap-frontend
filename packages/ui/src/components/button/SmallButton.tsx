import type React from "react";

import { Typography, type TypographyProps, useTheme } from "../Mui";

export interface SmallButtonProps {
  children: React.ReactNode;
  onClick: TypographyProps["onClick"];
  background?: string;
  color?: string;
  fontWeight?: number;
}

export function SmallButton({ children, onClick, background, color, fontWeight }: SmallButtonProps) {
  const isClassicDesign = useTheme().customization?.designVersion !== "modern";

  if (isClassicDesign) {
    return (
      <Typography
        sx={{
          padding: "2px",
          cursor: "pointer",
          borderRadius: "4px",
          backgroundColor: background ?? "#252E68",
          color: color ?? "#377BFF",
          fontSize: "12px",
          fontWeight: fontWeight ?? 400,
        }}
        onClick={onClick}
      >
        {children}
      </Typography>
    );
  }

  return (
    <Typography
      className="btn btn-xs btn-soft btn-primary"
      sx={{
        padding: "3px 7px",
        cursor: "pointer",
        borderRadius: "6px",
        backgroundColor: background ?? "color-mix(in srgb, var(--color-primary) 13%, transparent)",
        color: color ?? "var(--color-primary)",
        fontSize: "11px",
        fontWeight: fontWeight ?? 600,
        lineHeight: 1.4,
        height: "auto",
        minHeight: 0,
        border: 0,
        boxShadow: "none",
        transition: "background-color 160ms ease",
        "&:hover": {
          backgroundColor: "color-mix(in srgb, var(--color-primary) 22%, transparent)",
        },
      }}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
}
