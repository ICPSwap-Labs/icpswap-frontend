import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { formatAmount, toSignificant } from "@icpswap/utils";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import BigNumber from "bignumber.js";
import { TokenImage } from "components/index";

export interface TokenPoolPriceProps {
  tokenA: TokenInfo | undefined;
  tokenB: TokenInfo | undefined;
  priceA: number | undefined;
  priceB: number | undefined;
  background?: "none" | "level4";
  disable?: boolean;
}

export function TokenPoolPrice({ tokenA, tokenB, priceB, priceA, background = "level4" }: TokenPoolPriceProps) {
  const theme = useTheme() as Theme;

  return priceA && priceB ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: background === "level4" ? theme.palette.background.level4 : "none",
        cursor: "pointer",
      }}
    >
      <TokenImage logo={tokenA?.logo} tokenId={tokenA?.canisterId} size="18px" sx={{ margin: "0 6px 0 0" }} />

      <Typography color="text.primary" fontSize="12px">
        1 {tokenA?.symbol} = {formatAmount(new BigNumber(priceA).dividedBy(priceB).toNumber(), 3)} {tokenB?.symbol}
      </Typography>
      <Typography color="text.primary" fontSize="12px">
        &nbsp;= ${toSignificant(priceA, 3, { groupSeparator: "," })}
      </Typography>
    </Box>
  ) : null;
}
