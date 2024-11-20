import { useCallback, useMemo, useState } from "react";
import { Box, Typography } from "components/Mui";
import { Position, nearestUsableTick, TICK_SPACINGS, TickMath } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { usePoolPricePeriodRange } from "@icpswap/hooks";
import { PoolCurrentPrice } from "components/swap/index";
import { Trans } from "@lingui/macro";
import { SWAP_CHART_CURRENT_PRICE_COLOR, SWAP_CHART_RANGE_PRICE_COLOR, Bound } from "constants/swap";
import { ChartTimeEnum, Null } from "@icpswap/types";
import { isNullArgs, nonNullArgs, toSignificantWithGroupSeparator, BigNumber } from "@icpswap/utils";

import PriceRangeChart from "./RangeCharts";

export interface LiquidityChartsProps {
  position: Position;
  time: ChartTimeEnum;
}

export function LiquidityCharts({ position, time }: LiquidityChartsProps) {
  const [inverted, setInverted] = useState(false);

  const pool = position.pool;
  const { token0, token1, fee } = pool;

  const isSorted = token0 && token1 && token0.sortsBefore(token1);

  const leftPrice = isSorted ? position.token0PriceLower : position.token0PriceUpper.invert();
  const rightPrice = isSorted ? position.token0PriceUpper : position.token0PriceLower.invert();
  const currentPrice = isSorted
    ? position.pool.token0Price.toFixed(position.pool.token0.decimals)
    : position.pool.token1Price.toFixed(position.pool.token1.decimals);

  const { result: periodPriceRange } = usePoolPricePeriodRange(pool.id);

  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[fee]),
      [Bound.UPPER]: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[fee]),
    }),
    [fee],
  );

  const ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: position.tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: position.tickUpper === tickSpaceLimits.UPPER,
    }),
    [tickSpaceLimits, position],
  );

  const { poolPriceLower, poolPriceUpper, sortedPoolPriceLower, sortedPoolPriceUpper } = useMemo(() => {
    if (isNullArgs(periodPriceRange)) return {};

    let poolPriceLower: number | string | Null = null;
    let poolPriceUpper: number | string | Null = null;

    if (time === ChartTimeEnum["24H"]) {
      poolPriceLower = periodPriceRange.priceLow24H;
      poolPriceUpper = periodPriceRange.priceHigh24H;
    } else if (time === ChartTimeEnum["7D"]) {
      poolPriceLower = periodPriceRange.priceLow7D;
      poolPriceUpper = periodPriceRange.priceHigh7D;
    } else {
      poolPriceLower = periodPriceRange.priceLow30D;
      poolPriceUpper = periodPriceRange.priceHigh30D;
    }

    return {
      sortedPoolPriceLower: poolPriceLower,
      poolPriceLower: !inverted
        ? poolPriceLower
        : poolPriceLower
        ? poolPriceUpper
          ? new BigNumber(1).dividedBy(poolPriceUpper).toString()
          : null
        : null,
      sortedPoolPriceUpper: poolPriceUpper,
      poolPriceUpper: !inverted
        ? poolPriceUpper
        : poolPriceUpper
        ? poolPriceLower
          ? new BigNumber(1).dividedBy(poolPriceLower).toString()
          : null
        : null,
    };
  }, [periodPriceRange, inverted, time]);

  const handleInverted = useCallback((inverted: boolean) => {
    setInverted(inverted);
  }, []);

  return (
    <>
      <PriceRangeChart
        priceLower={leftPrice}
        priceUpper={rightPrice}
        currencyA={token0}
        currencyB={token1}
        price={currentPrice}
        ticksAtLimit={ticksAtLimit}
        poolPriceLower={sortedPoolPriceLower}
        poolPriceUpper={sortedPoolPriceUpper}
      />

      <Flex vertical gap="16px 0" align="flex-start" sx={{ margin: "10px" }}>
        <Flex gap="8px 3px" wrap="wrap">
          <Flex gap="0 12px">
            <Box sx={{ background: SWAP_CHART_CURRENT_PRICE_COLOR, width: "8px", height: "2px" }} />

            <Typography fontSize="12px">
              <Trans>Current Price:</Trans>
            </Typography>
          </Flex>

          <PoolCurrentPrice pool={position.pool} showInverted onInverted={handleInverted} />
        </Flex>

        <Flex gap="8px 3px" wrap="wrap">
          <Flex gap="0 12px">
            <Box sx={{ background: SWAP_CHART_RANGE_PRICE_COLOR, width: "8px", height: "2px" }} />

            <Typography fontSize="12px" sx={{ lineHeight: "16px" }}>
              <Trans>{time} Price Range:</Trans>&nbsp;
            </Typography>
          </Flex>

          <Typography sx={{ color: "text.primary", fontSize: "12px" }}>
            {nonNullArgs(poolPriceLower) && nonNullArgs(poolPriceUpper)
              ? `${toSignificantWithGroupSeparator(poolPriceLower, 6)} - ${toSignificantWithGroupSeparator(
                  poolPriceUpper,
                  6,
                )}`
              : "--"}
          </Typography>
        </Flex>
      </Flex>
    </>
  );
}
