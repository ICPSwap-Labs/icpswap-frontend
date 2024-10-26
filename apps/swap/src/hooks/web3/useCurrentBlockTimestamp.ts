import { useCallsData } from "@icpswap/hooks";
import { useCallback, useMemo } from "react";
import { useSupportedActiveChain } from "hooks/web3/index";

import { useInterfaceMulticall } from "./useContract";

// gets the current timestamp from the blockchain
export function useCurrentBlockTimestamp() {
  const multicall = useInterfaceMulticall();
  const supportedActiveChain = useSupportedActiveChain();

  const { result } = useCallsData(
    useCallback(async () => {
      if (!multicall || !supportedActiveChain) return;

      const resultStr = await multicall.getCurrentBlockTimestamp();

      return resultStr;
    }, [multicall]),
  );

  return useMemo(() => result, [result]);
}
