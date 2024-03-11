import React from "react";
import { Typography, Tooltip, Box } from "@mui/material";
import { ReactComponent as TooltipIcon } from "assets/icons/tooltip.svg";

export interface TooltipProps {
  background?: string;
  tips: React.ReactChild;
  iconSize?: string;
}

export default function SwapTooltip({ tips, background, iconSize = "16px" }: TooltipProps) {
  return (
    <Tooltip
      PopperProps={{
        // @ts-ignore
        sx: {
          "& .MuiTooltip-tooltip": {
            background: background,
            borderRadius: "8px",
            padding: "12px 16px",
            "& .MuiTooltip-arrow": {
              color: background,
            },
          },
        },
      }}
      title={
        <Typography color="text.400" fontSize={12}>
          {tips}
        </Typography>
      }
      arrow
    >
      <TooltipIcon width={iconSize} height={iconSize} />
    </Tooltip>
  );
}
