import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import { useCallback } from "react";
import type { Null, PriceIndex, PositionValue, PositionFees, PositionAPR, PoolApr, PoolAprIndex } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getPoolPricePeriodRange(poolId: string) {
  const result = await icpswap_fetch_post<PriceIndex>("/swap/pool/price/index", { pid: poolId });
  return result?.data;
}

export function usePoolPricePeriodRange(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return await getPoolPricePeriodRange(poolId);
    }, [poolId]),
  );
}

export async function getPositionValueChartData(poolId: string, positionId: bigint) {
  const result = await icpswap_fetch_post<Array<PositionValue>>("/swap/position/value/line", {
    poolId,
    positionId: positionId.toString(),
  });

  return result?.data;
}

export function usePositionValueChartData(poolId: string | Null, positionId: bigint | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId) || isUndefinedOrNull(positionId)) return undefined;
      return await getPositionValueChartData(poolId, positionId);
    }, [poolId, positionId]),
  );
}

export async function getPositionFeesChartData(poolId: string, positionId: bigint) {
  const result = await icpswap_fetch_post<Array<PositionFees>>("/swap/position/fee/line", {
    poolId,
    positionId: positionId.toString(),
  });

  return result?.data;
}

export function usePositionFeesChartData(poolId: string | Null, positionId: bigint | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId) || isUndefinedOrNull(positionId)) return undefined;
      return await getPositionFeesChartData(poolId, positionId);
    }, [poolId, positionId]),
  );
}

export async function getPositionAPRChartData(poolId: string, positionId: bigint) {
  const result = await icpswap_fetch_post<Array<PositionAPR>>("/swap/position/apr/line", {
    poolId,
    positionId: positionId.toString(),
  });
  return result.data;
}

export function usePositionAPRChartData(poolId: string | Null, positionId: bigint | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId) || isUndefinedOrNull(positionId)) return undefined;
      return await getPositionAPRChartData(poolId, positionId);
    }, [poolId, positionId]),
  );
}

export async function getPoolAPRChartData(poolId: string | Null) {
  const result = await icpswap_fetch_post<Array<PoolApr>>("/swap/pool/apr/line", { pid: poolId });
  return result.data;
}

export function usePoolAPRChartData(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId)) return undefined;
      return await getPoolAPRChartData(poolId);
    }, [poolId]),
  );
}

export async function getPoolAPRs(poolId: string) {
  const result = await icpswap_fetch_post<PoolAprIndex>("/swap/pool/apr/index", { pid: poolId });
  return result.data;
}

export function usePoolAPRs(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(poolId)) return undefined;
      return await getPoolAPRs(poolId);
    }, [poolId]),
  );
}
