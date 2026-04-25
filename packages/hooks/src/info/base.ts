import type { InfoTransactionResponse, Null, PageResponse } from "@icpswap/types";
import { icpswap_fetch_get, icpswap_info_fetch_get, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

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
}: UseSwapTransactionsProps): UseQueryResult<PageResponse<InfoTransactionResponse> | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapTransactions", page, poolId, principal, limit, tokenId, startTime, endTime],
    queryFn: async () => {
      return await getSwapTransactions({ principal, poolId, page, limit, tokenId, startTime, endTime });
    },
  });
}

export function useUserSwapTransactions({
  page,
  poolId,
  principal,
  limit,
  tokenId,
  startTime,
  endTime,
}: UseSwapTransactionsProps): UseQueryResult<PageResponse<InfoTransactionResponse> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserSwapTransactions", page, poolId, principal, limit, tokenId, startTime, endTime],
    queryFn: async () => {
      if (isUndefinedOrNull(principal)) return undefined;

      return await getSwapTransactions({ principal, poolId, page, limit, tokenId, startTime, endTime });
    },
    enabled: !isUndefinedOrNull(principal),
  });
}

export async function getTokenTransactions(tokenId: string, page: number, limit: number) {
  return (
    await icpswap_info_fetch_get<PageResponse<InfoTransactionResponse>>(`/token/${tokenId}/transaction`, {
      page,
      limit,
    })
  ).data;
}

export function useTokenTransactions(
  tokenId: string | Null,
  page: number,
  limit: number,
): UseQueryResult<PageResponse<InfoTransactionResponse> | undefined, Error> {
  return useQuery({
    queryKey: ["useTokenTransactions", tokenId, page, limit],
    queryFn: async () => {
      return await getTokenTransactions(tokenId!, page, limit);
    },
    enabled: !!tokenId,
  });
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
