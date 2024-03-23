import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { toSignificant } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { ICP_TOKEN_INFO } from "constants/tokens";
import { usePoolIdWithICP } from "hooks/swap/usePoolIdWithICP";
import { usePool } from "hooks/info/usePool";
import { useMemo } from "react";
import { TokenImage } from "ui-component/index";

export interface TokenPriceProps {
  token0: TokenInfo | undefined;
  token1Symbol: string | undefined;
  price: number | undefined;
}

export function TokenPrice({ token0, token1Symbol, price }: TokenPriceProps) {
  const theme = useTheme() as Theme;

  return token0 && token1Symbol && price ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenImage size="18px" sx={{ margin: "0 6px 0 0" }} logo={token0.logo} tokenId={token0.canisterId} />
      <Typography color="text.primary" fontWeight={500}>
        1 {token0?.symbol} = {toSignificant(price, 4)} {token1Symbol}
      </Typography>
    </Box>
  ) : null;
}

export function TokenPrices({ tokenInfo }: { tokenInfo: TokenInfo | undefined }) {
  const theme = useTheme() as Theme;

  const poolId = usePoolIdWithICP(tokenInfo?.canisterId);
  const { result: pool } = usePool(poolId);

  const icpPrice = useMemo(() => {
    if (!pool || !tokenInfo?.canisterId) return undefined;

    return pool.token0Id === tokenInfo.canisterId ? pool.token1Price : pool.token0Price;
  }, [pool, tokenInfo?.canisterId]);

  const tokenPrice = useMemo(() => {
    if (!pool || !tokenInfo?.canisterId) return undefined;

    return pool.token0Id === tokenInfo.canisterId ? pool.token0Price : pool.token1Price;
  }, [pool, tokenInfo?.canisterId]);

  const icpRatio = tokenPrice && icpPrice ? new BigNumber(icpPrice).dividedBy(tokenPrice).toNumber() : undefined;
  const tokenRatio = tokenPrice && icpPrice ? new BigNumber(tokenPrice).dividedBy(icpPrice).toNumber() : undefined;

  return tokenPrice && icpPrice && tokenInfo ? (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenPrice token0={ICP_TOKEN_INFO} token1Symbol={tokenInfo?.symbol} price={icpRatio} />
      <Box sx={{ width: "10px" }} />
      <TokenPrice token0={tokenInfo} price={tokenRatio} token1Symbol={ICP_TOKEN_INFO.symbol} />
    </Box>
  ) : null;
}
