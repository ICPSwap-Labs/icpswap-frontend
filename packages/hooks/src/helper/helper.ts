import { useCallback } from "react";
import { isNullArgs, resultFormat } from "@icpswap/utils";
import { userTokenHelper } from "@icpswap/actor";
import type { Null, HelperUserTokenBalance } from "@icpswap/types";
import { Principal } from "@dfinity/principal";

import { useCallsData } from "../useCallData";

export interface GetHelperUserTokensProps {
  principal: string;
}

export async function getHelperUserTokens({ principal }: GetHelperUserTokensProps) {
  return resultFormat<HelperUserTokenBalance>(
    await (await userTokenHelper()).getUserTokens(Principal.fromText(principal)),
  ).data;
}

export interface UseHelperUserTokensProps {
  principal: string | Null;
  refresh?: number;
}

export function useHelperUserTokens({ principal, refresh }: UseHelperUserTokensProps) {
  return useCallsData(
    useCallback(async () => {
      if (isNullArgs(principal)) return undefined;
      return await getHelperUserTokens({ principal });
    }, [principal]),
    refresh,
  );
}
