import type { IcpSwapAPIPageResult, InfoSwapRecordResponse, Null } from "@icpswap/types";
import { getTimeRangeForPastDays, icpswap_fetch_get, isAvailablePageArgs, isUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

interface GetPositionStorageTransactionsProps {
  poolIds: string[];
  principal: string | Null;
  page: number;
  limit: number;
  begin: number;
  end: number;
}

export async function getPositionTransactions({
  poolIds,
  principal,
  page,
  limit,
  begin,
  end,
}: GetPositionStorageTransactionsProps) {
  if (principal) {
    return (
      await icpswap_fetch_get<IcpSwapAPIPageResult<InfoSwapRecordResponse>>(
        `/info/record/transferPosition/list?${
          poolIds.length > 0 ? `poolIds=${poolIds.join(",")}&` : ""
        }${principal ? `principal=${principal}&` : ""}page=${page}&limit=${limit}&begin=${begin}&end=${end}`,
      )
    )?.data;
  }

  return (
    await icpswap_fetch_get<IcpSwapAPIPageResult<InfoSwapRecordResponse>>(
      `/info/record/transferPosition/list/pools?${
        poolIds.length > 0 ? `poolIds=${poolIds.join(",")}&` : ""
      }page=${page}&limit=${limit}&begin=${begin}&end=${end}`,
    )
  )?.data;
}

export function usePositionTransactions(
  poolIds: string[] | Null,
  principal: string | Null,
  offset: number,
  limit: number,
): UseQueryResult<IcpSwapAPIPageResult<InfoSwapRecordResponse> | null | undefined, Error> {
  const enabled = isAvailablePageArgs(offset, limit) && !isUndefinedOrNull(poolIds);

  return useQuery({
    queryKey: ["usePositionTransactions", principal, offset, limit, poolIds],
    queryFn: async () => {
      if (isUndefinedOrNull(poolIds)) return null;

      const { start, end } = getTimeRangeForPastDays(180 - 1);

      return await getPositionTransactions({ poolIds, principal, page: offset, limit, begin: start, end });
    },
    enabled,
  });
}
