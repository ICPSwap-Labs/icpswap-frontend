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
  menuWidth?: string;
  children: ReactNode;
}

export function MenuWrapper({ open, onClickAway, anchor, placement, menuWidth, children }: MenuWrapperProps) {
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
            border: `1px solid ${theme.palette.background.level3}`,
            padding: "10px 0",
            width: `${menuWidth ?? "146px"}!important`,
            borderRadius: "12px",
          }}
        >
          {children}
        </Box>
      </ClickAwayListener>
    </Popper>
  );
}
