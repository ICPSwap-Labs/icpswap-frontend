import { useMemo } from "react";
import { Typography } from "components/Mui";
import { Flex, MainCard } from "@icpswap/ui";
import { Trans } from "@lingui/macro";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import { getPriceOrderingFromPositionForUI, useInverter, Position } from "@icpswap/swap-sdk";
import { Bound } from "constants/swap";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";

import PositionRangeState from "./PositionState";

export interface UnStakingModalProps {
  position: Position | undefined;
  positionId: bigint;
}

export function PositionCard({ position, positionId }: UnStakingModalProps) {
  const { token0, token1, outOfRange, token0Amount, token1Amount, pool, tickLower, tickUpper } = useMemo(() => {
    const pool = position?.pool;
    const tickUpper = position?.tickUpper;
    const tickLower = position?.tickLower;

    const token0 = pool?.token0;
    const token1 = pool?.token1;

    const token0Amount = position?.amount0.toSignificant(8);
    const token1Amount = position?.amount1.toSignificant(8);

    const outOfRange =
      pool && (tickUpper || tickUpper === 0) && (tickLower || tickLower === 0)
        ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper
        : false;

    return {
      pool: position?.pool,
      tickUpper,
      tickLower,
      token0,
      token1,
      token0Amount,
      token1Amount,
      outOfRange,
    };
  }, [position]);

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: false,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const pairName = useMemo(() => {
    if (!currencyQuote || !currencyBase) return undefined;

    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  const _tickAtLimit = useIsTickAtLimit(pool?.fee, tickLower, tickUpper);

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  return (
    <MainCard level={2} padding="16px">
      <Flex vertical gap="16px 0" align="flex-start">
        <Flex fullWidth justify="space-between">
          <Typography sx={{ fontWeight: 500, color: "text.primary" }}>
            {token0 && token1 ? `${token0.symbol}/${token1.symbol}(#${positionId.toString()})` : "--"}
          </Typography>

          <PositionRangeState outOfRange={outOfRange} />
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-end">
          <Typography>
            <Trans>{token0 ? token0.symbol : "--"} Amount</Trans>
          </Typography>

          <Typography color="text.primary">
            <>{token0 && token0Amount ? `${token0Amount} ${token0.symbol}` : "--"}</>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-end">
          <Typography>
            <Trans>{token1 ? token1.symbol : "--"} Amount</Trans>
          </Typography>

          <Typography color="text.primary">
            <>{token1 && token1Amount ? `${token1Amount} ${token1.symbol}` : "--"}</>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-end">
          <Typography>
            <Trans>Current Price</Trans>
          </Typography>

          <Typography color="text.primary">
            {!!token1 && !!token0 && pool
              ? pool.priceOf(token1)
                ? `${pool.priceOf(token1).toSignificant(6, { groupSeparator: "," })} ${pairName}`
                : "--"
              : "--"}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-end">
          <Typography>
            <Trans>Price Range</Trans>
          </Typography>

          <Typography color="text.primary">
            {`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} - ${formatTickPrice(
              priceUpper,
              tickAtLimit,
              Bound.UPPER,
            )} ${pairName}`}
          </Typography>
        </Flex>
      </Flex>
    </MainCard>
  );
}
