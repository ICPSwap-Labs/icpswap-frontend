import { useCallback } from "react";
import { useCallsData } from "@icpswap/hooks";
import type { CallResult } from "@icpswap/types";

export interface CanisterInfo {
  canister_id: string;
  controllers: string[];
  module_hash: string;
  subnet_id: string;
}

export function useCanisterInfo(canisterId: string): CallResult<CanisterInfo> {
  return useCallsData(
    useCallback(async () => {
      return await (await fetch(`https://ic-api.internetcomputer.org/api/v3/canisters/${canisterId}`)).json();
    }, []),
  );
}
