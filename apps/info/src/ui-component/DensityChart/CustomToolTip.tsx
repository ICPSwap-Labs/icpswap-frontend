import { GridAutoRows, RowBetween } from "ui-component/Grid/index";
import { Typography, Box } from "@mui/material";
import { Token } from "@icpswap/swap-sdk";
import { toSignificant, formatAmount } from "@icpswap/utils";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/styles";

interface CustomToolTipProps {
  chartProps: any;
  token0: Token | undefined;
  token1: Token | undefined;
  currentPrice: number | undefined;
}

export function CustomToolTip({ chartProps, token0, token1, currentPrice }: CustomToolTipProps) {
  const theme = useTheme() as Theme;

  const price0 = chartProps?.payload?.[0]?.payload.price0;
  const price1 = chartProps?.payload?.[0]?.payload.price1;
  const tvlToken0 = chartProps?.payload?.[0]?.payload.tvlToken0;
  const tvlToken1 = chartProps?.payload?.[0]?.payload.tvlToken1;

  return (
    <Box
      sx={{
        padding: "12px",
        width: "320px",
        opacity: 0.8,
        zIndex: "10",
        borderRadius: "12px",
        background: theme.palette.background.level3,
        border: `1px solid ${theme.palette.background.level4}`,
      }}
    >
      <GridAutoRows gap="20px 0">
        <Typography color="text.primary" fontSize="12px">
          Tick stats
        </Typography>

        <RowBetween>
          <Typography color="text.primary" fontSize="12px">
            {token0?.symbol} Price:{" "}
          </Typography>
          <Typography color="text.primary" fontSize="12px">
            {price0 ? toSignificant(price0, undefined, { groupSeparator: "," }) : ""} {token1?.symbol}
          </Typography>
        </RowBetween>

        <RowBetween>
          <Typography color="text.primary" fontSize="12px">
            {token1?.symbol} Price:{" "}
          </Typography>
          <Typography color="text.primary" fontSize="12px">
            {price1 ? toSignificant(price1, undefined, { groupSeparator: "," }) : ""} {token0?.symbol}
          </Typography>
        </RowBetween>
        {currentPrice && price0 && currentPrice > price1 ? (
          <RowBetween>
            <Typography color="text.primary" fontSize="12px">
              {token0?.symbol} Locked:{" "}
            </Typography>
            <Typography color="text.primary" fontSize="12px">
              {tvlToken0 ? formatAmount(tvlToken0) : ""} {token0?.symbol}
            </Typography>
          </RowBetween>
        ) : (
          <RowBetween>
            <Typography color="text.primary" fontSize="12px">
              {token1?.symbol} Locked:{" "}
            </Typography>
            <Typography color="text.primary" fontSize="12px">
              {tvlToken1 ? formatAmount(tvlToken1) : ""} {token1?.symbol}
            </Typography>
          </RowBetween>
        )}
      </GridAutoRows>
    </Box>
  );
}
