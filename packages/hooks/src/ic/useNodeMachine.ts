import { useCallback } from "react";

import { useCallsData } from "../useCallData";

interface NodeMachineResult {
  total_nodes: Array<[number, string]>;
  up_nodes: Array<[number, string]>;
}

export function useNodeMachines() {
  return useCallsData(
    useCallback(async () => {
      const fetch_result = await fetch("https://ic-api.internetcomputer.org/api/v3/metrics/ic-nodes-count").catch(
        () => undefined,
      );
      if (!fetch_result) return undefined;
      return (await fetch_result.json()) as NodeMachineResult;
    }, []),
  );
}
