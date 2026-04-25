import { useInfoPool } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import type { Null } from "@icpswap/types";
import { BigNumber, nonUndefinedOrNull, toSignificant } from "@icpswap/utils";
import { TokenImage } from "components/index";
import { Box, Typography, useTheme } from "components/Mui";
import { useTokenPairWithIcp } from "hooks/swap/useTokenPairWithIcp";
import { useMemo } from "react";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";

export interface TokenPriceProps {
  token0: Token | Null;
  token1Symbol: string | undefined;
  price: number | undefined;
}

export function TokenPrice({ token0, token1Symbol, price }: TokenPriceProps) {
  const theme = useTheme();

  return token0 && token1Symbol && nonUndefinedOrNull(price) ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenImage size="18px" sx={{ margin: "0 6px 0 0" }} logo={token0.logo} tokenId={token0.address} />
      <Typography color="text.primary" fontWeight={500}>
        1 {tokenSymbolEllipsis({ symbol: token0?.symbol })} = {toSignificant(price, 4)}{" "}
        {tokenSymbolEllipsis({ symbol: token1Symbol })}
      </Typography>
    </Box>
  ) : null;
}

export function InfoTokenPrices({ tokenInfo }: { tokenInfo: Token | undefined }) {
  const theme = useTheme();

  const poolId = useTokenPairWithIcp({ tokenId: tokenInfo?.address });
  const { data: pool } = useInfoPool(poolId);

  const icpPrice = useMemo(() => {
    if (!pool || !tokenInfo?.address) return undefined;

    return pool.token0LedgerId === tokenInfo.address ? pool.token1Price : pool.token0Price;
  }, [pool, tokenInfo?.address]);

  const tokenPrice = useMemo(() => {
    if (!pool || !tokenInfo?.address) return undefined;

    return pool.token0LedgerId === tokenInfo.address ? pool.token0Price : pool.token1Price;
  }, [pool, tokenInfo?.address]);

  const icpRatio =
    tokenPrice && icpPrice
      ? new BigNumber(tokenPrice).isEqualTo(0)
        ? 0
        : new BigNumber(icpPrice).dividedBy(tokenPrice).toNumber()
      : undefined;
  const tokenRatio =
    tokenPrice && icpPrice
      ? new BigNumber(icpPrice).isEqualTo(0)
        ? 0
        : new BigNumber(tokenPrice).dividedBy(icpPrice).toNumber()
      : undefined;

  return tokenPrice && icpPrice && tokenInfo ? (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenPrice token0={ICP} token1Symbol={tokenInfo?.symbol} price={icpRatio} />
      <Box sx={{ width: "10px" }} />
      <TokenPrice token0={tokenInfo} price={tokenRatio} token1Symbol={ICP.symbol} />
    </Box>
  ) : null;
}
