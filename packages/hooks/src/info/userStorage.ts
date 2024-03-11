import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { userStorage } from "@icpswap/actor";
import { UserStorageTransaction } from "@icpswap/types";
import { PaginationResult } from "@icpswap/types";

/**
 * @param storageId The user storage canister id
 * @param principal User's principal address
 * @param offset Start of data
 * @param limit Length of data
 * @param poolIds An array of pool ids, empty array will return all pools data
 * @returns
 */
export async function getInfoUserTransactions(
  storageId: string,
  principal: string,
  offset: number,
  limit: number,
  poolIds: string[]
) {
  return resultFormat<PaginationResult<UserStorageTransaction>>(
    await (
      await userStorage(storageId)
    ).get(principal, BigInt(offset), BigInt(limit), poolIds)
  ).data;
}

/**
 * @param storageId The user storage canister id
 * @param principal User's principal address
 * @param offset Start of data
 * @param limit Length of data
 * @param poolIds An array of pool ids, empty array will return all pools data
 * @returns
 */
export function useInfoUserTransactions(
  storageId: string | undefined,
  principal: string | undefined,
  offset: number,
  limit: number,
  poolIds?: string[]
) {
  return useCallsData(
    useCallback(async () => {
      if (!storageId || !principal || !isAvailablePageArgs(offset, limit))
        return undefined;
      return await getInfoUserTransactions(
        storageId!,
        principal!,
        offset,
        limit,
        poolIds ?? []
      );
    }, [storageId, principal, offset, limit, JSON.stringify(poolIds)])
  );
}
