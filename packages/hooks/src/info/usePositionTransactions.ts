import { useCallback } from "react";
import type { PositionTransaction, PaginationResult, Null } from "@icpswap/types";
import { baseIndex, positionTransactionsStorage } from "@icpswap/actor";
import { isAvailablePageArgs, isNullArgs, resultFormat } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export async function getPositionTransactionsStorage() {
  return resultFormat<string>(await (await baseIndex()).transferPositionLastStorage()).data;
}

export function usePositionTransactionsStorage() {
  return useCallsData(
    useCallback(async () => {
      return await getPositionTransactionsStorage();
    }, []),
  );
}

export async function getPositionStorageTransactions(
  storageId: string,
  poolIds: string[],
  offset: number,
  limit: number,
) {
  return resultFormat<PaginationResult<PositionTransaction>>(
    await (await positionTransactionsStorage(storageId)).get(BigInt(offset), BigInt(limit), poolIds),
  ).data;
}

export function usePositionStorageTransactions(
  storageId: string | Null,
  poolIds: string[] | Null,
  offset: number,
  limit: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || isNullArgs(storageId) || isNullArgs(poolIds)) return null;

      return await getPositionStorageTransactions(storageId, poolIds, offset, limit);
    }, [storageId, offset, limit, poolIds]),
  );
}

export function usePositionTransactions(poolIds: string[] | Null, offset: number, limit: number) {
  const { result: storageId } = usePositionTransactionsStorage();

  return usePositionStorageTransactions(storageId, poolIds, offset, limit);
}
