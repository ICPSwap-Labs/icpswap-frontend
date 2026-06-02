import { useLiquidityTickInfos, useSwapPool } from "@icpswap/hooks";
import { type FeeAmount, type Token, tickToPrice } from "@icpswap/swap-sdk";
import type { PoolMetadata } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import JSBI from "jsbi";
import { useMemo } from "react";
import { computeSurroundingTicks, type TickProcessed } from "utils/swap/computeSurroundingTicks";

const PRICE_FIXED_DIGITS = 18;

const FEE_TIER_TO_TICK_SPACING = (feeTier: string): number => {
  switch (feeTier) {
    case "10000":
      return 200;
    case "3000":
      return 60;
    case "500":
      return 10;
    case "100":
      return 1;
    default:
      throw Error(`Tick spacing for fee tier ${feeTier} undefined.`);
  }
};

export function useAllTicks(token0: Token | undefined, token1: Token | undefined, feeAmount: FeeAmount | undefined) {
  const args = useMemo(() => {
    if (!token0 || !token1 || !feeAmount) return undefined;
    return {
      token0: { address: token0.address, standard: token0.standard },
      token1: { address: token1.address, standard: token1.standard },
      fee: BigInt(feeAmount),
      sqrtPriceX96: "0",
    };
  }, [token0, token1, feeAmount]);

  const { data: poolData } = useSwapPool(args);

  const id = useMemo(() => {
    if (!poolData) return undefined;
    return poolData.canisterId.toString();
  }, [poolData]);

  return useLiquidityTickInfos(id, 100);
}

export type { TickProcessed };

function getActiveTick({
  tickCurrent,
  feeAmount,
  tickSpacing,
}: {
  tickCurrent?: number;
  feeAmount?: FeeAmount;
  tickSpacing?: number;
}): number | undefined {
  return tickCurrent !== undefined && feeAmount !== undefined && tickSpacing
    ? Math.floor(tickCurrent / tickSpacing) * tickSpacing
    : undefined;
}

export interface PoolTickData {
  ticksProcessed: TickProcessed[];
  feeTier: string;
  tickSpacing: number;
  activeTickIdx: number;
}

export interface UseTicksSurroundingPriceProps {
  loading?: boolean;
  error?: boolean;
  liquidity?: JSBI;
  sqrtPriceX96?: JSBI;
  currentTick?: bigint;
  activeTick?: number;
  data?: TickProcessed[];
}

export function useTicksSurroundingPrice(pool: PoolMetadata | undefined): UseTicksSurroundingPriceProps {
  const { fee: feeAmount, token0: _token0, token1: _token1 } = pool ?? {};

  const [, token0] = useToken(_token0?.address);
  const [, token1] = useToken(_token1?.address);

  const liquidity = pool?.liquidity;
  const sqrtPriceX96 = pool?.sqrtPriceX96;

  const tickSpacingWithFallback = feeAmount ? FEE_TIER_TO_TICK_SPACING(String(feeAmount)) : undefined;

  const currentTick = pool?.tick;
  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(
    () =>
      getActiveTick({
        tickCurrent: currentTick ? Number(currentTick) : undefined,
        feeAmount: feeAmount ? Number(feeAmount) : undefined,
        tickSpacing: tickSpacingWithFallback,
      }),
    [currentTick, feeAmount, tickSpacingWithFallback],
  );

  const { data: initializedTicks, isLoading: loading } = useAllTicks(token0, token1, Number(feeAmount));

  const ticks = useMemo(() => {
    if (!initializedTicks) return undefined;

    return initializedTicks.sort((a, b) => {
      if (a.tickIndex < b.tickIndex) return -1;
      if (a.tickIndex > b.tickIndex) return 1;
      return 0;
    });
  }, [initializedTicks]);

  return useMemo(() => {
    if (loading) {
      return {
        loading,
        error: false,
      };
    }

    if (
      !token0 ||
      !token1 ||
      !liquidity ||
      !initializedTicks ||
      activeTick === undefined ||
      !ticks ||
      ticks.length === 0
    )
      return { loading: false, data: undefined };

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex((tickData) => tickData?.tickIndex && Number(tickData.tickIndex) > activeTick) - 1;

    if (pivot < 0) {
      return {
        loading: false,
        error: false,
        activeTick,
        data: undefined,
      };
    }

    let sdkPrice;
    try {
      sdkPrice = tickToPrice(token0 as Token, token1 as Token, activeTick);
    } catch (e) {
      console.warn("Error computing price from tick", e);
      return {
        loading: false,
        activeTick,
        data: undefined,
      };
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: JSBI.BigInt(liquidity?.toString()),
      tick: activeTick,
      liquidityNet: JSBI.BigInt(ticks[pivot]?.liquidityNet.toString() ?? 0),
      price0: sdkPrice.toFixed(PRICE_FIXED_DIGITS),
      price1: sdkPrice.invert().toFixed(PRICE_FIXED_DIGITS),
      sdkPrice,
    };

    const subsequentTicks = computeSurroundingTicks({
      token0,
      token1,
      activeTickProcessed,
      sortedTickData: ticks,
      pivot,
      ascending: true,
    });

    const previousTicks = computeSurroundingTicks({
      token0,
      token1,
      activeTickProcessed,
      sortedTickData: ticks,
      pivot,
      ascending: false,
    });

    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks);

    return {
      loading: false,
      currentTick,
      activeTick,
      liquidity: JSBI.BigInt(liquidity.toString() ?? 0),
      sqrtPriceX96: JSBI.BigInt(sqrtPriceX96?.toString() ?? 0),
      data: ticksProcessed,
    };
  }, [liquidity, sqrtPriceX96, token0, token1, initializedTicks, loading, ticks, activeTick, currentTick]);
}
