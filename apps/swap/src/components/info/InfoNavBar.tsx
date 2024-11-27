import { useRef, useState } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import { MenuList, MenuItem, Popper, Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";
import { t } from "@lingui/macro";
import { ClickAwayListener } from "@mui/base";
import { Theme } from "@mui/material/styles";

const linearGradient = "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)";

const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      background: theme.palette.background.level2,
      borderBottom: `1px solid ${theme.palette.background.level4}`,
      padding: "20px",
      [theme.breakpoints.down("sm")]: {
        padding: "10px",
      },
    },
    navItem: {
      height: "40px",
      borderRadius: "12px",
      cursor: "pointer",
      padding: "0 16px",
      background: theme.palette.background.level4,
      [theme.breakpoints.down("sm")]: {
        height: "36px",
        padding: "0 10px",
      },
      "&:hover": {
        background: linearGradient,
        "& .MuiTypography-root": {
          color: "#FFFFFF",
        },
      },
      "&.active": {
        background: linearGradient,
      },
    },
    more: {
      padding: "0 17px",
      background: theme.palette.background.level4,
      borderRadius: "12px",
      cursor: "pointer",
      "&:hover": {
        background: linearGradient,
      },
    },
    dot: {
      width: "5px",
      height: "5px",
      background: "#fff",
      borderRadius: "50%",
      marginRight: "6px",
      "&:last-child": {
        marginRight: "0px",
      },
    },
  };
});

type Route = {
  key: string;
  name: string;
  path: string;
};

export function InfoNavBar() {
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme() as Theme;
  const history = useHistory();
  const ref = useRef(null);
  const pathName = location.pathname;

  const matchUpLG = useMediaQuery(theme.breakpoints.up("lg"));
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const RoutesNumber = matchDownMD ? (matchDownSM ? 3 : 4) : matchUpLG ? 6 : 5;

  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlerOpenTo = (val: Route) => {
    history.push(val.path);
  };

  const handleMenuClick = (route: Route) => {
    if (!route.path) return;
    handleClose();
    history.push(route.path);
  };

  const routes: Route[] = [
    {
      key: "info-overview",
      name: t`Overview`,
      path: "/info-overview",
    },
    {
      name: t`Swap`,
      path: "/info-swap",
      key: "info-swap",
    },
    {
      key: "info-tokens",
      name: t`Tokens`,
      path: "/info-tokens",
    },
    {
      key: "info-stake",
      name: t`Stake`,
      path: "/info-stake",
    },
    {
      key: "info-farm",
      name: t`Farm`,
      path: "/info-farm",
    },
    {
      key: "/info/tools",
      name: t`Tools`,
      path: `/info/tools`,
    },
    {
      key: "info-marketplace",
      name: t`Marketplace`,
      path: `/info-marketplace`,
    },
    {
      key: "info-claim",
      name: t`Token Claim`,
      path: "/info-claim",
    },
    {
      key: "info-nfts",
      name: t`NFTs`,
      path: `/info-nfts`,
    },
    {
      key: "info-wrap",
      name: t`WICP`,
      path: "/info-wrap",
    },
  ];

  function isActive(route: Route) {
    return (!!route.path && route.key === pathName.split("/")[1]) || (pathName === "/" && route.path === "/");
  }

  function hidden() {
    return (
      pathName.includes("/token/details") &&
      !pathName.includes("/swap/token/details") &&
      !pathName.includes("/swap/v2/token/details")
    );
  }

  return (
    <Box className={classes.container} sx={{ display: hidden() ? "none" : "block" }}>
      <Grid container>
        <Grid item xs={12} container>
          {routes.map((route, index) =>
            index >= RoutesNumber ? null : (
              <Grid
                item
                key={route.path}
                onClick={() => handlerOpenTo(route)}
                className={`${classes.navItem} ${isActive(route) ? "active" : ""}`}
                sx={{
                  marginRight: "12px",
                }}
              >
                <Grid container alignItems="center" sx={{ height: "100%" }}>
                  <Typography
                    sx={(theme) => ({
                      fontSize: "16px",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "14px",
                      },
                    })}
                    color={isActive(route) ? "text.primary" : "text.secondary"}
                  >
                    {route.name}
                  </Typography>
                </Grid>
              </Grid>
            ),
          )}
          {RoutesNumber < routes.length ? (
            <Grid
              ref={ref}
              item
              key="more"
              className={classes.more}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Grid container alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Box component="span" className={classes.dot} />
                <Box component="span" className={classes.dot} />
                <Box component="span" className={classes.dot} />
              </Grid>

              <Popper
                style={{
                  zIndex: 1000,
                }}
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
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} className="customize-menu-list">
                    {routes.map((route, index) =>
                      index > RoutesNumber || index === RoutesNumber ? (
                        <MenuItem key={route.path} onClick={() => handleMenuClick(route)}>
                          {route.name}
                        </MenuItem>
                      ) : null,
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Popper>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
}
