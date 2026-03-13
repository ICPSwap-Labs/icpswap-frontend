import type { AddressOverview, Null } from "@icpswap/types";
import { icpswap_fetch_get } from "@icpswap/utils";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useAddressOverview(
  pid: string | Null,
  refresh?: number | undefined,
): UseQueryResult<AddressOverview | undefined, Error> {
  return useQuery({
    queryKey: ["useAddressOverview", pid, refresh],
    queryFn: async () => {
      if (!pid) return undefined;
      return (await icpswap_fetch_get<AddressOverview>(`/info/wallet/overview?pid=${pid}`))?.data;
    },
    enabled: !!pid,
  });
}
