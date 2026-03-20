import { sns_root } from "@icpswap/actor";
import type { ListSnsCanistersResponse } from "@icpswap/candid";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSNSCanisters(root_id: string) {
  return resultFormat<ListSnsCanistersResponse>(await (await sns_root(root_id)).list_sns_canisters({})).data;
}

export function useSNSCanisters(
  root_id: string | undefined,
): UseQueryResult<ListSnsCanistersResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useSNSCanisters", root_id],
    queryFn: async () => {
      if (!root_id) return undefined;
      return await getSNSCanisters(root_id);
    },
    enabled: !!root_id,
  });
}
