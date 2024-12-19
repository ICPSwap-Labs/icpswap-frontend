import { useState, useMemo } from "react";
import { Typography, useTheme } from "components/Mui";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";

export interface PositionPriceRangeProps {
  position: Position | undefined;
  fontSize?: string;
  nameColor?: string;
}

export function PositionPriceRange({ position, nameColor, fontSize = "14px" }: PositionPriceRangeProps) {
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

  const pairName = useMemo(() => {
    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  return (
    <Flex
      gap="0 8px"
      sx={{
        cursor: "pointer",
        "@media(max-width: 640px)": {
          gap: "0 4px",
        },
      }}
      justify="flex-end"
      onClick={() => setManuallyInverted(!manuallyInverted)}
    >
      <Typography
        sx={{
          fontSize,
          color: "text.primary",
          "@media(max-width: 640px)": {
            fontSize: "12px",
          },
        }}
        component="div"
      >
        {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} -{formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)}{" "}
        <Typography
          sx={{
            fontSize,
            color: nameColor ?? "text.primary",
            "@media(max-width: 640px)": {
              fontSize: "12px",
            },
          }}
          component="span"
        >
          {pairName}
        </Typography>
      </Typography>

      <SyncAltIcon
        sx={{
          fontSize: "14px",
          color: theme.palette.text.secondary,
        }}
      />
    </Flex>
  );
}
