import { Box, Collapse, Typography } from "components/Mui";
import { useCallback, useState } from "react";
import { ChevronDown } from "react-feather";
import { useLocation } from "react-router-dom";

import { type Route, routeKey } from "../config";

export interface RoutesProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

export function Routes({ routes, onRouteClick }: RoutesProps) {
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
              borderRadius: "12px",
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
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontSize="15px" color="text.primary" sx={{ fontWeight: 500 }}>
                {route.name}
              </Typography>

              {route.subMenus ? <ChevronDown color="var(--color-primary)" size={18} strokeWidth={1.5} /> : null}
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
