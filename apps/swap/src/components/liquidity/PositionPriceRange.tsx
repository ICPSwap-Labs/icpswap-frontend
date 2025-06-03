import { useState, useMemo } from "react";
import { Box, BoxProps, Typography, useTheme } from "components/Mui";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";

export interface PositionPriceRangeProps {
  position: Position | undefined;
  fontSize?: string;
  smallFontSize?: string;
  nameColor?: string;
  arrowColor?: "primary" | "secondary";
  arrow?: boolean;
  color?: "text.primary" | "text.secondary" | "inherit";
  wrapperSx?: BoxProps["sx"];
}

export function PositionPriceRange({
  position,
  fontSize = "14px",
  smallFontSize = "12px",
  arrowColor,
  arrow = true,
  color = "text.primary",
  wrapperSx,
}: PositionPriceRangeProps) {
  const theme = useTheme();

  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { pool, tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

  const _tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper);
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: manuallyInverted,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  return (
    <Box sx={{ cursor: "pointer", ...wrapperSx }} onClick={() => setManuallyInverted(!manuallyInverted)}>
      <Typography
        sx={{
          fontSize,
          color,
          "@media(max-width: 640px)": {
            fontSize: smallFontSize,
          },
        }}
        component="span"
      >
        {`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} - ${formatTickPrice(
          priceUpper,
          tickAtLimit,
          Bound.UPPER,
        )} ${tokenSymbolEllipsis({ symbol: currencyQuote?.symbol })} per ${tokenSymbolEllipsis({
          symbol: currencyBase?.symbol,
        })}`}
      </Typography>

      {arrow ? (
        <SyncAltIcon
          sx={{
            fontSize: fontSize === "inherit" ? 14 : parseInt(fontSize),
            cursor: "pointer",
            color: arrowColor === "primary" ? theme.palette.text.primary : theme.palette.text.secondary,
            margin: "0 0 0 4px",
            verticalAlign: "middle",
          }}
        />
      ) : null}
    </Box>
  );
}
