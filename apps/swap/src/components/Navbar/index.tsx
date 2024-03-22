import { useRef } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import { MenuList, MenuItem, Popper, Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { ClickAwayListener } from "@mui/base";
import { Theme } from "@mui/material/styles";
import { mockALinkAndOpen } from "utils/index";
import { routes, Route, MAX_NUMBER } from "./config";

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

export default function NavBar() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const ref = useRef(null);
  const pathName = location.pathname;
  const theme = useTheme() as Theme;

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [subMenuOpenKey, setSubMenuOpenKey] = useState<string | null>(null);
  const [subMenuTarget, setSubMenuTarget] = useState<any>(undefined);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const loadPage = (route: Route) => {
    if (!route.path && !route.link) return;

    handleClose();
    if (route.link) {
      mockALinkAndOpen(route.link ?? "", "nav-bar-menu");
    } else {
      history.push(route.path ?? "");
    }
  };

  function isActive(route: Route) {
    return !!route.path && route.key === pathName.split("/")[1];
  }

  return (
    <Grid container>
      {routes.map((route, index) =>
        index >= MAX_NUMBER ? null : (
          <Grid
            item
            key={route.path ?? index}
            onClick={() => loadPage(route)}
            className={`${classes.navItem} ${isActive(route) ? "active" : ""}`}
            sx={{
              marginRight: "12px",
            }}
          >
            <Grid container alignItems="center" sx={{ height: "100%" }}>
              <Typography
                fontSize={matchDownMD ? "14px" : "16px"}
                color={isActive(route) ? "text.primary" : "text.secondary"}
              >
                {route.name}
              </Typography>
            </Grid>
          </Grid>
        ),
      )}
      {routes.length > MAX_NUMBER ? (
        <Grid
          ref={ref}
          item
          key="more"
          className={classes.more}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Grid container alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
            <Box component="span" className={`${classes.dot} dot`} />
            <Box component="span" className={`${classes.dot} dot`} />
            <Box component="span" className={`${classes.dot} dot`} />
          </Grid>

          {/* @ts-ignore */}
          <Popper
            open={open}
            anchorEl={ref?.current}
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
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open} className="customize-menu-list style1">
                {routes.map((route, index) =>
                  index > MAX_NUMBER || index === MAX_NUMBER ? (
                    <MenuItem
                      key={route.path ?? index}
                      onClick={() => loadPage(route)}
                      onMouseEnter={({ target }) => handleSubMenuMouseEnter(route, target)}
                      onMouseLeave={handleSubMenuMouseLeave}
                      disabled={!!route.disabled}
                      className={route.disabled ? "opacity1" : ""}
                    >
                      <Typography className="customize-label">{route.name}</Typography>

                      {route.subMenus && route.subMenus.length ? (
                        /* @ts-ignore */
                        <Popper
                          open={subMenuOpenKey === route.key}
                          anchorEl={subMenuTarget}
                          placement="right-start"
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
                          <ClickAwayListener onClickAway={handleSubMenuClose}>
                            <MenuList className="customize-menu-list style1">
                              {(route.subMenus ?? []).map((subRoute) => {
                                const Icon = subRoute.icon;

                                return (
                                  <MenuItem
                                    key={subRoute.key}
                                    disabled={!!subRoute.disabled}
                                    onClick={() => loadPage(subRoute)}
                                    className={subRoute.disabled ? "opacity1" : ""}
                                  >
                                    <Grid container alignItems="center">
                                      {/* @ts-ignore */}
                                      {Icon ? <Icon /> : null}
                                      <Grid item xs sx={{ marginLeft: "10px" }}>
                                        <Typography className="customize-label">{subRoute.name}</Typography>
                                      </Grid>
                                    </Grid>
                                  </MenuItem>
                                );
                              })}
                            </MenuList>
                          </ClickAwayListener>
                        </Popper>
                      ) : null}
                    </MenuItem>
                  ) : null,
                )}
              </MenuList>
            </ClickAwayListener>
          </Popper>
        </Grid>
      ) : null}
    </Grid>
  );
}
