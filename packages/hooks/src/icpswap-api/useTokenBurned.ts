import type { Null } from "@icpswap/types";
import { icpswap_fetch_post } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useTokenBurned(tokenId: string | Null): UseQueryResult<string | undefined, Error> {
  return useQuery({
    queryKey: ["useTokenBurned", tokenId],
    queryFn: async () => {
      if (!tokenId) return undefined;
      return (await icpswap_fetch_post<string>(`/info/tokens/burned`, { ledgerId: tokenId }))?.data;
    },
    enabled: !!tokenId,
  });
}
