import { useCallback } from "react";
import { icpswap_fetch_post, isUndefinedOrNull } from "@icpswap/utils";
import type { Null } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export interface GetHelperUserTokensProps {
  principal: string;
}

export async function getUserTokens({ principal }: GetHelperUserTokensProps) {
  return (
    await icpswap_fetch_post<{
      user: string;
      totalBalance: number;
      tokens: Array<{ token: string; balance: number }>;
    }>("/info/wallet/user/all", {
      pid: principal,
    })
  ).data;
}

export interface UseHelperUserTokensProps {
  principal: string | Null;
  refresh?: number;
}

export function useUserTokens({ principal, refresh }: UseHelperUserTokensProps) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(principal)) return undefined;
      return await getUserTokens({ principal });
    }, [principal]),
    refresh,
  );
}
