import { useState, useMemo } from "react";
import { Box } from "@mui/material";
import TokenListTable from "components/Wallet/TokenListTable";
import TokenListHeader from "components/Wallet/TokenListHeader";
import { ICP_METADATA, WRAPPED_ICP_METADATA } from "constants/tokens";
import { NETWORK, network } from "constants/server";
import { useWalletCatchTokenIds, useUpdateHideSmallBalanceManager } from "store/wallet/hooks";
import { DISPLAY_IN_WALLET_FOREVER } from "constants/wallet";
import { useGlobalTokenList } from "store/global/hooks";

export default function WalletTokenList() {
  const [searchValue, setSearchValue] = useState("");
  const [isHideSmallBalances, setIsHideSmallBalances] = useUpdateHideSmallBalanceManager();
  const walletCacheTokenIds = useWalletCatchTokenIds();

  const globalTokenList = useGlobalTokenList();

  const tokens = useMemo(() => {
    let tokenIds = [
      ICP_METADATA.canisterId.toString(),
      WRAPPED_ICP_METADATA.canisterId.toString(),
      "yfumr-cyaaa-aaaar-qaela-cai",
    ];

    if (network === NETWORK.IC) {
      tokenIds = [
        ...tokenIds,
        ...globalTokenList
          .filter((token) => !!token.configs.find((config) => config.name === "WALLET" && config.value === "true"))
          .sort((a, b) => {
            if (a.rank < b.rank) return -1;
            if (a.rank > b.rank) return 1;
            return 0;
          })
          .map((token) => token.canisterId),
      ];
    }

    return [...new Set([...tokenIds, ...walletCacheTokenIds.filter((id) => !DISPLAY_IN_WALLET_FOREVER.includes(id))])];
  }, [walletCacheTokenIds, globalTokenList]);

  const handleSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const hideSmallBalances = (hideOrNot: boolean) => {
    setIsHideSmallBalances(hideOrNot);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0", overflow: "auto hidden" }}>
        <TokenListHeader
          onHideSmallBalances={hideSmallBalances}
          onSearchValue={handleSearchValue}
          isHideSmallBalances={isHideSmallBalances}
        />

        <TokenListTable isHideSmallBalances={isHideSmallBalances} list={tokens} searchValue={searchValue} />
      </Box>
    </>
  );
}
