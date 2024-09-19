import { ReactNode } from "react";
import { useTheme, Typography, BoxProps } from "../Mui";
import { Flex } from "../Grid/Flex";

export interface MenuItemProps {
  onMenuClick: (value: any) => void;
  active?: boolean;
  label: ReactNode;
  icon?: ReactNode;
  value: any;
  children?: ReactNode;
  onMouseEnter?: BoxProps["onMouseEnter"];
  onMouseLeave?: BoxProps["onMouseLeave"];
  disabled?: boolean;
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
}: MenuItemProps) {
  const theme = useTheme();

  return (
    <Flex
      fullWidth
      sx={{
        background: theme.palette.background.level1,
        paddingTop: "10px",
        paddingBottom: "10px",
        padding: "0 12px",
        height: "44px",
        "&.active": {
          background: theme.palette.background.level3,
        },
        "&:hover": {
          background: disabled ? theme.palette.background.level1 : theme.palette.background.level3,
          "& svg": {
            color: "text.primary",
          },
          "& .nav-bar-label": {
            color: disabled ? "text.secondary" : "text.primary",
          },
        },
      }}
      onClick={() => onMenuClick(value)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Flex sx={{ color: active ? "text.primary" : "text.secondary" }} gap="0 10px" fullWidth>
        {icon}
        <Typography
          className="nav-bar-label"
          sx={{ fontSize: "16px", color: active ? "text.primary" : "text.secondary" }}
        >
          {label}
        </Typography>
      </Flex>

      {children}
    </Flex>
  );
}
