import { useCallback } from "react";
import { useCallsData } from "../useCallData";
import { node_index } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import type { PublicPoolOverView } from "@icpswap/candid";

export function usePoolsForToken(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      return resultFormat<PublicPoolOverView[]>(
        await (await node_index()).getPoolsForToken(canisterId)
      ).data;
    }, [canisterId])
  );
}
