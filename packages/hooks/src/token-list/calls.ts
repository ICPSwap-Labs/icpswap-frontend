import { tokenList } from "@icpswap/actor";
import type { TokenListMetadata, IcpSwapAPIPageResult, IcpSwapAPITokenInfo } from "@icpswap/types";
import { useCallback } from "react";
import { icpswap_fetch_post, resultFormat } from "@icpswap/utils";

import { useCallsData } from "../useCallData";
import { getLimitedInfinityCallV1 } from "../useLimitedInfinityCall";

export async function getTokensFromList() {
  return resultFormat<TokenListMetadata[]>(await (await tokenList()).getList()).data;
}

export function useTokensFromList() {
  return useCallsData(
    useCallback(async () => {
      return await getTokensFromList();
    }, []),
  );
}

export function useTokenListTokenInfo(canisterId: string | undefined | null) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      const info = resultFormat<TokenListMetadata[]>(await (await tokenList()).get(canisterId)).data;
      return info ? info[0] : undefined;
    }, [canisterId]),
  );
}

export async function getAllSwapTokens(page: number, size: number) {
  const result = await icpswap_fetch_post<IcpSwapAPIPageResult<IcpSwapAPITokenInfo>>("/info/tokens/find", {
    page,
    limit: size,
  });

  return result?.data;
}

export function useAllSwapTokens() {
  const call = async (page: number, size: number) => {
    const result = await getAllSwapTokens(page, size);
    return result?.content;
  };

  return useCallsData(
    useCallback(async () => {
      return await getLimitedInfinityCallV1<IcpSwapAPITokenInfo>(call, 1000, 2);
    }, []),
  );
}
