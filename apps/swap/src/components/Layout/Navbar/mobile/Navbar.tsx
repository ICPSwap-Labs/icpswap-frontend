import { mockALinkAndOpen } from "@icpswap/utils";
import { ReactComponent as Logo } from "assets/images/logo1.svg";
import { MOBILE_MAX_NUMBER, type Route, routeKey, routes } from "components/Layout/Navbar/config";
import { Routes } from "components/Layout/Navbar/mobile/Routes";
import { Box, Collapse } from "components/Mui";
import { useMemo, useState } from "react";
import { ChevronDown, XCircle } from "react-feather";
import { useNavigate } from "react-router-dom";

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
    return routes.filter((_route, index) => index < MOBILE_MAX_NUMBER);
  }, []);

  const exceedRoutes = useMemo(() => {
    return routes.filter((_route, index) => index >= MOBILE_MAX_NUMBER);
  }, []);

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
              <ChevronDown color="#8492C4" strokeWidth={1} />
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
