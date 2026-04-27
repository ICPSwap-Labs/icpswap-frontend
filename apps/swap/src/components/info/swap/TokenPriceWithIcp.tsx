import { useInfoPool } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { BigNumber, formatTokenPrice, nonUndefinedOrNull } from "@icpswap/utils";
import { TokenImage } from "components/index";
import { Box, Typography, useTheme } from "components/Mui";
import { useToken } from "hooks/index";
import { useTokenPairWithIcp } from "hooks/swap/useTokenPairWithIcp";
import { useMemo } from "react";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";

export interface TokenPriceProps {
  token: Token | Null;
  token1Symbol: string | undefined;
  price: number | undefined;
}

export function TokenPrice({ token, token1Symbol, price }: TokenPriceProps) {
  const theme = useTheme();

  return token && token1Symbol && nonUndefinedOrNull(price) ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenImage size="18px" sx={{ margin: "0 6px 0 0" }} logo={token.logo} tokenId={token.address} />
      <Typography color="text.primary" fontWeight={500}>
        1 {tokenSymbolEllipsis({ symbol: token?.symbol })} = {formatTokenPrice(price)}{" "}
        {tokenSymbolEllipsis({ symbol: token1Symbol })}
      </Typography>
    </Box>
  ) : null;
}

export function InfoTokenPrices({ tokenInfo }: { tokenInfo: Token | undefined }) {
  const theme = useTheme();

  const poolId = useTokenPairWithIcp({ tokenId: tokenInfo?.address });
  const { data: pool } = useInfoPool(poolId);
  const [, token0] = useToken(pool?.token0LedgerId);
  const [, token1] = useToken(pool?.token1LedgerId);

  const { token0Ratio, token1Ratio } = useMemo(() => {
    if (!pool) return {};

    const token0Price = pool.token0Price;
    const token1Price = pool.token1Price;

    const token0Ratio = new BigNumber(token1Price).isEqualTo(0)
      ? 0
      : new BigNumber(token0Price).dividedBy(token1Price).toNumber();

    const token1Ratio = new BigNumber(token0Price).isEqualTo(0)
      ? 0
      : new BigNumber(token1Price).dividedBy(token0Price).toNumber();

    return { token0Ratio, token1Ratio };
  }, [pool]);

  return token0 && token1 && tokenInfo ? (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenPrice token={token0} token1Symbol={token1.symbol} price={token0Ratio} />
      <Box sx={{ width: "10px" }} />
      <TokenPrice token={token1} price={token1Ratio} token1Symbol={token0.symbol} />
    </Box>
  ) : null;
}
