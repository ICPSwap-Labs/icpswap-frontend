import { useState } from "react";
import { useTheme } from "@mui/styles";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import { ChevronDown } from "react-feather";
import { Link } from "components/index";

import { Route, MAX_NUMBER } from "./config";
import { SubMenuPopper } from "./SubMenuPopper";

export interface RoutesProps {
  routes: Route[];
  onMenuClick?: (route: Route) => void;
}

export function Routes({ routes, onMenuClick }: RoutesProps) {
  const location = useLocation();
  const pathName = location.pathname;
  const theme = useTheme() as Theme;

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [subMenuOpenKey, setSubMenuOpenKey] = useState<string | null>(null);
  const [subMenuTarget, setSubMenuTarget] = useState<any>(undefined);

  const handleMenuMouseEnter = (route: Route, target: any) => {
    if (route.subMenus && route.subMenus.length) {
      setSubMenuOpenKey(route.key);
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
    return !!route.path && route.key === pathName.split("/")[1];
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
          <Link key={route.path ?? index} to={route.path ?? ""}>
            <Box
              key={route.path ?? index}
              onClick={() => handleRouteClick(route)}
              className={`${isActive(route) ? "active" : ""}`}
              sx={{
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
                  sx={{ display: "flex", alignItems: "center", gap: "0 5px" }}
                  fontSize={matchDownMD ? "14px" : "16px"}
                  color={isActive(route) ? "text.primary" : "text.secondary"}
                >
                  {route.name}
                  {route.subMenus ? <ChevronDown size="18px" /> : null}
                </Typography>

                <SubMenuPopper
                  route={route}
                  onClickAway={handleSubMenuClose}
                  onMenuClick={handleRouteClick}
                  anchor={subMenuTarget}
                  subMenuKey={subMenuOpenKey}
                  placement="bottom-start"
                  menuWidth="180px"
                />
              </Grid>
            </Box>
          </Link>
        ),
      )}
    </>
  );
}
