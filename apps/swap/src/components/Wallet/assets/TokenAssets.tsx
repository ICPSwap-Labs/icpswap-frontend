import { useCallback, useMemo, useRef, useState } from "react";
import { Box, useTheme, Typography } from "components/Mui";
import { Flex, MenuWrapper } from "@icpswap/ui";
import { useAccountPrincipalString } from "store/auth/hooks";
import {
  useDisplayedTokensInWallet,
  useHideSmallBalanceManager,
  useTaggedTokenManager,
  useWalletSortManager,
} from "store/wallet/hooks";
import { useBridgeTokens, useGlobalTokenList } from "store/global/hooks";
import { DISPLAY_IN_WALLET_BY_DEFAULT, TOKEN_ASSETS_REFRESH } from "constants/wallet";
import { chain } from "constants/web3";
import { ChainId } from "@icpswap/constants";
import { ckSepoliaUSDCTokenInfo, ckSepoliaETHTokenInfo } from "@icpswap/tokens";
import { BigNumber, formatAmount, formatDollarAmount, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { TokenImage } from "components/Image";
import { useRefreshTrigger, useToken, useUSDPrice } from "hooks/index";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import {
  TokenReceiveItem,
  TokenSendItem,
  RemoveItem,
  ConvertItem,
  TransactionItem,
  SwapItem,
  TopUpItem,
} from "components/Wallet/TokenMenuItem/index";
import { useTokenDataManager } from "hooks/wallet/useTokenDataManager";
import { DotLoading } from "components/index";
import { XTC } from "constants/tokens";
import { useWalletTokenContext } from "components/Wallet/token/context";

interface TokenRowProps {
  tokenId: string;
}

function TokenRow({ tokenId }: TokenRowProps) {
  const theme = useTheme();
  const [, token] = useToken(tokenId);
  const principal = useAccountPrincipalString();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const [hideSmallBalance] = useHideSmallBalanceManager();
  const refreshTrigger = useRefreshTrigger(TOKEN_ASSETS_REFRESH);
  const allBridgeTokens = useBridgeTokens();
  const tokenPrice = useUSDPrice(token);

  const { result: tokenBalance, loading } = useTokenBalance(tokenId, principal, refreshTrigger);

  const handleTokenRowClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { usdValue } = useTokenDataManager({ tokenId, tokenBalance, balanceLoading: loading });

  return (
    <>
      <Box
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: hideSmallBalance && usdValue && usdValue.isLessThan(1) ? "none" : "block",
        }}
      >
        <Flex
          className="wrapper"
          sx={{
            cursor: "pointer",
            padding: "16px",
            background: open ? theme.palette.background.level1 : theme.palette.background.wallet,
            "&:hover": {
              background: theme.palette.background.level1,
            },
          }}
          justify="space-between"
          onClick={handleTokenRowClick}
        >
          <Flex gap="0 8px">
            <TokenImage logo={token?.logo} tokenId={tokenId} size="40px" />

            <Box>
              <Typography sx={{ fontSize: "16px", color: "text.primary", fontWeight: 500 }}>
                {token?.name ?? "--"}
              </Typography>
              <Typography fontSize="14px" sx={{ margin: "6px 0 0 0" }}>
                {nonUndefinedOrNull(tokenBalance) && nonUndefinedOrNull(token)
                  ? `${formatAmount(parseTokenAmount(tokenBalance, token.decimals).toString())} ${token.symbol}`
                  : "--"}
              </Typography>
            </Box>
          </Flex>

          {loading ? (
            <DotLoading loading />
          ) : (
            <Typography sx={{ fontWeight: "500", color: "text.primary", fontSize: "16px" }}>
              {nonUndefinedOrNull(tokenPrice) && nonUndefinedOrNull(tokenBalance) && token
                ? `${formatDollarAmount(
                    parseTokenAmount(tokenBalance, token.decimals).multipliedBy(tokenPrice).toString(),
                  )}`
                : "--"}
            </Typography>
          )}
        </Flex>

        <MenuWrapper
          open={open}
          anchor={ref?.current}
          placement="bottom-start"
          onClickAway={handleClose}
          menuWidth="186px"
          background={theme.palette.background.level3}
          border="1px solid #49588E"
        >
          <SwapItem tokenId={tokenId} />
          <TokenSendItem tokenId={tokenId} />
          <TokenReceiveItem tokenId={tokenId} />
          <TransactionItem tokenId={tokenId} isBridgeToken={allBridgeTokens.includes(tokenId)} />
          {allBridgeTokens.includes(tokenId) ? <ConvertItem tokenId={tokenId} /> : null}
          {tokenId === XTC.address ? <TopUpItem tokenId={tokenId} /> : null}
          <RemoveItem tokenId={tokenId} isLast onRemoveClick={handleClose} />
        </MenuWrapper>
      </Box>
    </>
  );
}

export function TokenAssets() {
  const { taggedTokens } = useTaggedTokenManager();
  const { sort } = useWalletSortManager();
  const { allTokenUSDMap, noUSDTokens } = useWalletTokenContext();

  const globalTokenList = useGlobalTokenList();
  const displayedTokensInWallet = useDisplayedTokensInWallet();

  const tokens = useMemo(() => {
    const tokenIds = [
      ...displayedTokensInWallet,
      ...(chain === ChainId.SEPOLIA ? [ckSepoliaUSDCTokenInfo.canisterId, ckSepoliaETHTokenInfo.canisterId] : []),
    ];

    return [...new Set([...tokenIds, ...taggedTokens.filter((id) => !DISPLAY_IN_WALLET_BY_DEFAULT.includes(id))])];
  }, [taggedTokens, globalTokenList]);

  const sortedTokens = useMemo(() => {
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
    <Box sx={{ margin: "22px 0 0 0 " }}>
      {sortedTokens.map((tokenId) => (
        <TokenRow key={tokenId} tokenId={tokenId} />
      ))}
    </Box>
  );
}
