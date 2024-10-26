import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { poolStorage } from "@icpswap/actor";
import { PublicPoolOverView, PublicPoolChartDayData, PoolStorageTransaction } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getInfoPool(storageId: string, poolId: string) {
  return resultFormat<PublicPoolOverView>(await (await poolStorage(storageId)).getPool(poolId)).data;
}

export function useInfoPool(storageId: string | undefined, poolId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId || !storageId) return undefined;
      return await getInfoPool(storageId, poolId);
    }, [storageId, poolId]),
  );
}

export async function getInfoPoolChartData(storageId: string, poolId: string, offset: number, limit: number) {
  return resultFormat<PublicPoolChartDayData[]>(
    await (await poolStorage(storageId)).getPoolChartData(poolId, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useInfoPoolChartData(
  storageId: string | undefined,
  poolId: string | undefined,
  offset: number,
  limit: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!storageId || !poolId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getInfoPoolChartData(storageId, poolId, offset, limit);
    }, [storageId, poolId, offset, limit]),
  );
}

export async function getInfoPoolTransactions(storageId: string, poolId: string, offset: number, limit: number) {
  return resultFormat<PoolStorageTransaction[]>(
    await (await poolStorage(storageId)).getPoolTransactions(poolId, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useInfoPoolTransactions(
  storageId: string | undefined,
  poolId: string | undefined,
  offset: number,
  limit: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!storageId || !poolId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getInfoPoolTransactions(storageId!, poolId!, offset, limit);
    }, [storageId, poolId, offset, limit]),
  );
}
