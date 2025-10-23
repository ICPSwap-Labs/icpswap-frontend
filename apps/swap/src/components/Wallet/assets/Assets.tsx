import { useCallback, useState } from "react";
import { Box, Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { WalletManager } from "components/Wallet/WalletManager";
import { SyncYourTokens } from "components/Wallet/assets/SyncYourTokens";
import { TokenAssets } from "components/Wallet/assets/TokenAssets";
import { NFTAssets } from "components/Wallet/assets/NFTAssets";

enum AssetsType {
  Token = "Token",
  NFTS = "NFTs",
}

const Tabs = [
  { label: AssetsType.Token, value: AssetsType.Token },
  { label: AssetsType.NFTS, value: AssetsType.NFTS },
];

export function Assets() {
  const [activeTab, setActiveTab] = useState<AssetsType>(AssetsType.Token);
  const [displayedTabs, setDisplayTabs] = useState<Array<AssetsType>>([AssetsType.Token]);

  const handleSetActiveTab = useCallback(
    (tab: AssetsType) => {
      setActiveTab(tab);

      if (!displayedTabs.includes(tab)) {
        setDisplayTabs([...displayedTabs, tab]);
      }
    },
    [displayedTabs, setActiveTab],
  );

  return (
    <Box>
      <Flex justify="space-between" fullWidth sx={{ padding: "0 16px" }}>
        <Flex gap="0 20px">
          {Tabs.map((element) => (
            <Typography
              sx={{
                fontSize: "16px",
                color: activeTab === element.value ? "text.primary" : "text.secondary",
                cursor: "pointer",
              }}
              onClick={() => handleSetActiveTab(element.value)}
            >
              {element.label}
            </Typography>
          ))}
        </Flex>

        {activeTab === AssetsType.Token ? (
          <Flex gap="0 16px">
            <SyncYourTokens />
            <WalletManager />
          </Flex>
        ) : null}
      </Flex>

      {displayedTabs.includes(AssetsType.Token) ? (
        <Box sx={{ display: activeTab === AssetsType.Token ? "block" : "none" }}>
          <TokenAssets />
        </Box>
      ) : null}

      {displayedTabs.includes(AssetsType.Token) ? (
        <Box sx={{ display: activeTab === AssetsType.NFTS ? "block" : "none" }}>
          <NFTAssets />
        </Box>
      ) : null}
    </Box>
  );
}
