import { useCallback } from "react";
import { passCodeManager } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { useCallsData } from "../useCallData";

export function usePCMMetadata() {
  return useCallsData(
    useCallback(async () => {
      return resultFormat<{
        passcodePrice: bigint;
        tokenCid: Principal;
        factoryCid: Principal;
      }>(await (await passCodeManager()).metadata()).data;
    }, []),
  );
}

export async function requestPassCode(token0: Principal, token1: Principal, fee: bigint) {
  const result = await (await passCodeManager(true)).requestPasscode(token0, token1, fee);

  return resultFormat<string>(result);
}

export async function withdrawPCMBalance(amount: bigint, fee: bigint) {
  const result = await (await passCodeManager(true)).withdraw({ fee, amount });
  return resultFormat<bigint>(result);
}

export async function destroyPassCode(token0: string, token1: string, fee: bigint) {
  const result = await (
    await passCodeManager(true)
  ).destoryPasscode(Principal.fromText(token0), Principal.fromText(token1), fee);

  return resultFormat<string>(result);
}

export function useUserPCMBalance(principal: Principal | undefined, reload?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!principal) return undefined;
      return resultFormat<bigint>(await (await passCodeManager()).balanceOf(principal)).data;
    }, [principal]),
    reload,
  );
}
