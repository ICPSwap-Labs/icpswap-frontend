import { ClickAwayListener } from "@mui/base";
import { ReactNode } from "react";

import { useTheme, Box, Popper, makeStyles } from "../Mui";

const useStyles = makeStyles(() => {
  return {
    popper: {
      zIndex: 1101,
    },
  };
});

export interface MenuWrapperProps {
  open: boolean;
  onClickAway: () => void;
  anchor: any;
  placement?:
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "right-start"
    | "right-end"
    | "left-start"
    | "left-end";
  children: ReactNode;
  border?: string;
  padding?: string;
  menuWidth?: string;
}

export function MenuWrapper({
  open,
  menuWidth,
  onClickAway,
  border,
  padding,
  anchor,
  placement,
  children,
}: MenuWrapperProps) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Popper
      open={open}
      anchorEl={anchor}
      placement={placement ?? "right-start"}
      popperOptions={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 0],
            },
          },
        ],
      }}
      className={classes.popper}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <Box
          sx={{
            background: theme.palette.background.level1,
            border: border ?? `1px solid ${theme.palette.background.level3}`,
            padding: padding ?? "4px 0",
            borderRadius: "12px",
            ...(menuWidth ? { width: `${menuWidth}!important` } : {}),
          }}
        >
          {children}
        </Box>
      </ClickAwayListener>
    </Popper>
  );
}
