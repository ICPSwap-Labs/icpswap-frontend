import { ChainId } from "@icpswap/constants";
import { useChainKeyMinterInfo } from "@icpswap/hooks";
import { ckSepoliaETHTokenInfo, ckSepoliaUSDCTokenInfo } from "@icpswap/tokens";
import { BigNumber } from "@icpswap/utils";
import { Box } from "components/Mui";
import TokenListHeader from "components/Wallet/TokenListHeader";
import TokenListTable from "components/Wallet/TokenListTable";
import { useWalletTokenContext } from "components/Wallet/token/context";
import { MINTER_CANISTER_ID } from "constants/ckERC20";
import { chain } from "constants/web3";
import { useMemo } from "react";
import { useGlobalTokenList } from "store/global/hooks";
import { useTaggedTokenManager, useWalletSortManager } from "store/wallet/hooks";

export default function WalletTokenList() {
  const { taggedTokens } = useTaggedTokenManager();
  const { allTokenUSDMap, noUSDTokens } = useWalletTokenContext();
  const { sort } = useWalletSortManager();

  const globalTokenList = useGlobalTokenList();
  const { data: chainKeyMinterInfo } = useChainKeyMinterInfo(MINTER_CANISTER_ID);

  const tokens = useMemo(() => {
    const tokenIds = [
      ...(chain === ChainId.SEPOLIA ? [ckSepoliaUSDCTokenInfo.canisterId, ckSepoliaETHTokenInfo.canisterId] : []),
    ];

    return [...new Set([...tokenIds, ...taggedTokens])];
  }, [taggedTokens, globalTokenList]);

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
        <TokenListHeader />

        <TokenListTable tokens={sortedTokens} chainKeyMinterInfo={chainKeyMinterInfo} />
      </Box>
    </>
  );
}
