import { useCallback } from "react";
import type { PositionTransaction, PaginationResult, Null } from "@icpswap/types";
import { baseIndex, positionTransactionsStorage } from "@icpswap/actor";
import { isAvailablePageArgs, isUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";

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
  principal: string | Null,
  offset: number,
  limit: number,
) {
  if (principal) {
    return resultFormat<PaginationResult<PositionTransaction>>(
      await (
        await positionTransactionsStorage(storageId)
      ).getByUser(BigInt(offset), BigInt(limit), Principal.fromText(principal), poolIds[0] ?? ""),
    ).data;
  }

  return resultFormat<PaginationResult<PositionTransaction>>(
    await (await positionTransactionsStorage(storageId)).get(BigInt(offset), BigInt(limit), poolIds),
  ).data;
}

export function usePositionStorageTransactions(
  storageId: string | Null,
  poolIds: string[] | Null,
  principal: string | Null,
  offset: number,
  limit: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || isUndefinedOrNull(storageId) || isUndefinedOrNull(poolIds))
        return null;

      return await getPositionStorageTransactions(storageId, poolIds, principal, offset, limit);
    }, [storageId, principal, offset, limit, poolIds]),
  );
}

export function usePositionTransactions(
  poolIds: string[] | Null,
  principal: string | Null,
  offset: number,
  limit: number,
) {
  const { result: storageId } = usePositionTransactionsStorage();

  return usePositionStorageTransactions(storageId, poolIds, principal, offset, limit);
}
