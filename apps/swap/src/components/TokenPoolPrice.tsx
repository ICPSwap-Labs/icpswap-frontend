import { Typography, Box, useTheme, BoxProps } from "components/Mui";
import { formatAmount, BigNumber, formatDollarTokenPrice } from "@icpswap/utils";
import { TokenImage } from "components/index";
import { Token } from "@icpswap/swap-sdk";

export interface TokenPoolPriceProps {
  tokenA: Token | undefined;
  tokenB: Token | undefined;
  priceA: number | undefined;
  priceB: number | undefined;
  background?: "none" | "level4";
  disable?: boolean;
  wrapperSx?: BoxProps["sx"];
  fontSize?: string;
  onClick?: () => void;
}

export function TokenPoolPrice({
  tokenA,
  tokenB,
  priceB,
  priceA,
  wrapperSx,
  background = "level4",
  fontSize = "12px",
  onClick,
}: TokenPoolPriceProps) {
  const theme = useTheme();

  return priceA && priceB ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: background === "level4" ? theme.palette.background.level4 : "none",
        cursor: "pointer",
        ...wrapperSx,
      }}
      onClick={onClick}
    >
      <TokenImage logo={tokenA?.logo} tokenId={tokenA?.address} size="18px" sx={{ margin: "0 6px 0 0" }} />

      <Typography color="text.primary" fontSize={fontSize}>
        1 {tokenA?.symbol} = {formatAmount(new BigNumber(priceA).dividedBy(priceB).toNumber())} {tokenB?.symbol}
      </Typography>
      <Typography color="text.primary" fontSize={fontSize}>
        &nbsp;= {formatDollarTokenPrice(priceA)}
      </Typography>
    </Box>
  ) : null;
}
