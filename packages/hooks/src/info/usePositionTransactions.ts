import { Principal } from "@icp-sdk/core/principal";
import { baseIndex, positionTransactionsStorage } from "@icpswap/actor";
import type { Null, PaginationResult, PositionTransaction } from "@icpswap/types";
import { isAvailablePageArgs, isUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getPositionTransactionsStorage() {
  return resultFormat<string>(await (await baseIndex()).transferPositionLastStorage()).data;
}

export function usePositionTransactionsStorage(): UseQueryResult<string | undefined, Error> {
  return useQuery({
    queryKey: ["usePositionTransactionsStorage"],
    queryFn: async () => {
      return await getPositionTransactionsStorage();
    },
  });
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
      await (await positionTransactionsStorage(storageId)).getByUser(
        BigInt(offset),
        BigInt(limit),
        Principal.fromText(principal),
        poolIds[0] ?? "",
      ),
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
): UseQueryResult<PaginationResult<PositionTransaction> | null | undefined, Error> {
  const enabled = isAvailablePageArgs(offset, limit) && !isUndefinedOrNull(storageId) && !isUndefinedOrNull(poolIds);
  return useQuery({
    queryKey: ["usePositionStorageTransactions", storageId, principal, offset, limit, poolIds],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit) || isUndefinedOrNull(storageId) || isUndefinedOrNull(poolIds))
        return null;

      return await getPositionStorageTransactions(storageId, poolIds, principal, offset, limit);
    },
    enabled,
  });
}

export function usePositionTransactions(
  poolIds: string[] | Null,
  principal: string | Null,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<PositionTransaction> | null | undefined, Error> {
  const { data: storageId } = usePositionTransactionsStorage();

  return usePositionStorageTransactions(storageId, poolIds, principal, offset, limit);
}
