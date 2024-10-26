import { Box, SxProps } from "@mui/material";
import React from "react";

export interface RowProps {
  borderBottom?: string;
  sx?: SxProps;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Row(props: RowProps) {
  return (
    <Box
      {...props}
      className={props.className}
      sx={{
        padding: "20px 0",
        borderBottom: props.borderBottom ?? "1px solid rgba(189, 200, 240, 0.082)",
        ...props.sx,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </Box>
  );
}
