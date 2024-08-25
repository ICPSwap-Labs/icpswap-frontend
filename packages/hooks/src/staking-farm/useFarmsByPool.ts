import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { farmIndex } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getFarmsByPool(poolIds: string[]) {
  const result = await (await farmIndex()).getLiveFarmsByPools(poolIds.map((poolId) => Principal.fromText(poolId)));
  return resultFormat<Array<[Principal, Principal]>>(result).data;
}

export function useFarmsByPool(poolIds: string[] | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!poolIds) return undefined;

      return await getFarmsByPool(poolIds);
    }, [poolIds]),
    reload,
  );
}
