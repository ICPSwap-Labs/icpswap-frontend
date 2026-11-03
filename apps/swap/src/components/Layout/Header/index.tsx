import { CkGlobalEvents } from "components/ck-bridge/GlobalEvents";
import { DesignSwitch } from "components/DesignSwitch";
import ProfileSection from "components/Layout/Header/ProfileSection";
import Navbar from "components/Layout/Navbar";
import { routes } from "components/Layout/Navbar/config";
import MobileNavbar from "components/Layout/Navbar/mobile/Navbar";
import LogoSection from "components/LogoSection";
import { Drawer, useMediaQuery, useTheme } from "components/Mui";
import { DensityMediumIcon } from "components/MuiIcon";
import { useMediaQuery640 } from "hooks/theme";
import { useDesignVersion } from "hooks/useDesignVersion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Sidebar as SidebarIcon } from "react-feather";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { isClassicDesign } = useDesignVersion();
  const theme = useTheme();

  const matchDown960 = useMediaQuery("(max-width:960px)");
  const matchDown1100 = useMediaQuery("(max-width:1099px)");
  const matchDownMD = isClassicDesign ? matchDown960 : matchDown1100;
  const matchDown640 = useMediaQuery640();
  const matchDown1200 = useMediaQuery("(max-width:1200px)");
  const matchDown1440 = useMediaQuery("(max-width:1440px)");
  const showInlineEvents = !matchDown640 && !(isClassicDesign ? matchDown1440 : matchDown1200);
  const { pathname } = useLocation();
  const mainRoute = pathname.split("/")[1];
  const currentRoute =
    routes.find((route) =>
      typeof route.key === "string"
        ? route.key === mainRoute || (route.key === "info" && mainRoute.includes("info"))
        : route.key.includes(mainRoute),
    ) ?? routes[0];

  const handleToggleDrawer = () => {
    setDrawerOpen(true);
  };

  return (
    <>
      <header
        className={`ics-design-header navbar relative h-16 min-h-16 w-full justify-between gap-3 text-base-content max-[400px]:gap-2 ${isClassicDesign ? "px-5 max-[640px]:px-4" : "ics-terminal-header border-b border-base-content/10 bg-base-200 px-8 max-[960px]:px-5 max-[640px]:px-4"}`}
        style={
          isClassicDesign
            ? { backgroundColor: theme.palette.mode === "dark" ? "#0B132F" : "var(--color-base-100)" }
            : undefined
        }
      >
        <div className={`flex h-full min-w-0 items-center ${isClassicDesign ? "gap-5" : "gap-4 max-[400px]:gap-2"}`}>
          {matchDownMD ? (
            <>
              <DensityMediumIcon
                sx={{
                  cursor: "pointer",
                  fontSize: isClassicDesign ? 24 : 20,
                  color: isClassicDesign ? "var(--color-base-content)" : "var(--color-primary)",
                }}
                onClick={handleToggleDrawer}
              />
              {!isClassicDesign ? (
                <div className="ics-header-brand">
                  <LogoSection />
                </div>
              ) : null}
            </>
          ) : isClassicDesign ? (
            <>
              <LogoSection />
              <Navbar />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm relative h-9 min-h-0 w-9 rounded-md text-base-content/65 hover:bg-base-content/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!sidebarCollapsed}
                aria-controls="ics-desktop-sidebar"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={onToggleSidebar}
              >
                <SidebarIcon size={18} strokeWidth={1.5} aria-hidden="true" />
                {sidebarCollapsed ? (
                  <ChevronRight className="absolute right-0 bottom-0 bg-base-200" size={10} aria-hidden="true" />
                ) : (
                  <ChevronLeft className="absolute right-0 bottom-0 bg-base-200" size={10} aria-hidden="true" />
                )}
              </button>
              <span className="h-1.5 w-1.5 bg-primary" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-base-content/65">
                {currentRoute.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 max-[640px]:gap-2">
          {showInlineEvents ? (
            <div>
              <CkGlobalEvents />
            </div>
          ) : null}
          <DesignSwitch />
          <ProfileSection />
        </div>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: "100%",
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: isClassicDesign ? "none" : "360px",
              background: "var(--color-base-100)",
              borderRight: isClassicDesign
                ? "none"
                : "1px solid color-mix(in oklab, var(--color-base-content) 10%, transparent)",
            },
          }}
        >
          <MobileNavbar onClose={() => setDrawerOpen(false)} />
        </Drawer>
      </header>
      {!matchDown640 && !showInlineEvents ? (
        <div
          className={`flex w-full justify-center py-2.5 empty:hidden ${isClassicDesign ? "bg-base-100" : "border-b border-base-content/10 bg-base-200"}`}
        >
          <CkGlobalEvents />
        </div>
      ) : null}
    </>
  );
}
