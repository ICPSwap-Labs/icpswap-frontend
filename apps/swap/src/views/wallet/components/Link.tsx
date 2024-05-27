import { Box, Typography } from "@mui/material";
import { LinkArrowIcon } from "assets/icons/LinkArrow";
import React from "react";

export interface LinkProps {
  href: string;
  label: React.ReactNode;
  fontSize?: string;
}

export function Link({ href, label, fontSize = "14px" }: LinkProps) {
  return (
    <a href={href} target="_blank" style={{ textDecoration: "none", userSelect: "none" }} rel="noreferrer">
      <Box sx={{ display: "grid", gridTemplateColumns: "auto 10px", gap: "0 10px", alignItems: "center" }}>
        <Typography sx={{ fontSize }}>{label}</Typography>
        <LinkArrowIcon />
      </Box>
    </a>
  );
}
