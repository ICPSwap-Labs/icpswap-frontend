import { useDesignVersion } from "hooks/useDesignVersion";
import { Flex, MenuItem, MenuWrapper } from "@icpswap/ui";
import { Link } from "components/index";
import { Box, makeStyles, type Theme, Typography } from "components/Mui";
import { useMediaQueryMD, useMediaQuerySM } from "hooks/theme";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type Route, routes } from "./nav.config";

const useStyles = makeStyles((theme: Theme) => {
  return theme.customization?.designVersion !== "modern"
    ? {
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
            background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
            "& .MuiTypography-root": {
              color: "#FFFFFF",
            },
          },
          "&.active": {
            background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
          },
        },
        more: {
          padding: "0 17px",
          background: theme.palette.background.level4,
          borderRadius: "12px",
          cursor: "pointer",
          "&:hover": {
            background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
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
      }
    : {
        container: {
          background: "transparent",
          borderBottom: "1px solid var(--color-base-300)",
          padding: "0 24px",
          [theme.breakpoints.down("sm")]: {
            padding: "0 12px",
          },
        },
        navItem: {
          height: "56px",
          borderRadius: "0",
          cursor: "pointer",
          padding: "0 16px",
          background: "transparent",
          position: "relative",
          borderBottom: "2px solid transparent",
          marginBottom: "-1px",
          whiteSpace: "nowrap",
          transition: "background 180ms ease, border-color 180ms ease",
          "& .MuiTypography-root": {
            transition: "color 180ms ease",
          },
          [theme.breakpoints.down("sm")]: {
            height: "48px",
            padding: "0 10px",
          },
          "&:hover": {
            background: "var(--color-base-100)",
            "& .MuiTypography-root": {
              color: "var(--color-base-content)",
            },
          },
          "&.active": {
            background: "transparent",
            borderBottomColor: "var(--color-primary)",
            "& .MuiTypography-root": {
              color: "var(--color-primary)",
              fontWeight: 600,
            },
          },
        },
        more: {
          padding: "0 17px",
          background: "transparent",
          borderRadius: "0",
          cursor: "pointer",
          "&:hover": {
            background: "var(--color-base-100)",
          },
        },
        dot: {
          width: "3px",
          height: "3px",
          background: "var(--color-base-content)",
          borderRadius: "0",
          marginRight: "6px",
          "&:last-child": {
            marginRight: "0px",
          },
        },
      };
});

export function InfoNavBar() {
  const { isClassicDesign } = useDesignVersion();

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

  if (isClassicDesign) {
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
