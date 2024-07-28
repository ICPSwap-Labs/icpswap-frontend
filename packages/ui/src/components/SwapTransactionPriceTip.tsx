import { Typography, Box, useTheme, Tooltip } from "@mui/material";
import { formatDollarAmount } from "@icpswap/utils";

export interface SwapTransactionPriceTipProps {
  price: number | string;
  symbol: string;
}

export function SwapTransactionPriceTip({ price, symbol }: SwapTransactionPriceTipProps) {
  const theme = useTheme();

  return (
    <Tooltip
      PopperProps={{
        // @ts-ignore
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
            1 {symbol} = {formatDollarAmount(price)}
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
        }}
        component="span"
      >
        {symbol}
      </Typography>
    </Tooltip>
  );
}
