import { makeStyles } from "@mui/styles";
import { MenuList, MenuItem, Popper, Grid, Typography } from "@mui/material";
import { ClickAwayListener } from "@mui/base";
import { useLocation } from "react-router-dom";
import { Link } from "components/index";

import { Route } from "./config";

const useStyles = makeStyles(() => {
  return {
    popper: {
      zIndex: 1101,
    },
  };
});

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
  const classes = useStyles();
  const location = useLocation();
  const pathName = location.pathname;

  const isActive = (route: Route) => {
    return pathName === route?.path;
  };

  return route.subMenus && route.subMenus.length ? (
    <Popper
      open={subMenuKey === route.key}
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
        <MenuList
          className="customize-menu-list style1"
          sx={{
            width: `${menuWidth ?? "146px"}!important`,
          }}
        >
          {(route.subMenus ?? []).map((subRoute) => {
            const Icon = subRoute.icon;

            return (
              <Link key={subRoute.key} to={subRoute.path} link={subRoute.link}>
                <MenuItem
                  disabled={!!subRoute.disabled}
                  onClick={() => onMenuClick(subRoute)}
                  className={subRoute.disabled ? "opacity1" : ""}
                  sx={{
                    "&:hover": {
                      "& svg": {
                        color: "text.primary",
                      },
                    },
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    sx={{ color: isActive(subRoute) ? "text.primary" : "text.secondary" }}
                  >
                    {Icon ? <Icon /> : null}
                    <Grid item xs sx={{ marginLeft: "10px" }}>
                      <Typography className={`customize-label ${isActive(subRoute) ? "active" : ""}`}>
                        {subRoute.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </MenuItem>
              </Link>
            );
          })}
        </MenuList>
      </ClickAwayListener>
    </Popper>
  ) : null;
}
