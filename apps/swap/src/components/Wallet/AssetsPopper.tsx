import { ClickAwayListener } from "@mui/base";
import { ReactNode } from "react";
import { useTheme, Box, Popper, makeStyles } from "components/Mui";

const useStyles = makeStyles(() => {
  return {
    popper: {
      zIndex: 1201,
    },
  };
});

export interface AssetsPopperProps {
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
  background?: string;
  padding?: string;
  menuWidth?: string;
}

export function AssetsPopper({ open, onClickAway, anchor, placement, children }: AssetsPopperProps) {
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
            background: theme.palette.background.level3,
            border: "1px solid #49588E",
            padding: "6px 0",
            borderRadius: "16px",
            width: "186px,",
          }}
        >
          {children}
        </Box>
      </ClickAwayListener>
    </Popper>
  );
}
