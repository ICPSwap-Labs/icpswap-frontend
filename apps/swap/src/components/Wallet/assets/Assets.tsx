import { useCallback } from "react";
import { Box, Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { WalletManager } from "components/Wallet/WalletManager";
import { SyncYourTokens } from "components/Wallet/assets/SyncYourTokens";
import { TokenAssets } from "components/Wallet/assets/TokenAssets";
import { NFTAssets } from "components/Wallet/NFT/NFTAssets";
import { useWalletTokenContext, AssetsType } from "components/Wallet/token/context";
import { NFTImportIcon } from "components/Wallet/NFT/NFTImportIcon";

const Tabs = [
  { label: AssetsType.Token, value: AssetsType.Token },
  { label: AssetsType.NFTS, value: AssetsType.NFTS },
];

export function Assets() {
  const { activeAssetsTab, setActiveAssetsTab, displayedAssetsTabs, setDisplayedAssetsTabs } = useWalletTokenContext();

  const handleSetActiveTab = useCallback(
    (tab: AssetsType) => {
      setActiveAssetsTab(tab);

      if (!displayedAssetsTabs.includes(tab)) {
        setDisplayedAssetsTabs([...displayedAssetsTabs, tab]);
      }
    },
    [displayedAssetsTabs, setActiveAssetsTab, setDisplayedAssetsTabs],
  );

  return (
    <Box>
      <Flex justify="space-between" fullWidth sx={{ padding: "0 16px" }}>
        <Flex gap="0 20px">
          {Tabs.map((element) => (
            <Typography
              key={element.value}
              sx={{
                fontSize: "16px",
                color: activeAssetsTab === element.value ? "text.primary" : "text.secondary",
                cursor: "pointer",
              }}
              onClick={() => handleSetActiveTab(element.value)}
            >
              {element.label}
            </Typography>
          ))}
        </Flex>

        {activeAssetsTab === AssetsType.Token ? (
          <Flex gap="0 16px">
            <SyncYourTokens />
            <WalletManager />
          </Flex>
        ) : null}

        {activeAssetsTab === AssetsType.NFTS ? (
          <Flex gap="0 16px">
            <NFTImportIcon />
          </Flex>
        ) : null}
      </Flex>

      {displayedAssetsTabs.includes(AssetsType.Token) ? (
        <Box sx={{ display: activeAssetsTab === AssetsType.Token ? "block" : "none" }}>
          <TokenAssets />
        </Box>
      ) : null}

      {activeAssetsTab === AssetsType.NFTS ? (
        <Box>
          <NFTAssets />
        </Box>
      ) : null}
    </Box>
  );
}
