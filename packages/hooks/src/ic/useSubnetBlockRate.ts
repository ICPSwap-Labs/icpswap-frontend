import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { isNullArgs } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

interface SubnetRateResult {
  block_rate: Array<[number, string]>;
}

interface UseSubtetBlockRateProps {
  subnet: string | Null;
}

export function useSubnetBlockRate({ subnet }: UseSubtetBlockRateProps) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(subnet)) return null;

      const fetch_result = await fetch(
        `https://ic-api.internetcomputer.org/api/v3/metrics/block-rate?subnet=${subnet}`,
      ).catch(() => undefined);

      if (!fetch_result) return undefined;

      return (await fetch_result.json()) as SubnetRateResult;
    }, [subnet]),
  );
}
