import { Box, Collapse, Typography } from "components/Mui";
import { useCallback, useState } from "react";
import { useDesignVersion } from "hooks/useDesignVersion";
import { ChevronDown } from "react-feather";
import { useLocation } from "react-router-dom";

import { type Route, routeKey } from "../config";

export interface RoutesProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

export function Routes({ routes, onRouteClick }: RoutesProps) {
  const { isClassicDesign } = useDesignVersion();
  const location = useLocation();
  const pathName = location.pathname;
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);

  const handleRouteClick = useCallback(
    (route: Route) => {
      if (route.subMenus) {
        if (collapseKey === routeKey(route.key)) {
          setCollapseKey(undefined);
        } else {
          setCollapseKey(routeKey(route.key));
        }

        return;
      }

      onRouteClick(route);
    },
    [onRouteClick, collapseKey],
  );

  const isActive = (route: Route) => {
    return pathName === route?.path;
  };

  return (
    <>
      {routes.map((route, index) => {
        return (
          <Box
            key={route.path ?? index}
            onClick={() => handleRouteClick(route)}
            sx={{
              padding: "18px 16px",
              marginBottom: "4px",
              borderRadius: "5px",
              cursor: "pointer",
              background: isActive(route)
                ? "color-mix(in oklab, var(--color-primary) 10%, transparent)"
                : "transparent",
              border: "1px solid",
              borderColor: isActive(route)
                ? "color-mix(in oklab, var(--color-primary) 16%, transparent)"
                : "transparent",
              transition: "background 180ms ease, border-color 180ms ease",
              "&:hover": {
                background: "color-mix(in oklab, var(--color-primary) 7%, transparent)",
              },
              ...(isClassicDesign
                ? {
                    padding: "24px 16px",
                    marginBottom: 0,
                    borderRadius: 0,
                    border: "none",
                    borderBottom: "1px solid var(--color-base-300)",
                    background: "transparent",
                    "&:hover": { background: "transparent" },
                  }
                : {}),
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontSize={isClassicDesign ? "16px" : "14px"}
                color="text.primary"
                sx={{ fontWeight: isClassicDesign ? 400 : 500 }}
              >
                {route.name}
              </Typography>

              {route.subMenus ? (
                <ChevronDown
                  color={isClassicDesign ? "var(--color-neutral-content)" : "var(--color-primary)"}
                  size={isClassicDesign ? 24 : 18}
                  strokeWidth={isClassicDesign ? 1 : 1.5}
                />
              ) : null}
            </Box>

            <Collapse in={collapseKey === routeKey(route.key)}>
              {route.subMenus?.length ? (
                <Box
                  sx={{
                    margin: "20px 0 0 2px",
                    paddingLeft: "16px",
                    borderLeft: "1px solid color-mix(in oklab, var(--color-primary) 24%, transparent)",
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "20px 0",
                    ...(isClassicDesign ? { margin: "16px 0 0 0", paddingLeft: 0, borderLeft: "none" } : {}),
                  }}
                >
                  {(route.subMenus ?? []).map((subRoute) => {
                    const Icon = subRoute.icon;

                    return (
                      <Box
                        key={routeKey(subRoute.key)}
                        onClick={() => handleRouteClick(subRoute)}
                        sx={{
                          color: isActive(subRoute) ? "text.primary" : "text.secondary",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: "0 16px", alignItems: "center" }}>
                          {Icon ? <Icon /> : null}
                          <Typography sx={{ color: isActive(subRoute) ? "text.primary" : "text.secondary" }}>
                            {subRoute.name}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : null}
            </Collapse>
          </Box>
        );
      })}
    </>
  );
}
