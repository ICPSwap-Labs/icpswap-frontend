import { useState, useMemo, useContext } from "react";
import { Box } from "@mui/material";
import TokenListTable from "components/Wallet/TokenListTable";
import TokenListHeader from "components/Wallet/TokenListHeader";
import { WRAPPED_ICP_METADATA } from "constants/tokens";
import { ckSepoliaUSDCTokenInfo, ckSepoliaETHTokenInfo, ICP } from "@icpswap/tokens";
import { chain } from "constants/web3";
import { ChainId } from "@icpswap/constants";
import { NETWORK, network } from "constants/server";
import { useWalletCatchTokenIds, useUpdateHideSmallBalanceManager } from "store/wallet/hooks";
import { DISPLAY_IN_WALLET_FOREVER } from "constants/wallet";
import { useGlobalTokenList } from "store/global/hooks";
import BigNumber from "bignumber.js";

import WalletContext from "./context";

export default function WalletTokenList() {
  const [searchValue, setSearchValue] = useState("");
  const [isHideSmallBalances, setIsHideSmallBalances] = useUpdateHideSmallBalanceManager();
  const walletCacheTokenIds = useWalletCatchTokenIds();
  const { allTokenUSDMap, noUSDTokens, sort } = useContext(WalletContext);

  const globalTokenList = useGlobalTokenList();

  const tokens = useMemo(() => {
    let tokenIds = [
      ICP.address,
      WRAPPED_ICP_METADATA.canisterId.toString(),
      ...(chain === ChainId.SEPOLIA ? [ckSepoliaUSDCTokenInfo.canisterId, ckSepoliaETHTokenInfo.canisterId] : []),
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

  const sortedTokens = useMemo(() => {
    if (Object.keys(allTokenUSDMap).length + noUSDTokens.length < tokens.length) return tokens;

    if (sort === "Default") return tokens;

    const __tokens = [...tokens];

    return __tokens.sort((a, b) => {
      const aUSDValue = allTokenUSDMap[a] ?? new BigNumber(0);
      const bUSDValue = allTokenUSDMap[b] ?? new BigNumber(0);

      if (aUSDValue.isGreaterThan(bUSDValue)) return sort === "High" ? -1 : 1;
      if (aUSDValue.isLessThan(bUSDValue)) return sort === "High" ? 1 : -1;
      return 0;
    });
  }, [tokens, allTokenUSDMap, noUSDTokens, sort]);

  const handleSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const hideSmallBalances = (hideOrNot: boolean) => {
    setIsHideSmallBalances(hideOrNot);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px 0",
          overflow: "auto hidden",
          "@media(max-width: 640px)": {
            gap: "16px 0",
          },
        }}
      >
        <TokenListHeader
          onHideSmallBalances={hideSmallBalances}
          onSearchValue={handleSearchValue}
          isHideSmallBalances={isHideSmallBalances}
        />

        <TokenListTable isHideSmallBalances={isHideSmallBalances} tokens={sortedTokens} searchValue={searchValue} />
      </Box>
    </>
  );
}
