import { useCallback } from "react";
import { swapFactory } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import type { PassCode } from "@icpswap/candid";
import { useCallsData } from "../useCallData";

export async function getPassCode(principal: string) {
  return resultFormat<PassCode[]>(await (await swapFactory()).getPasscodesByPrincipal(Principal.fromText(principal)))
    .data;
}

export function usePassCode(principal: string | undefined, reload?: number | boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!principal) return undefined;
      return getPassCode(principal);
    }, [principal]),
    reload,
  );
}
