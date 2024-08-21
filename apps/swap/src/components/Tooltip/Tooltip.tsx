import React, { useState } from "react";
import { Typography, Tooltip as MuiTooltip } from "components/Mui";
import { HelpCircle } from "react-feather";

export interface TooltipProps {
  background?: string;
  tips: React.ReactChild;
  iconSize?: string;
  iconColor?: string;
  maxWidth?: string;
}

export function Tooltip({ tips, background, maxWidth, iconSize = "16px", iconColor = "#8492C4" }: TooltipProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <MuiTooltip
      open={open}
      TransitionProps={{
        timeout: 300,
      }}
      PopperProps={{
        // @ts-ignore
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
        <Typography color="#111936" fontSize={12} component="div" lineHeight="16px">
          {tips}
        </Typography>
      }
      arrow
    >
      <HelpCircle
        size={iconSize}
        color={iconColor}
        onClick={handleClick}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ cursor: "pointer" }}
      />
    </MuiTooltip>
  );
}
