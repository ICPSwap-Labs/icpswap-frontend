import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import type { Null, PriceIndex, PositionValue, PositionFees, PositionAPR, PoolApr, PoolAprIndex } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getPoolPricePeriodRange(poolId: string) {
  const result = await icpswap_fetch_post<PriceIndex>("/swap/pool/price/index", { pid: poolId });
  return result?.data;
}

export function usePoolPricePeriodRange(poolId: string | Null): UseQueryResult<PriceIndex | undefined, Error> {
  return useQuery({
    queryKey: ["usePoolPricePeriodRange", poolId],
    queryFn: async () => {
      if (!poolId) return undefined;
      return await getPoolPricePeriodRange(poolId);
    },
    enabled: !!poolId,
  });
}

export async function getPositionValueChartData(poolId: string, positionId: bigint) {
  const result = await icpswap_fetch_post<Array<PositionValue>>("/swap/position/value/line", {
    poolId,
    positionId: positionId.toString(),
  });

  return result?.data;
}

export function usePositionValueChartData(
  poolId: string | Null,
  positionId: bigint | Null,
): UseQueryResult<PositionValue[] | undefined, Error> {
  return useQuery({
    queryKey: ["usePositionValueChartData", poolId, positionId],
    queryFn: async () => {
      if (isUndefinedOrNull(poolId) || isUndefinedOrNull(positionId)) return undefined;
      return await getPositionValueChartData(poolId, positionId);
    },
    enabled: !isUndefinedOrNull(poolId) && !isUndefinedOrNull(positionId),
  });
}

export async function getPositionFeesChartData(poolId: string, positionId: bigint) {
  const result = await icpswap_fetch_post<Array<PositionFees>>("/swap/position/fee/line", {
    poolId,
    positionId: positionId.toString(),
  });

  return result?.data;
}

export function usePositionFeesChartData(
  poolId: string | Null,
  positionId: bigint | Null,
): UseQueryResult<PositionFees[] | undefined, Error> {
  return useQuery({
    queryKey: ["usePositionFeesChartData", poolId, positionId],
    queryFn: async () => {
      if (isUndefinedOrNull(poolId) || isUndefinedOrNull(positionId)) return undefined;
      return await getPositionFeesChartData(poolId, positionId);
    },
    enabled: !isUndefinedOrNull(poolId) && !isUndefinedOrNull(positionId),
  });
}

export async function getPositionAPRChartData(poolId: string, positionId: bigint) {
  const result = await icpswap_fetch_post<Array<PositionAPR>>("/swap/position/apr/line", {
    poolId,
    positionId: positionId.toString(),
  });
  return result.data;
}

export function usePositionAPRChartData(
  poolId: string | Null,
  positionId: bigint | Null,
): UseQueryResult<PositionAPR[] | undefined, Error> {
  return useQuery({
    queryKey: ["usePositionAPRChartData", poolId, positionId],
    queryFn: async () => {
      if (isUndefinedOrNull(poolId) || isUndefinedOrNull(positionId)) return undefined;
      return await getPositionAPRChartData(poolId, positionId);
    },
    enabled: !isUndefinedOrNull(poolId) && !isUndefinedOrNull(positionId),
  });
}

export async function getPoolAPRChartData(poolId: string | Null) {
  const result = await icpswap_fetch_post<Array<PoolApr>>("/swap/pool/apr/line", { pid: poolId });
  return result.data;
}

export function usePoolAPRChartData(poolId: string | Null): UseQueryResult<PoolApr[] | undefined, Error> {
  return useQuery({
    queryKey: ["usePoolAPRChartData", poolId],
    queryFn: async () => {
      if (isUndefinedOrNull(poolId)) return undefined;
      return await getPoolAPRChartData(poolId);
    },
    enabled: !isUndefinedOrNull(poolId),
  });
}

export async function getPoolAverageAPRs(poolId: string) {
  const result = await icpswap_fetch_post<PoolAprIndex>("/swap/pool/apr/index", { pid: poolId });
  return result?.data;
}

export function usePoolAverageAPRs(poolId: string | Null): UseQueryResult<PoolAprIndex | undefined, Error> {
  return useQuery({
    queryKey: ["usePoolAverageAPRs", poolId],
    queryFn: async () => {
      if (isUndefinedOrNull(poolId)) return undefined;
      return await getPoolAverageAPRs(poolId);
    },
    enabled: !isUndefinedOrNull(poolId),
  });
}
