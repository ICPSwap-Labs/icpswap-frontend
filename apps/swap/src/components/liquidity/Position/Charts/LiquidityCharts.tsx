import { useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { Position, nearestUsableTick, TICK_SPACINGS, TickMath } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { usePositionPricePeriodRange } from "@icpswap/hooks";
import { PoolCurrentPrice } from "components/swap/index";
import { PositionPriceRange } from "components/liquidity/index";
import { Trans } from "@lingui/macro";
import { SWAP_CHART_CURRENT_PRICE_COLOR, SWAP_CHART_RANGE_PRICE_COLOR, Bound } from "constants/swap";
import { PositionChartTimes } from "types/swap";
import { isNullArgs } from "@icpswap/utils";

import PriceRangeChart from "./RangeCharts";

export interface LiquidityChartsProps {
  position: Position;
  time: PositionChartTimes;
}

export function LiquidityCharts({ position, time }: LiquidityChartsProps) {
  const pool = position.pool;
  const { token0, token1, fee } = pool;

  const isSorted = token0 && token1 && token0.sortsBefore(token1);

  const leftPrice = isSorted ? position.token0PriceLower : position.token0PriceUpper.invert();
  const rightPrice = isSorted ? position.token0PriceUpper : position.token0PriceLower.invert();
  const currentPrice = isSorted
    ? position.pool.token0Price.toFixed(position.pool.token0.decimals)
    : position.pool.token1Price.toFixed(position.pool.token1.decimals);

  const { result: periodPriceRange } = usePositionPricePeriodRange(pool.id);

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

  const { poolPriceLower, poolPriceUpper } = useMemo(() => {
    if (isNullArgs(periodPriceRange)) return {};

    if (time === PositionChartTimes["24H"]) {
      return { poolPriceLower: periodPriceRange.priceLow24H, poolPriceUpper: periodPriceRange.priceHigh24H };
    }

    if (time === PositionChartTimes["7D"]) {
      return { poolPriceLower: periodPriceRange.priceLow7D, poolPriceUpper: periodPriceRange.priceHigh7D };
    }

    return { poolPriceLower: periodPriceRange.priceLow30D, poolPriceUpper: periodPriceRange.priceHigh30D };
  }, [periodPriceRange, time]);

  return (
    <>
      <PriceRangeChart
        priceLower={leftPrice}
        priceUpper={rightPrice}
        currencyA={token0}
        currencyB={token1}
        price={currentPrice}
        ticksAtLimit={ticksAtLimit}
        poolPriceLower={poolPriceLower}
        poolPriceUpper={poolPriceUpper}
      />

      <Flex vertical gap="16px 0" align="flex-start" sx={{ margin: "10px" }}>
        <Flex gap="8px 3px" wrap="wrap">
          <Flex gap="0 12px">
            <Box sx={{ background: SWAP_CHART_CURRENT_PRICE_COLOR, width: "8px", height: "2px" }} />

            <Typography fontSize="12px">
              <Trans>Current Price:</Trans>
            </Typography>
          </Flex>

          <PoolCurrentPrice pool={position.pool} showInverted />
        </Flex>

        <Flex gap="8px 3px" wrap="wrap">
          <Flex gap="0 12px">
            <Box sx={{ background: SWAP_CHART_RANGE_PRICE_COLOR, width: "8px", height: "2px" }} />

            <Typography fontSize="12px">
              <Trans>Position Price Range:</Trans>
            </Typography>
          </Flex>

          <PositionPriceRange position={position} fontSize="12px" nameColor="text.secondary" />
        </Flex>
      </Flex>
    </>
  );
}
