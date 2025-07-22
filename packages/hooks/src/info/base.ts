import { useCallback } from "react";
import { resultFormat, icpswap_info_fetch_get, icpswap_fetch_get, nonUndefinedOrNull } from "@icpswap/utils";
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
  startTime?: number | undefined;
  endTime?: number | undefined;
}

export async function getSwapTransactions({
  principal,
  poolId,
  tokenId,
  page,
  limit,
  startTime,
  endTime,
}: GetSwapTransactionsProps) {
  return (
    await icpswap_fetch_get<PageResponse<InfoTransactionResponse>>("/info/transaction/find", {
      poolId,
      principal,
      tokenId,
      page,
      limit,
      begin: startTime,
      end: endTime,
    })
  ).data;
}

interface UseSwapTransactionsProps {
  page: number;
  limit: number;
  principal?: string;
  poolId?: string | Null;
  tokenId?: string;
  startTime?: number | undefined;
  endTime?: number | undefined;
}

export function useSwapTransactions({
  page,
  poolId,
  principal,
  limit,
  tokenId,
  startTime,
  endTime,
}: UseSwapTransactionsProps) {
  return useCallsData(
    useCallback(async () => {
      return await getSwapTransactions({ principal, poolId, page, limit, tokenId, startTime, endTime });
    }, [page, poolId, principal, limit, tokenId, startTime, endTime]),
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

interface DownloadSwapTransactionsProps {
  begin: number;
  end: number;
  principal: string;
  poolId?: string;
  tokenId?: string;
}

export async function downloadSwapTransactions(args: DownloadSwapTransactionsProps) {
  return await icpswap_fetch_get("/transaction/download/csv", args);
}

export function getDownloadSwapTransactionsLink(args: DownloadSwapTransactionsProps) {
  const __data = {};

  Object.keys(args).forEach((key) => {
    if (nonUndefinedOrNull(args[key])) {
      __data[key] = args[key];
    }
  });

  return `https://api.icpswap.com/transaction/download/csv?${new URLSearchParams(__data).toString()}`;
}
