import { useCallback } from "react";
import { useSupportedActiveChain } from "hooks/web3/index";
import { useCallsData, Call } from "@icpswap/hooks";

export function useWeb3CallsData<T>(fn: Call<T>, reload?: number | string | boolean) {
  const supportedActiveChain = useSupportedActiveChain();

  return useCallsData<T>(
    useCallback(async () => {
      return await fn();
    }, [supportedActiveChain, fn]),
    reload,
  );
}
