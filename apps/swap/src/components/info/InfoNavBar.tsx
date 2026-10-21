import { Flex, MenuItem, MenuWrapper } from "@icpswap/ui";
import { Link } from "components/index";
import { Box, makeStyles, type Theme, Typography } from "components/Mui";
import { useMediaQueryMD, useMediaQuerySM } from "hooks/theme";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type Route, routes } from "./nav.config";

const linearGradient =
  "linear-gradient(100deg, color-mix(in srgb, var(--color-secondary) 12%, transparent), color-mix(in srgb, var(--color-primary) 16%, transparent))";

const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      background: "color-mix(in srgb, var(--color-base-200) 86%, transparent)",
      borderBottom: "1px solid color-mix(in srgb, var(--color-base-content) 7%, transparent)",
      padding: "14px 20px",
      backdropFilter: "blur(16px)",
      [theme.breakpoints.down("sm")]: {
        padding: "10px 12px",
      },
    },
    navItem: {
      height: "40px",
      borderRadius: "10px",
      cursor: "pointer",
      padding: "0 16px",
      background: "transparent",
      position: "relative",
      whiteSpace: "nowrap",
      transition: "background 180ms ease, box-shadow 180ms ease",
      "& .MuiTypography-root": {
        transition: "color 180ms ease",
      },
      [theme.breakpoints.down("sm")]: {
        height: "36px",
        padding: "0 10px",
      },
      "&:hover": {
        background: linearGradient,
        "& .MuiTypography-root": {
          color: "var(--color-base-content)",
        },
      },
      "&.active": {
        background: linearGradient,
        boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 20%, transparent)",
        "& .MuiTypography-root": {
          color: "var(--color-primary)",
          fontWeight: 600,
        },
      },
    },
    more: {
      padding: "0 17px",
      background: "var(--color-base-300)",
      borderRadius: "10px",
      cursor: "pointer",
      "&:hover": {
        background: linearGradient,
      },
    },
    dot: {
      width: "5px",
      height: "5px",
      background: "var(--color-base-content)",
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
  const navigate = useNavigate();
  const ref = useRef(null);
  const pathName = location.pathname;

  const matchDownMD = useMediaQueryMD();
  const matchDownSM = useMediaQuerySM();

  const RoutesNumber = matchDownMD ? (matchDownSM ? 3 : 4) : 7;

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
    navigate(val.path);
  };

  const handleMenuClick = (route: Route) => {
    if (!route.path) return;
    handleClose();
    navigate(route.path);
  };

  function isActive(route: Route) {
    return (!!route.path && route.key === pathName.split("/")[1]) || (pathName === "/" && route.path === "/");
  }

  function hidden() {
    return pathName.includes("/token/details") && !pathName.includes("/swap/token/details");
  }

  return (
    <Box className={`ics-info-nav ${classes.container}`} sx={{ display: hidden() ? "none" : "block" }}>
      <Flex fullWidth gap="0 4px" sx={{ maxWidth: "1280px", margin: "0 auto" }}>
        {routes.map((route, index) =>
          index >= RoutesNumber ? null : (
            <Flex
              key={route.path}
              onClick={() => handlerOpenTo(route)}
              className={`${classes.navItem} ${isActive(route) ? "active" : ""}`}
            >
              <Typography
                sx={(theme) => ({
                  fontSize: "13px",
                  fontWeight: 500,
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "12px",
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
                index >= RoutesNumber ? (
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
