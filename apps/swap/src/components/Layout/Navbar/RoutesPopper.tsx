import { useState } from "react";
import { MenuWrapper, MenuItem } from "@icpswap/ui";

import { Route } from "./config";
import { SubMenuPopper } from "./SubMenuPopper";

export interface RoutesPopperProps {
  routes: Route[];
  anchor: any;
  open: boolean;
  onMenuClick: (route: Route) => void;
  onClickAway: () => void;
}

export function RoutesPopper({ open, routes, anchor, onMenuClick, onClickAway }: RoutesPopperProps) {
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
    <MenuWrapper open={open} anchor={anchor} placement="bottom-start" onClickAway={onClickAway}>
      {routes.map((route, index) => (
        <MenuItem
          key={route.path ?? index}
          value={route}
          onMenuClick={() => onMenuClick(route)}
          onMouseEnter={({ target }) => handleSubMenuMouseEnter(route, target)}
          onMouseLeave={handleSubMenuMouseLeave}
          disabled={!!route.disabled}
          label={route.name}
        >
          <SubMenuPopper
            route={route}
            onClickAway={handleSubMenuClose}
            onMenuClick={onMenuClick}
            anchor={subMenuTarget}
            subMenuKey={subMenuOpenKey}
          />
        </MenuItem>
      ))}
    </MenuWrapper>
  );
}
