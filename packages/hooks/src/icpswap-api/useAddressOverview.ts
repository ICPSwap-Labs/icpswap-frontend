import type { Null, UserAssetResponse } from "@icpswap/types";
import { icpswap_fetch_get } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useAddressOverview(
  pid: string | Null,
  refresh?: number | undefined,
): UseQueryResult<UserAssetResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useAddressOverview", pid, refresh],
    queryFn: async () => {
      if (!pid) return undefined;
      return (await icpswap_fetch_get<UserAssetResponse>(`/info/wallet/overview?pid=${pid}`))?.data;
    },
    enabled: !!pid,
  });
}
