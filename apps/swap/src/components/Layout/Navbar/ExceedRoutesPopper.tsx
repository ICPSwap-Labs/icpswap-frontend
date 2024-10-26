import { useState } from "react";
import { Link } from "components/index";
import { MenuWrapper, MenuItem } from "@icpswap/ui";

import { Route } from "./config";
import { SubMenuPopper } from "./SubMenuPopper";

export interface ExceedRoutesPopperProps {
  routes: Route[];
  anchor: any;
  open: boolean;
  onMenuClick: (route: Route) => void;
  onClickAway: () => void;
}

export function ExceedRoutesPopper({ open, routes, anchor, onMenuClick, onClickAway }: ExceedRoutesPopperProps) {
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

  const handleMenuClick = (route: Route) => {
    if (!route.subMenus) {
      handleSubMenuClose();
      onMenuClick(route);
    }
  };

  return (
    <MenuWrapper open={open} anchor={anchor} placement="bottom-start" onClickAway={onClickAway}>
      {routes.map((route, index) => (
        <Link key={route.path ?? index} to={route.path} link={route.link}>
          <MenuItem
            value={route}
            label={route.name}
            onMenuClick={() => handleMenuClick(route)}
            onMouseEnter={({ target }) => handleSubMenuMouseEnter(route, target)}
            onMouseLeave={handleSubMenuMouseLeave}
            disabled={route.disabled === true}
          >
            <SubMenuPopper
              route={route}
              onClickAway={handleSubMenuClose}
              onMenuClick={handleMenuClick}
              anchor={subMenuTarget}
              subMenuKey={subMenuOpenKey}
            />
          </MenuItem>
        </Link>
      ))}
    </MenuWrapper>
  );
}
