import type { ReactNode } from "react";
import { Flex } from "../Grid/Flex";
import { type BoxProps, Typography, useTheme } from "../Mui";

export interface MenuItemProps {
  onMenuClick?: (value: any) => void;
  active?: boolean;
  label?: ReactNode;
  icon?: ReactNode;
  value: any;
  children?: ReactNode;
  onMouseEnter?: BoxProps["onMouseEnter"];
  onMouseLeave?: BoxProps["onMouseLeave"];
  disabled?: boolean;
  background?: string;
  activeBackground?: string;
  isFirst?: boolean;
  isLast?: boolean;
  height?: string;
  padding?: string;
  rightIcon?: ReactNode;
  labelColor?: string;
}

export function MenuItem({
  value,
  active,
  label,
  icon,
  onMenuClick,
  children,
  disabled,
  onMouseEnter,
  onMouseLeave,
  background,
  isFirst,
  isLast,
  activeBackground,
  height = "44px",
  padding = "0 24px",
  rightIcon,
  labelColor,
}: MenuItemProps) {
  const theme = useTheme();
  const __background = background ?? theme.palette.background.level1;
  const __activeBackground = activeBackground ?? theme.palette.background.level3;

  return (
    <Flex
      fullWidth
      sx={{
        background: __background,
        padding,
        height,
        "&.active": {
          background: __activeBackground,
        },
        "&:hover": {
          background: disabled ? __background : __activeBackground,
          "& svg": {
            color: "text.primary",
          },
          "& .nav-bar-label": {
            color: disabled ? "text.secondary" : (labelColor ?? "text.primary"),
          },
        },
        borderTopLeftRadius: isFirst ? "12px" : "0",
        borderTopRightRadius: isFirst ? "12px" : "0",
        borderBottomLeftRadius: isLast ? "12px" : "0",
        borderBottomRightRadius: isLast ? "12px" : "0",
        cursor: "pointer",
      }}
      onClick={() => {
        if (onMenuClick) onMenuClick(value);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label ? (
        <Flex gap="0 10px" fullWidth justify={rightIcon ? "space-between" : "flex-start"}>
          {icon}
          <Typography
            className="nav-bar-label"
            sx={{ fontSize: "14px", color: labelColor ?? (active ? "text.primary" : "text.secondary") }}
            component="div"
          >
            {label}
          </Typography>
          {rightIcon}
        </Flex>
      ) : null}

      {children}
    </Flex>
  );
}
