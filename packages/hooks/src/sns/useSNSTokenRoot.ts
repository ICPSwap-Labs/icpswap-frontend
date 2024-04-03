import { useCallback } from "react";
import type { TokenRoots } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export function useSNSTokensRootIds() {
  const call = async () => {
    const fetch_result = await fetch(
      "https://sns-api.internetcomputer.org/api/v1/snses?include_swap_lifecycle=LIFECYCLE_PENDING&include_swap_lifecycle=LIFECYCLE_ADOPTED&include_swap_lifecycle=LIFECYCLE_OPEN&include_swap_lifecycle=LIFECYCLE_COMMITTED",
    ).catch(() => undefined);

    if (!fetch_result) return undefined;

    return (await fetch_result.json()) as {
      data: TokenRoots[];
      total_snses: number;
      max_sns_index: number;
    };
  };

  return useCallsData(
    useCallback(async () => {
      return await call();
    }, []),
  );
}
