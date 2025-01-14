import { useCallsData } from "@icpswap/hooks";
import { node_index } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { useCallback } from "react";

export function useSwapGlobalData() {
  const call = useCallback(async () => {
    const result = resultFormat<[number, bigint]>(await (await node_index()).getTotalVolumeAndUser()).data;

    return {
      totalVolume: result ? result[0] : undefined,
      totalUser: result ? result[1] : undefined,
    };
  }, []);

  return useCallsData(call);
}
