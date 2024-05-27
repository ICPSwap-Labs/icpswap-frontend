import { useCallsData } from "@icpswap/hooks";
import { useCallback, useMemo } from "react";

import { useInterfaceMulticall } from "./useContract";

// gets the current timestamp from the blockchain
export function useCurrentBlockTimestamp() {
  const multicall = useInterfaceMulticall();

  const { result } = useCallsData(
    useCallback(async () => {
      if (!multicall) return;

      const resultStr = await multicall.getCurrentBlockTimestamp();

      return resultStr;
    }, [multicall]),
  );

  return useMemo(() => result, [result]);
}
