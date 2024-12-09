import { useLocation } from "react-router-dom";
import { Link } from "components/index";
import { MenuWrapper, MenuItem } from "@icpswap/ui";

import { Route, routeKey } from "./config";

export interface SubMenuPopperProps {
  route: Route;
  subMenuKey: string | null;
  onClickAway: () => void;
  anchor: any;
  onMenuClick: (route: Route) => void;
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
}

export function SubMenuPopper({
  route,
  subMenuKey,
  onClickAway,
  anchor,
  onMenuClick,
  placement,
  menuWidth,
}: SubMenuPopperProps) {
  const location = useLocation();
  const pathName = location.pathname;

  const isActive = (route: Route) => {
    return pathName === route?.path;
  };

  return route.subMenus && route.subMenus.length ? (
    <MenuWrapper
      open={subMenuKey === routeKey(route.key)}
      anchor={anchor}
      placement={placement ?? "right-start"}
      onClickAway={onClickAway}
      menuWidth={menuWidth}
    >
      {(route.subMenus ?? []).map((subRoute) => {
        const Icon = subRoute.icon;

        return (
          <Link key={routeKey(subRoute.key)} to={subRoute.path} link={subRoute.link}>
            <MenuItem
              label={subRoute.name}
              active={isActive(subRoute)}
              icon={Icon ? <Icon /> : null}
              value={subRoute}
              onMenuClick={onMenuClick}
            />
          </Link>
        );
      })}
    </MenuWrapper>
  ) : null;
}
