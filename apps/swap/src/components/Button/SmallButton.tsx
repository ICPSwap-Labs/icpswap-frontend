import { Typography, TypographyProps } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import React from "react";

export interface SmallButtonProps {
  children: React.ReactNode;
  onClick: TypographyProps["onClick"];
  background?: string;
}

export function SmallButton({ children, onClick, background }: SmallButtonProps) {
  const theme = useTheme() as Theme;

  return (
    <Typography
      sx={{
        padding: "3px",
        cursor: "pointer",
        borderRadius: "4px",
        backgroundColor: background ?? theme.colors.secondaryMain,
        color: "#ffffff",
        fontSize: "12px",
      }}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
}
