import { mockALinkAndOpen } from "@icpswap/utils";
import Logo from "components/Logo";
import classicLogoMark from "assets/images/logo1.svg";
import { MOBILE_MAX_NUMBER, type Route, routeKey, routes } from "components/Layout/Navbar/config";
import { Routes } from "components/Layout/Navbar/mobile/Routes";
import { Box, Collapse } from "components/Mui";
import { useMemo, useState } from "react";
import { useDesignVersion } from "hooks/useDesignVersion";
import { ChevronDown, XCircle } from "react-feather";
import { useNavigate } from "react-router-dom";

export interface MobileNavbarProps {
  onClose?: () => void;
}

export default function MobileNavbar({ onClose }: MobileNavbarProps) {
  const { isClassicDesign } = useDesignVersion();
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
      <Box
        className={isClassicDesign ? undefined : "border-b border-base-content/8"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isClassicDesign ? "16px" : "22px 24px",
        }}
      >
        {isClassicDesign ? (
          <img src={classicLogoMark} width="32" height="32" alt="" />
        ) : (
          <Box sx={{ "& img": { width: "125px", height: "32px", objectFit: "contain" } }}>
            <Logo />
          </Box>
        )}
        <XCircle
          size={isClassicDesign ? 24 : 22}
          style={{ cursor: "pointer", color: "var(--color-base-content)", opacity: isClassicDesign ? 1 : 0.6 }}
          onClick={onClose}
        />
      </Box>

      {/* <Box sx={{ padding: "0 20px", margin: "32px 0 0 0" }}>
        <Box sx={{ width: "100%", height: "1px", background: "#29314F" }} />
      </Box> */}

      <Box sx={{ padding: isClassicDesign ? "0" : "16px 12px" }}>
        <Routes routes={noExceedRoutes} onRouteClick={handleRouteClick} />

        {exceedRoutes.length > 0 ? (
          <>
            <Box
              sx={{
                padding: isClassicDesign ? "24px 16px" : "20px 16px",
                borderRadius: isClassicDesign ? 0 : "5px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": { background: "var(--color-base-200)" },
              }}
              onClick={() => setExceedOpen(!exceedOpen)}
            >
              <Box sx={{ display: "flex", gap: "0 5px" }}>
                <Box
                  sx={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--color-base-content)" }}
                />
                <Box
                  sx={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--color-base-content)" }}
                />
                <Box
                  sx={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--color-base-content)" }}
                />
              </Box>
              <ChevronDown color="var(--color-primary)" size={18} strokeWidth={1.5} />
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
