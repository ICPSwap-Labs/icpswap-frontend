import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { Header } from "components/Wallet/Header";
import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState } from "react";
import { DistributionWrapper } from "components/Wallet/assets/DistributionWrapper";
import { AssetsWrapper } from "components/Wallet/assets/AssetsWrapper";

enum TABS {
  Assets = "Assets",
  Overview = "Overview",
}

const tabs = [
  { value: TABS.Assets, label: "Assets" },
  { value: TABS.Overview, label: "Portfolio" },
];

export function TokenAssetsWrapper() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TABS>(TABS.Assets);

  return (
    <DrawerWrapper
      noHeader
      padding="0px"
      footer={
        activeTab === TABS.Overview ? (
          <Box sx={{ padding: "12px" }}>
            <Box
              sx={{
                background: theme.palette.background.level3,
                borderRadius: "16px",
                padding: "12px",
                display: "flex",
                gap: "0 6px",
                alignItems: "flex-start",
              }}
            >
              <img src="/images/wallet/warning.svg" alt="" />
              <Typography sx={{ fontSize: "12px", lineHeight: "16px" }}>
                Data refreshes periodically from multiple canisters and is not real-time.
              </Typography>
            </Box>
          </Box>
        ) : null
      }
    >
      <Box sx={{ background: theme.palette.background.wallet, borderRadius: "24px" }}>
        <Header />
      </Box>

      <Box sx={{ padding: "24px 12px 0px 12px" }}>
        <Flex gap="0 20px">
          {tabs.map((tab) => {
            return (
              <Typography
                key={tab.value}
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: activeTab === tab.value ? "text.primary" : "text.secondary",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </Typography>
            );
          })}
        </Flex>
      </Box>

      {activeTab === TABS.Assets ? <AssetsWrapper /> : null}
      {activeTab === TABS.Overview ? <DistributionWrapper /> : null}
    </DrawerWrapper>
  );
}
