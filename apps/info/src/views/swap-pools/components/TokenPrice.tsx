import { Typography, Box, Avatar } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { formatAmount, toSignificant } from "@icpswap/utils";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import BigNumber from "bignumber.js";

export interface TokenPoolPriceProps {
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  price0: number | undefined;
  price1: number | undefined;
}

export default function TokenPoolPrice({ token0, token1, price0, price1 }: TokenPoolPriceProps) {
  const theme = useTheme() as Theme;
  const history = useHistory();

  const handleClick = () => {
    history.push(`/swap/token/details/${token0?.canisterId}`);
  };

  return price0 && price1 ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Avatar src={token0?.logo} sx={{ width: "18px", height: "18px", marginRight: "6px" }}>
        &nbsp;
      </Avatar>
      <Typography color="text.primary" fontWeight={500}>
        1 {token0?.symbol} = {formatAmount(new BigNumber(price0).dividedBy(price1).toNumber(), 4)} {token1?.symbol}
      </Typography>
      <Typography color="text.primary" fontWeight={500}>
        &nbsp;= ${toSignificant(price0, 6, { groupSeparator: "," })}
      </Typography>
    </Box>
  ) : null;
}
