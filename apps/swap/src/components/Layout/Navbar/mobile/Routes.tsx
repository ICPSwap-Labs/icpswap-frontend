import { useState } from "react";
import { Box, Typography, Collapse } from "components/Mui";
import { ReactComponent as ArrowDownIcon } from "assets/images/arrow-down.svg";
import { useLocation } from "react-router-dom";

import { Route, routeKey } from "../config";

export interface RoutesProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

export function Routes({ routes, onRouteClick }: RoutesProps) {
  const location = useLocation();
  const pathName = location.pathname;
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);

  const handleRouteClick = (route: Route) => {
    if (route.subMenus) {
      if (collapseKey === routeKey(route.key)) {
        setCollapseKey(undefined);
      } else {
        setCollapseKey(routeKey(route.key));
      }

      return;
    }

    onRouteClick(route);
  };

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
              padding: "24px 16px",
              borderBottom: "1px solid #29314F",
              "&:last-type-of": {
                borderBottom: "none",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontSize="16px" color="text.primary">
                {route.name}
              </Typography>

              {route.subMenus ? <ArrowDownIcon /> : null}
            </Box>

            <Collapse in={collapseKey === routeKey(route.key)}>
              {route.subMenus && route.subMenus.length ? (
                <Box sx={{ margin: "16px 0 0 0", display: "grid", gridTemplateColumns: "1fr", gap: "20px 0" }}>
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
