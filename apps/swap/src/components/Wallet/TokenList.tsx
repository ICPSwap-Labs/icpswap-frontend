import { useState, useMemo, useContext } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import TokenListTable from "components/Wallet/TokenListTable";
import TokenListHeader from "components/Wallet/TokenListHeader";
import { ckSepoliaUSDCTokenInfo, ckSepoliaETHTokenInfo } from "@icpswap/tokens";
import { chain } from "constants/web3";
import { ChainId } from "@icpswap/constants";
import { useTaggedTokenManager, useUpdateHideSmallBalanceManager, useWalletSortManager } from "store/wallet/hooks";
import { DISPLAY_IN_WALLET_FOREVER } from "constants/wallet";
import { useGlobalTokenList } from "store/global/hooks";
import BigNumber from "bignumber.js";
import { AlertCircle, X } from "react-feather";
import { Trans } from "@lingui/macro";
import { Flex, TextButton } from "@icpswap/ui";
import { useAccountPrincipal } from "store/auth/hooks";
import { MINTER_CANISTER_ID } from "constants/ckERC20";
import { useChainKeyMinterInfo } from "@icpswap/hooks";

import WalletContext from "./context";

export default function WalletTokenList() {
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const [showTip, setShowTip] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isHideSmallBalances, setIsHideSmallBalances] = useUpdateHideSmallBalanceManager();
  const { taggedTokens } = useTaggedTokenManager();
  const { allTokenUSDMap, noUSDTokens } = useContext(WalletContext);
  const { sort } = useWalletSortManager();

  const globalTokenList = useGlobalTokenList();
  const { result: chainKeyMinterInfo } = useChainKeyMinterInfo(MINTER_CANISTER_ID);

  const tokens = useMemo(() => {
    const tokenIds = [
      ...DISPLAY_IN_WALLET_FOREVER,
      ...(chain === ChainId.SEPOLIA ? [ckSepoliaUSDCTokenInfo.canisterId, ckSepoliaETHTokenInfo.canisterId] : []),
    ];

    return [...new Set([...tokenIds, ...taggedTokens.filter((id) => !DISPLAY_IN_WALLET_FOREVER.includes(id))])];
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

  const handleSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const hideSmallBalances = (hideOrNot: boolean) => {
    setIsHideSmallBalances(hideOrNot);
  };

  const handleCloseTip = () => {
    setShowTip(false);
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

        {showTip ? (
          <Flex
            justify="space-between"
            sx={{
              width: "100%",
              borderRadius: "12px",
              padding: "13px 16px",
              background: "rgba(183, 156,  74, 0.3)",
            }}
          >
            <Flex gap="0 12px">
              <Box sx={{ width: "16px" }}>
                <AlertCircle color={theme.colors.warning} size="16px" />
              </Box>

              <Typography color="text.primary">
                <Trans>
                  Click '+' on the right to add tokens and display their balance. You can also check &nbsp;
                  <TextButton
                    color="white"
                    sx={{ textDecoration: "underline" }}
                    link={`https://info.icpswap.com/swap-scan/valuation?principal=${principal?.toString()}`}
                  >
                    'Wallet Valuation'
                  </TextButton>{" "}
                  to view all your tokens.
                </Trans>
              </Typography>
            </Flex>

            <Box sx={{ width: "16px" }}>
              <X color="#ffffff" size="16px" onClick={handleCloseTip} cursor="pointer" />
            </Box>
          </Flex>
        ) : null}

        <TokenListTable
          isHideSmallBalances={isHideSmallBalances}
          tokens={sortedTokens}
          searchValue={searchValue}
          chainKeyMinterInfo={chainKeyMinterInfo}
        />
      </Box>
    </>
  );
}
