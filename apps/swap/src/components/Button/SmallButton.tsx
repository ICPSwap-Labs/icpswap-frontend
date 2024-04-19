import { Typography, TypographyProps } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import React from "react";

export interface SmallButtonProps {
  children: React.ReactNode;
  onClick: TypographyProps["onClick"];
}

export function SmallButton({ children, onClick }: SmallButtonProps) {
  const theme = useTheme() as Theme;

  return (
    <Typography
      sx={{
        padding: "1px 3px",
        cursor: "pointer",
        borderRadius: "2px",
        backgroundColor: theme.colors.secondaryMain,
        color: "#ffffff",
        fontSize: "12px",
      }}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
}
