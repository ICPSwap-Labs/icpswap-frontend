import { Flex } from "@icpswap/ui";
import Background from "components/Background";
import { CkGlobalEvents } from "components/ck-bridge/GlobalEvents";
import { WalletIndex } from "components/Wallet/WalletIndex";
import { useMediaQuery640 } from "hooks/theme";
import type React from "react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Ads } from "./ads/Ad";
import { GlobalTips } from "./GlobalTips";
import Header from "./Header";
import { SubnetState } from "./SubnetState";
import V3Event from "./V3Event";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const matchDown640 = useMediaQuery640();

  const [show, setShow] = useState(true);

  const isSwapPro = useMemo(() => {
    return location.pathname === "/swap/pro";
  }, [location]);

  return (
    <>
      <Flex
        className="border-base-content/8"
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
        <Header />
      </Flex>

      {matchDown640 ? (
        <Flex fullWidth justify="center" sx={{ padding: "15px 0" }}>
          <CkGlobalEvents />
        </Flex>
      ) : null}

      <div
        className={`relative min-h-[calc(100vh-76px)] pb-[143px] max-[960px]:min-h-[calc(100vh-64px)] ${
          location.pathname === "/swap/pro" ? "bg-base-200" : ""
        }`}
      >
        {show && location.pathname.includes("/swap/v2") ? <V3Event onClick={() => setShow(false)} /> : null}

        <GlobalTips />

        <main
          className={`relative w-full grow ${
            location.pathname.includes("info") ? "p-0" : isSwapPro ? "px-3" : "px-6 max-[960px]:px-4 max-[640px]:px-3"
          }`}
        >
          {children}
        </main>

        <SubnetState fullWidth={isSwapPro} wrapperSx={{ padding: isSwapPro ? "0 12px" : "0px" }} />
      </div>

      <Background />

      <WalletIndex />
    </>
  );
}
