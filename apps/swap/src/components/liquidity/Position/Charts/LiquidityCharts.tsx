import { Box, Typography } from "components/Mui";
import { Position } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { usePositionPricePeriodRange } from "@icpswap/hooks";
import { useTicksAtLimitInvert } from "hooks/swap/usePriceInvert";
import { PoolCurrentPrice } from "components/swap/index";
import { PositionPriceRange } from "components/liquidity/index";
import { Trans } from "@lingui/macro";
import { SWAP_CHART_CURRENT_PRICE_COLOR, SWAP_CHART_RANGE_PRICE_COLOR } from "constants/swap";

import PriceRangeChart from "./RangeCharts";

export interface LiquidityChartsProps {
  position: Position;
}

export function LiquidityCharts({ position }: LiquidityChartsProps) {
  const pool = position.pool;
  const { token0, token1 } = pool;

  const isSorted = token0 && token1 && token0.sortsBefore(token1);

  const leftPrice = isSorted ? position.token0PriceLower : position.token0PriceUpper.invert();
  const rightPrice = isSorted ? position.token0PriceUpper : position.token0PriceLower.invert();
  const currentPrice = isSorted ? position.pool.token0Price.toFixed() : position.pool.token1Price.toFixed();

  const ticksAtLimit = useTicksAtLimitInvert({
    position,
  });

  const { result: periodPriceRange } = usePositionPricePeriodRange(pool.id);

  return (
    <>
      <PriceRangeChart
        priceLower={leftPrice}
        priceUpper={rightPrice}
        ticksAtLimit={ticksAtLimit}
        currencyA={token0}
        currencyB={token1}
        price={currentPrice}
        interactive
        periodPriceRange={periodPriceRange}
      />

      <Flex vertical gap="10px 0" align="flex-start" sx={{ margin: "10px" }}>
        <Flex gap="0 12px">
          <Box sx={{ background: SWAP_CHART_CURRENT_PRICE_COLOR, width: "8px", height: "2px" }} />

          <Flex gap="0 3px">
            <Typography fontSize="12px">
              <Trans>Current Price:</Trans>
            </Typography>

            <PoolCurrentPrice pool={position.pool} showInverted />
          </Flex>
        </Flex>

        <Flex gap="0 12px">
          <Box sx={{ background: SWAP_CHART_RANGE_PRICE_COLOR, width: "8px", height: "2px" }} />

          <Flex gap="0 3px">
            <Typography fontSize="12px">
              <Trans>Position Price Range:</Trans>
            </Typography>

            <PositionPriceRange position={position} fontSize="12px" />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
