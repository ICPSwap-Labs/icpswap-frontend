import { Box, Typography } from "components/Mui";
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
  { value: TABS.Overview, label: "Overview" },
];

export function TokenAssetsWrapper() {
  const [activeTab, setActiveTab] = useState<TABS>(TABS.Assets);

  return (
    <DrawerWrapper noHeader padding="0px">
      <Box sx={{ background: "#1B223F", borderRadius: "24px" }}>
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
