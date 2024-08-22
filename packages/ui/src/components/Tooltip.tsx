import React, { useState } from "react";
import { Typography, Tooltip as MuiToolTip } from "@mui/material";
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
    <MuiToolTip
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
        <Typography
          component="div"
          sx={{
            color: "#111936",
            fontSize: "12px",
            lineHeight: "18px",
          }}
        >
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
    </MuiToolTip>
  );
}
