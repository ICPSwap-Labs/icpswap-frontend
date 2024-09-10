import React from "react";

import { Typography, TypographyProps } from "../Mui";

export interface SmallButtonProps {
  children: React.ReactNode;
  onClick: TypographyProps["onClick"];
  background?: string;
  color?: string;
  fontWeight?: number;
}

export function SmallButton({ children, onClick, background, color, fontWeight }: SmallButtonProps) {
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
