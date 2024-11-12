import { formatDollarAmountV1 } from "@icpswap/utils";

import { Typography, Box, useTheme, Tooltip, TypographyProps } from "./Mui";

export interface SwapTransactionPriceTipProps {
  price: number | string;
  symbol: string;
  symbolSx?: TypographyProps["sx"];
}

export function SwapTransactionPriceTip({ price, symbol, symbolSx }: SwapTransactionPriceTipProps) {
  const theme = useTheme();

  return (
    <Tooltip
      PopperProps={{
        sx: {
          "& .MuiTooltip-tooltip": {
            padding: "12px",
          },
        },
      }}
      title={
        <Box>
          <Typography fontSize={12}>Trade Price</Typography>
          <Typography color="#111936" sx={{ margin: "6px 0 0 0" }}>
            1 {symbol} = {formatDollarAmountV1({ num: price })}
          </Typography>
        </Box>
      }
      arrow
      placement="top"
    >
      <Typography
        sx={{
          color: theme.palette.text.primary,
          fontSize: "16px",
          fontWeight: 500,
          textUnderlineOffset: "2px",
          textDecorationLine: "underline",
          textDecorationStyle: "dotted",
          textDecorationColor: theme.palette.text.secondary,
          ...symbolSx,
        }}
        component="span"
      >
        {symbol}
      </Typography>
    </Tooltip>
  );
}
