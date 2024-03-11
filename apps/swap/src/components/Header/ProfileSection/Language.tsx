import { useRef, ReactNode } from "react";
import { makeStyles } from "@mui/styles";
import { MenuList, MenuItem, Popper, Box, Typography } from "@mui/material";
import { useState } from "react";
import { ClickAwayListener } from "@mui/base";
import { Theme } from "@mui/material/styles";
import { SUPPORTED_LOCALES, getLocalLabel, SupportedLocale } from "constants/locales";
import { useLocaleManager } from "hooks/useActiveLocale";

const useStyles = makeStyles((theme: Theme) => {
  return {
    navItem: {
      height: "40px",
      cursor: "pointer",
      padding: "0 16px",
      "&:hover": {
        "& .MuiTypography-root": {
          color: "#FFFFFF",
        },
      },
      "&.active": {
        "& .MuiTypography-root": {
          color: "#FFFFFF",
        },
      },
      [theme.breakpoints.down("md")]: {
        height: "36px",
        padding: "0 12px",
      },
    },
    more: {
      padding: "0 17px",
      cursor: "pointer",
      "&:hover": {
        "& .dot": {
          background: "#fff",
        },
      },
    },
    dot: {
      width: "5px",
      height: "5px",
      background: theme.colors.darkTextSecondary,
      borderRadius: "50%",
      marginRight: "6px",
      "&:last-child": {
        marginRight: "0px",
      },
    },
    popper: {
      zIndex: 1101,
    },
  };
});

export function LanguageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7.25" stroke="#111936" strokeWidth="1.5" />
      <path
        d="M13.25 10C13.25 11.8267 12.8253 13.4435 12.1772 14.5776C11.517 15.733 10.7193 16.25 10 16.25C9.28073 16.25 8.48296 15.733 7.82276 14.5776C7.17468 13.4435 6.75 11.8267 6.75 10C6.75 8.17334 7.17468 6.55649 7.82276 5.42236C8.48296 4.26701 9.28073 3.75 10 3.75C10.7193 3.75 11.517 4.26701 12.1772 5.42236C12.8253 6.55649 13.25 8.17334 13.25 10Z"
        stroke="#111936"
        strokeWidth="1.5"
      />
      <rect x="3" y="9.25" width="14" height="1.5" fill="#111936" />
    </svg>
  );
}

export default function Language({ children }: { children: ReactNode }) {
  const classes = useStyles();
  const ref = useRef(null);

  const [activeLocal, setLocal] = useLocaleManager();

  const [open, setOpen] = useState(false);

  const handleMoueEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSwitchLocal = (local: SupportedLocale) => {
    setLocal(local);
  };

  function isActive(local: SupportedLocale) {
    return local === activeLocal;
  }

  return (
    <Box ref={ref} onMouseLeave={handleMouseLeave} onMouseEnter={handleMoueEnter}>
      <Box>{children}</Box>

      {/* @ts-ignore */}
      <Popper
        open={open}
        anchorEl={ref?.current}
        placement="left-start"
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
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList autoFocusItem={open} className="customize-menu-list-light">
            {SUPPORTED_LOCALES.map((local, index) => (
              <MenuItem
                key={local ?? index}
                onClick={() => handleSwitchLocal(local)}
                className={`${isActive(local) ? "active" : ""}`}
              >
                <Typography className="customize-label">{getLocalLabel(local)}</Typography>
              </MenuItem>
            ))}
          </MenuList>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
