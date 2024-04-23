import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { MenuList, MenuItem, Popper, Typography } from "@mui/material";
import { ClickAwayListener } from "@mui/base";

import { Route } from "./config";
import { SubMenuPopper } from "./SubMenuPopper";

const useStyles = makeStyles(() => {
  return {
    popper: {
      zIndex: 1101,
    },
  };
});

export interface RoutesPopperProps {
  routes: Route[];
  anchor: any;
  open: boolean;
  onMenuClick: (route: Route) => void;
  onClickAway: () => void;
}

export function RoutesPopper({ open, routes, anchor, onMenuClick, onClickAway }: RoutesPopperProps) {
  const classes = useStyles();

  const [subMenuOpenKey, setSubMenuOpenKey] = useState<string | null>(null);
  const [subMenuTarget, setSubMenuTarget] = useState<any>(undefined);

  const handleSubMenuMouseEnter = (route: Route, target: any) => {
    if (route.subMenus && route.subMenus.length) {
      setSubMenuOpenKey(route.key);
      setSubMenuTarget(target);
    }
  };

  const handleSubMenuMouseLeave = () => {
    setSubMenuOpenKey(null);
  };

  const handleSubMenuClose = () => {
    setSubMenuOpenKey(null);
  };

  return (
    <Popper
      open={open}
      anchorEl={anchor}
      placement="bottom"
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
        <MenuList autoFocusItem={open} className="customize-menu-list style1">
          {routes.map((route, index) => (
            <MenuItem
              key={route.path ?? index}
              onClick={() => onMenuClick(route)}
              onMouseEnter={({ target }) => handleSubMenuMouseEnter(route, target)}
              onMouseLeave={handleSubMenuMouseLeave}
              disabled={!!route.disabled}
              className={route.disabled ? "opacity1" : ""}
            >
              <Typography className="customize-label">{route.name}</Typography>

              <SubMenuPopper
                route={route}
                onClickAway={handleSubMenuClose}
                onMenuClick={onMenuClick}
                anchor={subMenuTarget}
                subMenuKey={subMenuOpenKey}
              />
            </MenuItem>
          ))}
        </MenuList>
      </ClickAwayListener>
    </Popper>
  );
}
