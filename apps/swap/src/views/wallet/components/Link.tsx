import { Box, Typography } from "@mui/material";
import { LinkArrowIcon } from "assets/icons/LinkArrow";
import React from "react";

export interface LinkProps {
  href: string;
  label: React.ReactNode;
}

export function Link({ href, label }: LinkProps) {
  return (
    <a href={href} target="_blank" style={{ textDecoration: "none" }} rel="noreferrer">
      <Box sx={{ display: "flex", gap: "0 10px", alignItems: "center" }}>
        <Typography>{label}</Typography>
        <LinkArrowIcon />
      </Box>
    </a>
  );
}
