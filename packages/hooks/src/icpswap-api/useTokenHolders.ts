import type { IcpSwapAPIPageResult, IcpSwapAPITokenHolderDetail, Null } from "@icpswap/types";
import { icpswap_fetch_post } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useTokenHolders(
  tokenId: string | Null,
  pageNum: number,
  pageSize: number,
  isDesc = true,
): UseQueryResult<IcpSwapAPIPageResult<IcpSwapAPITokenHolderDetail> | undefined, Error> {
  return useQuery({
    queryKey: ["useTokenHolders", tokenId, pageNum, pageSize, isDesc],
    queryFn: async () => {
      if (!tokenId) return undefined;

      const result = await icpswap_fetch_post<IcpSwapAPIPageResult<IcpSwapAPITokenHolderDetail>>(`/info/holder/token`, {
        ledgerId: tokenId,
        page: pageNum,
        size: pageSize,
        isDesc,
      });

      return result?.data;
    },
    enabled: !!tokenId,
  });
}
