import { Link } from "components/index";
import { Box, Grid, Typography } from "components/Mui";
import { useDesignVersion } from "hooks/useDesignVersion";
import { useState } from "react";
import { ArrowUpRight, BarChart2, ChevronDown, ChevronRight, Layers, Repeat, TrendingUp } from "react-feather";
import { useLocation } from "react-router-dom";

import { MAX_NUMBER, type Route, routeKey } from "./config";
import { SubMenuPopper } from "./SubMenuPopper";

const routeIcons = [Repeat, Layers, TrendingUp, ArrowUpRight, BarChart2];

export interface RoutesProps {
  routes: Route[];
  onMenuClick?: (route: Route) => void;
}

export function Routes({ routes, onMenuClick }: RoutesProps) {
  const { isClassicDesign } = useDesignVersion();
  const location = useLocation();
  const pathName = location.pathname;
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
      return (
        !!route.path &&
        (route.key === mainRoute ||
          (!isClassicDesign && route.key === "swap" && mainRoute === "") ||
          (route.key === "info" ? mainRoute.includes("info") : false))
      );
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
      {routes.map((route, index) => {
        const Icon = routeIcons[index];
        return index >= MAX_NUMBER ? null : (
          <Link
            key={route.path ?? index}
            to={route.path ?? ""}
            link={route.link}
            width={isClassicDesign ? undefined : "100%"}
            display={isClassicDesign ? undefined : "block"}
          >
            <Box
              key={route.path ?? index}
              onClick={() => handleRouteClick(route)}
              className={`relative transition-colors duration-150 ${isActive(route) ? "active" : ""}`}
              sx={{
                width: "100%",
                height: "46px",
                cursor: "pointer",
                padding: "0 12px",
                borderRadius: "5px",
                border: "1px solid transparent",
                "&:hover": {
                  background: "color-mix(in oklab, var(--color-base-content) 4%, transparent)",
                  "& .MuiTypography-root": {
                    color: "var(--color-base-content)",
                  },
                },
                "&.active": {
                  background: "color-mix(in oklab, var(--color-primary) 10%, transparent)",
                  borderColor: "color-mix(in oklab, var(--color-primary) 12%, transparent)",
                  "& .MuiTypography-root": {
                    color: "var(--color-primary)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "13px",
                    left: "-1px",
                    width: "2px",
                    height: "18px",
                    background: "var(--color-primary)",
                  },
                },
                ...(isClassicDesign
                  ? {
                      width: "auto",
                      height: "40px",
                      padding: "0 16px",
                      border: "none",
                      borderRadius: 0,
                      "&:hover": {
                        background: "transparent",
                        "& .MuiTypography-root": { color: "var(--color-base-content)" },
                      },
                      "&.active": {
                        background: "transparent",
                        "& .MuiTypography-root": { color: "var(--color-base-content)" },
                        "&::after": { display: "none" },
                      },
                      "@media(max-width: 1200px)": { padding: "0 10px" },
                    }
                  : {}),
              }}
            >
              <Grid
                className="ics-terminal-nav-item"
                container
                alignItems="center"
                sx={{ height: "100%", gap: isClassicDesign ? "0px" : "12px", flexWrap: "nowrap" }}
                onMouseEnter={({ currentTarget }) => handleMenuMouseEnter(route, currentTarget)}
                onMouseLeave={handleMenuMouseLeave}
              >
                {!isClassicDesign ? (
                  <Icon
                    className="shrink-0"
                    aria-hidden="true"
                    size={17}
                    strokeWidth={1.5}
                    color={
                      isActive(route)
                        ? "var(--color-primary)"
                        : "color-mix(in oklab, var(--color-base-content) 45%, transparent)"
                    }
                  />
                ) : null}
                <Typography
                  className="ics-terminal-nav-label"
                  sx={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "6px",
                    fontWeight: isClassicDesign ? 400 : 500,
                    whiteSpace: "nowrap",
                    ...(isClassicDesign ? { "@media(max-width: 1200px)": { fontSize: "14px" } } : {}),
                  }}
                  fontSize={isClassicDesign ? "16px" : "13px"}
                  color={isActive(route) ? "text.primary" : "text.secondary"}
                >
                  {route.name}
                  {route.subMenus ? (
                    isClassicDesign ? (
                      <ChevronDown size="18px" />
                    ) : (
                      <ChevronRight size="13px" strokeWidth={1.5} />
                    )
                  ) : null}
                </Typography>

                <SubMenuPopper
                  route={route}
                  onClickAway={handleSubMenuClose}
                  onMenuClick={handleRouteClick}
                  anchor={subMenuTarget}
                  subMenuKey={subMenuOpenKey}
                  placement={isClassicDesign ? "bottom-start" : "right-start"}
                />
              </Grid>
            </Box>
          </Link>
        );
      })}
    </>
  );
}
