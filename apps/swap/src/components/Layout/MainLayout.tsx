import { Flex } from "@icpswap/ui";
import Background from "components/Background";
import { CkGlobalEvents } from "components/ck-bridge/GlobalEvents";
import { WalletIndex } from "components/Wallet/WalletIndex";
import { useMediaQuery640 } from "hooks/theme";
import { useDesignVersion } from "hooks/useDesignVersion";
import type React from "react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Ads } from "./ads/Ad";
import { GlobalTips } from "./GlobalTips";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import { SubnetState } from "./SubnetState";
import V3Event from "./V3Event";
import "./layout-design.css";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "icswap.sidebar.collapsed";

function readSidebarCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isClassicDesign } = useDesignVersion();

  const matchDown640 = useMediaQuery640();

  const [show, setShow] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed);

  const handleToggleSidebar = () => {
    const collapsed = !sidebarCollapsed;
    setSidebarCollapsed(collapsed);
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed));
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
  };

  const isSwapPro = useMemo(() => {
    return location.pathname === "/swap/pro";
  }, [location]);

  return (
    <>
      {!isClassicDesign ? <Sidebar collapsed={sidebarCollapsed} /> : null}
      <div
        className={
          isClassicDesign ? "ics-classic-frame" : `ics-terminal-frame${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`
        }
      >
        <Flex
          fullWidth
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
          vertical
          align="flex-start"
        >
          <Ads />
          <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={handleToggleSidebar} />
        </Flex>

        {matchDown640 ? (
          <Flex fullWidth justify="center" sx={{ padding: "15px 0", "&:empty": { display: "none" } }}>
            <CkGlobalEvents />
          </Flex>
        ) : null}

        <div
          className={`relative min-h-[calc(100vh-64px)] ${isClassicDesign ? "pb-[143px]" : "pb-28"} ${
            location.pathname === "/swap/pro" ? (isClassicDesign ? "bg-base-100" : "bg-base-200") : ""
          }`}
        >
          {show && location.pathname.includes("/swap/v2") ? <V3Event onClick={() => setShow(false)} /> : null}

          <GlobalTips />

          <main
            className={`relative w-full grow ${
              location.pathname.includes("info")
                ? "p-0"
                : isClassicDesign
                  ? isSwapPro
                    ? "px-3"
                    : "px-4 max-[640px]:px-3"
                  : isSwapPro
                    ? "px-4"
                    : "px-8 max-[960px]:px-5 max-[640px]:px-3"
            }`}
          >
            {children}
          </main>

          <SubnetState fullWidth={isSwapPro} wrapperSx={{ padding: isSwapPro ? "0 12px" : "0px" }} />
        </div>
      </div>

      <Background />

      <WalletIndex />
    </>
  );
}
