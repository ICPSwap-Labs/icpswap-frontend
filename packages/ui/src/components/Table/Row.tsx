import React from "react";

import { Box, BoxProps } from "../Mui";

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
      className={className}
      sx={{
        padding: padding ? `${padding}!important` : "20px 0",
        borderBottom: borderBottom ?? "1px solid rgba(189, 200, 240, 0.082)",
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
