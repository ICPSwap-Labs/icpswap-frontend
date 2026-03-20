import type React from "react";

import { Tooltip as MuiToolTip, Typography } from "./Mui";

export interface TextOverflowTipProps {
  background?: string;
  tips: React.ReactNode;
  maxWidth?: string;
  children: React.ReactElement;
}

export function TextOverflowTip({ tips, background, maxWidth, children }: TextOverflowTipProps) {
  return (
    <MuiToolTip
      PopperProps={{
        sx: {
          display: "flex",
          justifyContent: "center",
          "& .MuiTooltip-tooltip": {
            background,
            borderRadius: "8px",
            padding: "12px 16px",
            maxWidth: maxWidth ?? "300px",
            "& .MuiTooltip-arrow": {
              color: background,
            },
          },
        },
      }}
      title={
        <Typography color="#111936" fontSize={12} component="div">
          {tips}
        </Typography>
      }
      arrow
    >
      {children}
    </MuiToolTip>
  );
}
