import { ReactNode, ReactElement } from "react";
import { HelpCircle } from "react-feather";

import { Typography, Tooltip as MuiToolTip, Box } from "./Mui";

export interface TooltipProps {
  background?: string;
  tips: ReactNode;
  iconSize?: string;
  iconColor?: string;
  maxWidth?: string;
  children?: ReactElement;
}

export function Tooltip({
  tips,
  background,
  maxWidth,
  iconSize = "16px",
  children,
  iconColor = "#8492C4",
}: TooltipProps) {
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
            "& .tooltip-typography": {
              color: "#111936",
              fontSize: "12px",
              lineHeight: "18px",
            },
          },
        },
      }}
      title={
        <Typography component="div" className="tooltip-typography">
          {tips}
        </Typography>
      }
      arrow
    >
      {children || (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: iconSize,
            height: iconSize,
          }}
        >
          <HelpCircle size={iconSize} color={iconColor} style={{ cursor: "pointer" }} />
        </Box>
      )}
    </MuiToolTip>
  );
}
