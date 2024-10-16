import { isNullArgs, parseTokenAmount, resultFormat } from "@icpswap/utils";
import { useCallback, useMemo } from "react";
import { type Null, type PositionChartData, type PositionPricePeriodRange } from "@icpswap/types";
import { Pool, Token } from "@icpswap/swap-sdk";
import { positionCharts } from "@icpswap/actor";

import { Principal } from "@dfinity/principal";
import { useInfoAllTokens } from "../info";
import { useTokenBalance } from "../token";
import { useCallsData } from "../useCallData";

// export async function getPositionChartsData(poolId: string, positionId: bigint, offset: number, limit: number) {
//   const result = await (await positionCharts()).getPositionIndex(poolId, positionId);
//   return resultFormat<PoolMetadata>(result).data;
// }

// export function usePositionChartsData({ pool }: UsePoolTVLValueProps): string | undefined {
//   return useCallsData(useCallback(async () => {
//     return awati getPositionChartsData()
//   } ,[]))
// }

export async function getPositionPricePeriodRange(poolId: string) {
  const result = await (await positionCharts()).getPriceIndex(Principal.fromText(poolId));
  return resultFormat<PositionPricePeriodRange>(result).data;
}

export function usePositionPricePeriodRange(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return await getPositionPricePeriodRange(poolId);
    }, [poolId]),
  );
}
