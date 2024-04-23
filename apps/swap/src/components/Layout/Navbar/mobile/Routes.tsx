import { useState } from "react";
import { Box, Typography, Collapse } from "components/Mui";
import { ReactComponent as ArrowDownIcon } from "assets/images/arrow-down.svg";
import { Route } from "../config";

export interface RoutesProps {
  routes: Route[];
  onRouteClick: (route: Route) => void;
}

export function Routes({ routes, onRouteClick }: RoutesProps) {
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);

  const handleRouteClick = (route: Route) => {
    if (route.subMenus) {
      if (collapseKey === route.key) {
        setCollapseKey(undefined);
      } else {
        setCollapseKey(route.key);
      }

      return;
    }

    onRouteClick(route);
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

            <Collapse in={collapseKey === route.key}>
              {route.subMenus && route.subMenus.length ? (
                <Box sx={{ margin: "16px 0 0 0", display: "grid", gridTemplateColumns: "1fr", gap: "20px 0" }}>
                  {(route.subMenus ?? []).map((subRoute) => {
                    const Icon = subRoute.icon;

                    return (
                      <Box key={subRoute.key} onClick={() => handleRouteClick(subRoute)}>
                        <Box sx={{ display: "flex", gap: "0 16px", alignItems: "center" }}>
                          {Icon ? <Icon /> : null}
                          <Typography className="customize-label">{subRoute.name}</Typography>
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
