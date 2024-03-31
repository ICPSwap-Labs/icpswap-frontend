import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { baseIndex, baseStorage } from "@icpswap/actor";
import type { PaginationResult, BaseTransaction } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getBaseStorages() {
  return resultFormat<string[]>(await (await baseIndex()).baseStorage()).data;
}

export function useBaseStorages() {
  return useCallsData(
    useCallback(async () => {
      return await getBaseStorages();
    }, []),
  );
}

export async function getBaseStorage() {
  return resultFormat<string>(await (await baseIndex()).baseLastStorage()).data;
}

export function useBaseStorage() {
  return useCallsData(
    useCallback(async () => {
      return await getBaseStorage();
    }, []),
  );
}

/**
 *
 * @param canisterId The baseStorage canister id
 * @param offset Start of data
 * @param limit Length of data
 * @param poolIds An array of pool ids, empty array will return all pools data
 * @returns
 */
export async function getBaseTransactions(canisterId: string, offset: number, limit: number, poolIds: string[]) {
  return resultFormat<PaginationResult<BaseTransaction>>(
    await (await baseStorage(canisterId)).getBaseRecord(BigInt(offset), BigInt(limit), poolIds),
  ).data;
}

/**
 *
 * @param canisterId The baseStorage canister id
 * @param offset Start of data
 * @param limit Length of data
 * @param poolIds An array of pool ids, empty array will return all pools data, default is empty
 * @returns
 */
export function useBaseTransactions(
  canisterId: string | undefined,
  offset: number,
  limit: number,
  poolIds?: string[] | undefined,
) {
  const callback = useCallback(async () => {
    if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
    return await getBaseTransactions(canisterId, offset, limit, poolIds ?? []);
  }, [canisterId, offset, limit, JSON.stringify(poolIds)]);

  return useCallsData(callback);
}

/**
 *
 * @param canisterId The baseStorage canister id
 * @param offset Start of data
 * @param limit Length of data
 * @param tokenId The token canister id
 * @returns
 */
export async function getTransactionsByToken(canisterId: string, offset: number, limit: number, tokenId: string) {
  return resultFormat<PaginationResult<BaseTransaction>>(
    await (await baseStorage(canisterId)).getByToken(BigInt(offset), BigInt(limit), tokenId),
  ).data;
}

/**
 *
 * @param canisterId The baseStorage canister id
 * @param offset Start of data
 * @param limit Length of data
 * @param tokenId The token canister id
 * @returns
 */
export function useTransactionsByToken(canisterId: string | undefined, offset: number, limit: number, tokenId: string) {
  const callback = useCallback(async () => {
    if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
    return await getTransactionsByToken(canisterId, offset, limit, tokenId);
  }, [canisterId, offset, limit, tokenId]);

  return useCallsData(callback);
}

/**
 *
 * @param canisterId The baseStorage canister id
 * @param offset Start of data
 * @param limit Length of data
 * @param tokenId The pool canister id
 * @returns
 */
export async function getTransactionsByPool(canisterId: string, offset: number, limit: number, poolId: string) {
  return resultFormat<PaginationResult<BaseTransaction>>(
    await (await baseStorage(canisterId)).getByPool(BigInt(offset), BigInt(limit), poolId),
  ).data;
}

/**
 *
 * @param canisterId The baseStorage canister id
 * @param offset Start of data
 * @param limit Length of data
 * @param tokenId The pool canister id
 * @returns
 */
export function useTransactionsByPool(canisterId: string | undefined, offset: number, limit: number, poolId: string) {
  const callback = useCallback(async () => {
    if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
    return await getTransactionsByPool(canisterId, offset, limit, poolId);
  }, [canisterId, offset, limit, poolId]);

  return useCallsData(callback);
}
