import { useCallsData } from "../useCallData";
import { tokenList } from "@icpswap/actor";
import { TokenListMetadata } from "@icpswap/candid";
import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";

export async function getTokensFromList() {
  return resultFormat<TokenListMetadata[]>(await (await tokenList()).getList())
    .data;
}

export function useTokensFromList() {
  return useCallsData(
    useCallback(async () => {
      return await getTokensFromList();
    }, [])
  );
}

export function useTokenListTokenInfo(canisterId: string | undefined | null) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      const info = resultFormat<TokenListMetadata[]>(
        await (await tokenList()).get(canisterId)
      ).data;
      return info ? info[0] : undefined;
    }, [canisterId])
  );
}
