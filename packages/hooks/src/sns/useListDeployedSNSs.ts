import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { sns_wasm } from "@icpswap/actor";
import type { ListDeployedSnsesResponse } from "@icpswap/candid";
import { useCallback } from "react";

export async function getListDeployedSNSs() {
  return resultFormat<ListDeployedSnsesResponse>(
    await (await sns_wasm()).list_deployed_snses({})
  ).data;
}

export function useListDeployedSNSs() {
  return useCallsData(
    useCallback(async () => {
      return await getListDeployedSNSs();
    }, [])
  );
}
