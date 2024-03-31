import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { formatAmount, toSignificant } from "@icpswap/utils";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import BigNumber from "bignumber.js";
import { TokenImage } from "components/index";

export interface TokenPoolPriceProps {
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  price0: number | undefined;
  price1: number | undefined;
  background?: "none" | "level4";
  disable?: boolean;
}

export function TokenPoolPrice({ token0, token1, price0, price1, background = "level4" }: TokenPoolPriceProps) {
  const theme = useTheme() as Theme;

  return price0 && price1 ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: background === "level4" ? theme.palette.background.level4 : "none",
        cursor: "pointer",
      }}
    >
      <TokenImage logo={token0?.logo} tokenId={token0?.canisterId} size="18px" sx={{ margin: "0 6px 0 0" }} />

      <Typography color="text.primary" fontSize="12px">
        1 {token0?.symbol} = {formatAmount(new BigNumber(price0).dividedBy(price1).toNumber(), 3)} {token1?.symbol}
      </Typography>
      <Typography color="text.primary" fontSize="12px">
        &nbsp;= ${toSignificant(price0, 3, { groupSeparator: "," })}
      </Typography>
    </Box>
  ) : null;
}
