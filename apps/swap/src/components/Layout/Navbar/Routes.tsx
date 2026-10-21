import { Link } from "components/index";
import { Box, Grid, Typography, useTheme } from "components/Mui";
import { useMediaQueryMD } from "hooks/theme";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import { useLocation } from "react-router-dom";

import { MAX_NUMBER, type Route, routeKey } from "./config";
import { SubMenuPopper } from "./SubMenuPopper";

export interface RoutesProps {
  routes: Route[];
  onMenuClick?: (route: Route) => void;
}

export function Routes({ routes, onMenuClick }: RoutesProps) {
  const location = useLocation();
  const pathName = location.pathname;
  const theme = useTheme();

  const matchDownMD = useMediaQueryMD();

  const [subMenuOpenKey, setSubMenuOpenKey] = useState<string | null>(null);
  const [subMenuTarget, setSubMenuTarget] = useState<any>(undefined);

  const handleMenuMouseEnter = (route: Route, target: any) => {
    if (route.subMenus?.length) {
      setSubMenuOpenKey(routeKey(route.key));
      setSubMenuTarget(target);
    }
  };

  const handleMenuMouseLeave = () => {
    setSubMenuOpenKey(null);
  };

  const handleSubMenuClose = () => {
    setSubMenuOpenKey(null);
  };

  function isActive(route: Route) {
    const mainRoute = pathName.split("/")[1];

    if (typeof route.key === "string") {
      return !!route.path && (route.key === mainRoute || (route.key === "info" ? mainRoute.includes("info") : false));
    }

    return route.key.includes(mainRoute);
  }

  const handleRouteClick = (route: Route) => {
    if (!route.subMenus) {
      handleSubMenuClose();
      if (onMenuClick) onMenuClick(route);
    }
  };

  return (
    <>
      {routes.map((route, index) =>
        index >= MAX_NUMBER ? null : (
          <Link key={route.path ?? index} to={route.path ?? ""} link={route.link}>
            <Box
              key={route.path ?? index}
              onClick={() => handleRouteClick(route)}
              className={`relative rounded-xl transition-all duration-200 ${isActive(route) ? "active" : ""}`}
              sx={{
                height: "40px",
                cursor: "pointer",
                padding: "0 13px",
                border: "1px solid transparent",
                "&:hover": {
                  background: "color-mix(in oklab, var(--color-base-content) 5%, transparent)",
                  "& .MuiTypography-root": {
                    color: "var(--color-base-content)",
                  },
                },
                "&.active": {
                  background: "color-mix(in oklab, var(--color-primary) 12%, transparent)",
                  borderColor: "color-mix(in oklab, var(--color-primary) 18%, transparent)",
                  "& .MuiTypography-root": {
                    color: "var(--color-primary)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-19px",
                    left: "25%",
                    width: "50%",
                    height: "2px",
                    background: "var(--color-primary)",
                    boxShadow: "0 -2px 12px color-mix(in oklab, var(--color-primary) 50%, transparent)",
                  },
                },
                [theme.breakpoints.down("md")]: {
                  height: "36px",
                  padding: "0 12px",
                },
              }}
            >
              <Grid
                container
                alignItems="center"
                sx={{ height: "100%" }}
                onMouseEnter={({ target }) => handleMenuMouseEnter(route, target)}
                onMouseLeave={handleMenuMouseLeave}
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "0 6px", fontWeight: 500, whiteSpace: "nowrap" }}
                  fontSize={matchDownMD ? "13px" : "14px"}
                  color={isActive(route) ? "text.primary" : "text.secondary"}
                >
                  {route.name}
                  {route.subMenus ? <ChevronDown size="14px" strokeWidth={1.7} /> : null}
                </Typography>

                <SubMenuPopper
                  route={route}
                  onClickAway={handleSubMenuClose}
                  onMenuClick={handleRouteClick}
                  anchor={subMenuTarget}
                  subMenuKey={subMenuOpenKey}
                  placement="bottom-start"
                />
              </Grid>
            </Box>
          </Link>
        ),
      )}
    </>
  );
}
