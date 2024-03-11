import { useCallback } from "react";
import { useCallsData } from "../useCallData";

export interface TokenRoots {
  description: string;
  enabled: boolean;
  logo: string;
  root_canister_id: string;
  url: string;
  swap_lifecycle: [];
}

export function useSNSTokensRootIds() {
  const call = async () => {
    return (await (
      await fetch(
        "https://sns-api.internetcomputer.org/api/v1/snses?include_swap_lifecycle=LIFECYCLE_PENDING&include_swap_lifecycle=LIFECYCLE_ADOPTED&include_swap_lifecycle=LIFECYCLE_OPEN&include_swap_lifecycle=LIFECYCLE_COMMITTED"
      )
    ).json()) as {
      data: TokenRoots[];
      total_snses: number;
      max_sns_index: number;
    };
  };

  return useCallsData(
    useCallback(async () => {
      return await call();
    }, [])
  );
}
