import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { sns_root } from "@icpswap/actor";
import type { ListSnsCanistersResponse } from "@icpswap/candid";
import { useCallback } from "react";

export async function getSNSCanisters(root_id: string) {
  return resultFormat<ListSnsCanistersResponse>(
    await (await sns_root(root_id)).list_sns_canisters({})
  ).data;
}

export function useSNSCanisters(root_id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!root_id) return undefined;
      return await getSNSCanisters(root_id);
    }, [root_id])
  );
}
