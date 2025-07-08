import { useCallback } from "react";
import { resultFormat, icpswap_info_fetch_get } from "@icpswap/utils";
import { baseIndex, baseStorage } from "@icpswap/actor";
import type { PaginationResult, BaseTransaction, InfoTransactionResponse, PageResponse, Null } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getBaseStorages() {
  return resultFormat<string[]>(await (await baseIndex()).baseStorage()).data;
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

interface GetSwapTransactionsProps {
  page: number;
  limit: number;
  principal?: string | Null;
  poolId?: string | Null;
  tokenId?: string | Null;
}

export async function getSwapTransactions({ principal, poolId, tokenId, page, limit }: GetSwapTransactionsProps) {
  return (
    await icpswap_info_fetch_get<PageResponse<InfoTransactionResponse>>("/transaction/find", {
      poolId,
      principal,
      tokenId,
      page,
      limit,
    })
  ).data;
}

interface UseSwapTransactionsProps {
  page: number;
  limit: number;
  principal?: string;
  poolId?: string | Null;
  tokenId?: string;
}

export function useSwapTransactions({ page, poolId, principal, limit, tokenId }: UseSwapTransactionsProps) {
  return useCallsData(
    useCallback(async () => {
      return await getSwapTransactions({ principal, poolId, page, limit, tokenId });
    }, [page, poolId, principal, limit, tokenId]),
  );
}

export async function getTokenTransactions(tokenId: string, page: number, limit: number) {
  return (
    await icpswap_info_fetch_get<PageResponse<InfoTransactionResponse>>(`/token/${tokenId}/transaction`, {
      page,
      limit,
    })
  ).data;
}

export function useTokenTransactions(tokenId: string | Null, page: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      return await getTokenTransactions(tokenId, page, limit);
    }, [tokenId, page, limit]),
  );
}
