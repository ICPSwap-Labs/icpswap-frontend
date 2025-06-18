import { useCallback } from "react";
import { IcpSwapAPIResult, Null } from "@icpswap/types";
import { isUndefinedOrNull, resultFormat } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

type OutOfCyclesResponse = {
  ledgerId: string;
  available: boolean;
  status: string;
  queryTime: number;
};

export interface UseTokenOutOfCyclesProps {
  tokenIds: string[] | Null;
}

export function useTokenOutOfCycles({ tokenIds }: UseTokenOutOfCyclesProps) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(tokenIds)) return undefined;

      const queryParams = tokenIds.map((tokenId) => `canisterIds=${tokenId}`);

      const fetch_result = await fetch(`https://api.icpswap.com/tokens/status?${queryParams.join("&")}`, {
        method: "GET",
      }).catch(() => undefined);

      if (!fetch_result) return undefined;

      const result = (await fetch_result.json()) as IcpSwapAPIResult<OutOfCyclesResponse> | undefined;

      return resultFormat<Array<OutOfCyclesResponse>>(result);
    }, [tokenIds]),
  );
}
