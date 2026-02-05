import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockALinkAndOpen } from "@icpswap/utils";
import { XCircle } from "react-feather";
import { ReactComponent as Logo } from "assets/images/logo1.svg";
import { Box, Collapse } from "components/Mui";
import { ReactComponent as ArrowDownIcon } from "assets/images/arrow-down.svg";

import { Routes } from "./Routes";
import { routes, Route, MOBILE_MAX_NUMBER, routeKey } from "../config";

export interface MobileNavbarProps {
  onClose?: () => void;
}

export default function MobileNavbar({ onClose }: MobileNavbarProps) {
  const navigate = useNavigate();
  const [collapseKey, setCollapseKey] = useState<string | undefined>(undefined);
  const [exceedOpen, setExceedOpen] = useState<boolean>(false);

  const handleRouteClick = (route: Route) => {
    if (route.subMenus) {
      if (collapseKey === routeKey(route.key)) {
        setCollapseKey(undefined);
      } else {
        setCollapseKey(routeKey(route.key));
      }

      return;
    }

    if (!route.path && !route.link) return;

    if (route.link) {
      mockALinkAndOpen(route.link ?? "", "nav-bar-menu");
    } else {
      navigate(route.path ?? "");
    }

    if (onClose) onClose();
  };

  const noExceedRoutes = useMemo(() => {
    return routes.filter((route, index) => index < MOBILE_MAX_NUMBER);
  }, [routes, MOBILE_MAX_NUMBER]);

  const exceedRoutes = useMemo(() => {
    return routes.filter((route, index) => index >= MOBILE_MAX_NUMBER);
  }, [routes, MOBILE_MAX_NUMBER]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
        <Logo />
        <XCircle style={{ cursor: "pointer" }} onClick={onClose} />
      </Box>

      {/* <Box sx={{ padding: "0 20px", margin: "32px 0 0 0" }}>
        <Box sx={{ width: "100%", height: "1px", background: "#29314F" }} />
      </Box> */}

      <Box>
        <Routes routes={noExceedRoutes} onRouteClick={handleRouteClick} />

        {exceedRoutes.length > 0 ? (
          <>
            <Box
              sx={{
                padding: "24px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => setExceedOpen(!exceedOpen)}
            >
              <Box sx={{ display: "flex", gap: "0 5px" }}>
                <Box sx={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />
                <Box sx={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />
                <Box sx={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />
              </Box>
              <ArrowDownIcon />
            </Box>

            <Collapse in={exceedOpen}>
              <Box>
                <Routes routes={exceedRoutes} onRouteClick={handleRouteClick} />
              </Box>
            </Collapse>
          </>
        ) : null}
      </Box>
    </>
  );
}
