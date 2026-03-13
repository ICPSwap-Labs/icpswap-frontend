import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InfoGlobalRealTimeDataResponse } from "@icpswap/types";
import { icpswap_info_fetch_get } from "@icpswap/utils";

export function useGlobalProtocol(): UseQueryResult<InfoGlobalRealTimeDataResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useGlobalProtocol"],
    queryFn: async () => {
      const result = await icpswap_info_fetch_get<InfoGlobalRealTimeDataResponse>("/global/protocol");
      return result?.data;
    },
  });
}
