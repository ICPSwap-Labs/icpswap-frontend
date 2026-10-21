import { nonUndefinedOrNull } from "@icpswap/utils";
import CloseIcon from "@mui/icons-material/Close";
import type React from "react";
import { type ReactNode, useRef, useState } from "react";
import { ChevronDown } from "react-feather";

import { Box, makeStyles, type Theme, Typography } from "../Mui";
import type { MenuProps } from "./types";

interface StyleProps {
  contained: boolean;
  fullHeight?: boolean;
  filled?: boolean;
  padding?: string;
}

const useStyles = ({ contained, fullHeight, filled, padding }: StyleProps) => {
  return makeStyles((theme: Theme) => {
    return {
      inputBox: {
        display: "flex",
        alignItems: "center",
        background: filled ? "var(--color-base-300)" : "var(--color-base-200)",
        borderRadius: "12px",
        boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-base-content) 8%, transparent)",
        transition: "background-color 180ms ease, box-shadow 180ms ease",
        padding: padding !== undefined ? padding : contained ? `9px 16px` : `${fullHeight ? "0px" : "12px"} 16px`,
        width: "100%",
        "& input": {
          color: theme.palette.text.primary,
        },
        "&.none-background": {
          background: "transparent",
          boxShadow: "none",
        },
        "&:hover": {
          boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 35%, transparent)",
        },
      },
    };
  });
};

export interface PanelProps {
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  required?: boolean;
  maxWidth?: number;
  fullHeight?: boolean;
  contained?: boolean;
  placeholder?: string;
  filled?: boolean;
  showClean?: boolean;
  showBackground?: boolean;
  minMenuWidth?: string;
  valueColor?: string;
  padding?: string;
  menu: MenuProps | undefined | null;
  onClick?: (event: any) => void;
  open: boolean;
  panel?: (menu: MenuProps | null | undefined) => ReactNode;
}

export function SelectPanel({
  label,
  value,
  onChange,
  required,
  maxWidth,
  fullHeight,
  contained = true,
  filled,
  showClean = true,
  showBackground = true,
  valueColor,
  padding,
  menu,
  placeholder,
  onClick,
  open,
  panel,
}: PanelProps) {
  const classes = useStyles({ contained, fullHeight, filled, padding })();
  const outerBoxRef = useRef<HTMLElement | null>(null);

  const [showClose, setShowClose] = useState<boolean>(false);

  const handleMouseEnter = () => {
    if (showClean === false) return;
    setShowClose(true);
  };

  const handleMouseLeave = () => {
    setShowClose(false);
  };

  const handleEmptyValue = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    if (onChange) onChange(undefined);
  };

  return (
    <Box
      ref={outerBoxRef}
      className={`ics-select ${classes.inputBox}${showBackground ? "" : " none-background"}`}
      sx={{
        ...(fullHeight ? { height: "100%" } : {}),
        ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {contained && label && (
        <Box>
          {required && (
            <Typography sx={{ color: "var(--color-error)" }} fontSize={12} component="span">
              *
            </Typography>
          )}

          <Typography component="span" fontSize={12}>
            {label}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          {nonUndefinedOrNull(value) || panel?.(menu) ? (
            <Typography color={valueColor ?? "text.primary"} component="div">
              {panel ? panel(menu) : (menu?.selectLabel ?? menu?.label)}
            </Typography>
          ) : (
            <Typography color="color-mix(in srgb, var(--color-base-content) 45%, transparent)">
              {placeholder}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {showClose && !!value ? (
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleEmptyValue} />
          ) : (
            <ChevronDown
              style={{ transition: "all 300ms", rotate: open ? "180deg" : "0deg", cursor: "pointer" }}
              size={16}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
