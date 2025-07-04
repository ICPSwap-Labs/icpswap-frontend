import { useCallback, useMemo, useState } from "react";
import { Position, nearestUsableTick, TICK_SPACINGS, TickMath } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { usePoolPricePeriodRange } from "@icpswap/hooks";
import { Bound } from "constants/swap";
import { ChartTimeEnum, Null } from "@icpswap/types";
import { isUndefinedOrNull, BigNumber } from "@icpswap/utils";
import { PriceRangeLabel } from "components/liquidity/PriceRangeLabel";
import { CurrentPriceLabelForChart } from "components/liquidity/CurrentPriceLabelForChart";

import PriceRangeChart from "./RangeCharts";

export interface LiquidityChartsProps {
  position: Position;
  time: ChartTimeEnum;
}

export function LiquidityCharts({ position, time }: LiquidityChartsProps) {
  const [inverted, setInverted] = useState(false);

  const pool = position.pool;
  const { token0, token1, fee } = pool;

  const { leftPrice, rightPrice, currentPrice } = useMemo(() => {
    const leftPrice = !inverted
      ? position.token0PriceLower.toSignificant()
      : position.token0PriceUpper.invert().toSignificant();
    const rightPrice = !inverted
      ? position.token0PriceUpper.toSignificant()
      : position.token0PriceLower.invert().toSignificant();
    const currentPrice = !inverted
      ? position.pool.token0Price.toFixed(position.pool.token0.decimals)
      : position.pool.token1Price.toFixed(position.pool.token1.decimals);

    return {
      leftPrice,
      rightPrice,
      currentPrice,
    };
  }, [inverted, position]);

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

  const { poolPriceLower, poolPriceUpper } = useMemo(() => {
    if (isUndefinedOrNull(periodPriceRange)) return {};

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

  const handleInverted = useCallback(
    (inverted: boolean) => {
      setInverted(inverted);
    },
    [setInverted],
  );

  const [liquidityChartTokenA, liquidityChartTokenB] = useMemo(() => {
    return inverted ? [token1, token0] : [token0, token1];
  }, [token0, token1, inverted]);

  return (
    <>
      <PriceRangeChart
        priceLower={leftPrice}
        priceUpper={rightPrice}
        currencyA={liquidityChartTokenA}
        currencyB={liquidityChartTokenB}
        price={currentPrice}
        ticksAtLimit={ticksAtLimit}
        poolPriceLower={poolPriceLower}
        poolPriceUpper={poolPriceUpper}
      />

      <Flex vertical gap="16px 0" align="flex-start" sx={{ margin: "10px" }}>
        <CurrentPriceLabelForChart pool={position.pool} showInverted onInverted={handleInverted} />

        <PriceRangeLabel poolPriceLower={poolPriceLower} poolPriceUpper={poolPriceUpper} chartTime={time} />
      </Flex>
    </>
  );
}
