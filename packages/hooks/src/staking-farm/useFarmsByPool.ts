import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { farmIndex } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

/**
 *
 * @param poolIds
 * @returns [Principal, Principal]: [poolId, farmId]
 */
export async function getLiveFarmsByPoolIds(poolIds: string[]) {
  const result = await (await farmIndex()).getLiveFarmsByPools(poolIds.map((poolId) => Principal.fromText(poolId)));
  return resultFormat<Array<[Principal, Principal]>>(result).data;
}

export function useLiveFarmsByPoolIds(poolIds: string[] | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!poolIds) return undefined;

      return await getLiveFarmsByPoolIds(poolIds);
    }, [poolIds]),
    reload,
  );
}

export async function getFarmsByPool(poolId: string) {
  const result = await (await farmIndex()).getFarmsByPool(Principal.fromText(poolId));
  return resultFormat<Array<Principal>>(result).data;
}

export function useFarmsByPool(poolId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;

      return await getFarmsByPool(poolId);
    }, [poolId]),
    reload,
  );
}
