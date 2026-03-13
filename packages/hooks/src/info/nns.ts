import { icpswap_info_fetch_get } from "@icpswap/utils";
import type { NnsTokenInfo } from "@icpswap/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getNnsTokensInfo() {
  return (await icpswap_info_fetch_get<Array<NnsTokenInfo>>(`/sns/list`))?.data;
}

export function useNnsTokensInfo(): UseQueryResult<NnsTokenInfo[] | undefined, Error> {
  return useQuery({
    queryKey: ["useNnsTokensInfo"],
    queryFn: async () => {
      return await getNnsTokensInfo();
    },
  });
}
