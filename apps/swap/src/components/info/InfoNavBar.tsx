import { useRef, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { MenuWrapper, MenuItem, Flex } from "@icpswap/ui";
import { Link } from "components/index";
import { makeStyles, useTheme, Box, Typography, useMediaQuery, Theme } from "components/Mui";
import { routes, Route } from "./nav.config";

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

  function isActive(route: Route) {
    return (!!route.path && route.key === pathName.split("/")[1]) || (pathName === "/" && route.path === "/");
  }

  function hidden() {
    return pathName.includes("/token/details") && !pathName.includes("/swap/token/details");
  }

  return (
    <Box className={classes.container} sx={{ display: hidden() ? "none" : "block" }}>
      <Flex fullWidth gap="0 12px">
        {routes.map((route, index) =>
          index >= RoutesNumber ? null : (
            <Flex
              key={route.path}
              onClick={() => handlerOpenTo(route)}
              className={`${classes.navItem} ${isActive(route) ? "active" : ""}`}
            >
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
            </Flex>
          ),
        )}

        {RoutesNumber < routes.length ? (
          <Box
            ref={ref}
            key="more"
            className={`${classes.more} ${classes.navItem}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Flex fullWidth justify="center" sx={{ height: "100%" }}>
              <Box component="span" className={classes.dot} />
              <Box component="span" className={classes.dot} />
              <Box component="span" className={classes.dot} />
            </Flex>

            <MenuWrapper open={open} anchor={ref?.current} placement="bottom-start" onClickAway={handleClose}>
              {routes.map((route, index) =>
                index > RoutesNumber || index === RoutesNumber ? (
                  <Link key={route.path ?? index} to={route.path} link={route.link}>
                    <MenuItem value={route} label={route.name} onMenuClick={() => handleMenuClick(route)} />
                  </Link>
                ) : null,
              )}
            </MenuWrapper>
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
}
