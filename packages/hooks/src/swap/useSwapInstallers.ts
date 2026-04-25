import { swapFactory } from "@icpswap/actor";
import type { PoolInstaller } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getSwapInstallers() {
  return resultFormat<PoolInstaller[]>(await (await swapFactory()).getPoolInstallers()).data;
}

export function useSwapInstallers(): UseQueryResult<PoolInstaller[] | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapInstallers"],
    queryFn: async () => {
      return await getSwapInstallers();
    },
  });
}
