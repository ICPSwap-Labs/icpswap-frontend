import { tokenList, allTokenOfSwap } from "@icpswap/actor";
import type { TokenListMetadata, AllTokenOfSwapTokenInfo, PaginationResult } from "@icpswap/types";
import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { getLimitedInfinityCall } from "../useLimitedInfinityCall";

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

export async function getAllTokensOfSwap(offset: number, limit: number) {
  return resultFormat<PaginationResult<AllTokenOfSwapTokenInfo>>(
    await (await allTokenOfSwap()).get_token_list(BigInt(offset), BigInt(limit), []),
  ).data;
}

export function useAllTokensOfSwap() {
  const call = async (offset: number, limit: number) => {
    const result = resultFormat<PaginationResult<AllTokenOfSwapTokenInfo>>(
      await (await allTokenOfSwap()).get_token_list(BigInt(offset), BigInt(limit), []),
    ).data;

    return result?.content;
  };

  return useCallsData(
    useCallback(async () => {
      return getLimitedInfinityCall<AllTokenOfSwapTokenInfo>(call, 1000, 2);
    }, []),
  );
}
