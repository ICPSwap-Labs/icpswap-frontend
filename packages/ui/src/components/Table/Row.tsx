import type React from "react";

import { Box, type BoxProps } from "../Mui";

export interface RowProps {
  borderBottom?: string;
  sx?: BoxProps;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: string;
}

export default function Row({ borderBottom, padding, sx, children, className, onClick }: RowProps) {
  return (
    <Box
      className={`ics-table-row ${className ?? ""}`}
      sx={{
        padding: padding ? `${padding}!important` : "20px 0",
        borderBottom: borderBottom ?? "1px solid color-mix(in srgb, var(--color-base-content) 6%, transparent)",
        transition: "background-color 160ms ease",
        "&:hover": {
          backgroundColor: "color-mix(in srgb, var(--color-primary) 4%, transparent)",
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
