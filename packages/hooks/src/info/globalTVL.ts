import { useCallback } from "react";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { globalTVL } from "@icpswap/actor";
import { TvlChartDayData } from "@icpswap/types";

export async function getPoolChartTvl(
  id: string,
  pool: string,
  offset: number,
  limit: number
) {
  return resultFormat<TvlChartDayData[]>(
    await (
      await globalTVL(id)
    ).getPoolChartTvl(pool, BigInt(offset), BigInt(limit))
  ).data;
}

export function usePoolChartTvl(
  id: string | undefined,
  pool: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!id || !pool || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getPoolChartTvl(id!, pool!, offset, limit);
    }, [id, pool, offset, limit])
  );
}

export async function getTokenChartTvl(
  id: string,
  token: string,
  offset: number,
  limit: number
) {
  return resultFormat<TvlChartDayData[]>(
    await (
      await globalTVL(id)
    ).getTokenChartTvl(token, BigInt(offset), BigInt(limit))
  ).data;
}

export function useTokenChartTvl(
  id: string | undefined,
  token: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!id || !token || !isAvailablePageArgs(offset, limit))
        return undefined;
      return await getTokenChartTvl(id!, token!, offset, limit);
    }, [id, token, offset, limit])
  );
}
