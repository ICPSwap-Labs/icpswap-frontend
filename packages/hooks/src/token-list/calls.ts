import { tokenList, allTokenOfSwap } from "@icpswap/actor";
import type {
  TokenListMetadata,
  AllTokenOfSwapTokenInfo,
  PaginationResult,
  IcpSwapAPIPageResult,
  IcpSwapAPIResult,
  IcpSwapAPITokenInfo,
} from "@icpswap/types";
import { useCallback } from "react";
import { fetch_post, resultFormat } from "@icpswap/utils";

import { useCallsData } from "../useCallData";
import { getLimitedInfinityCall, getLimitedInfinityCallV1 } from "../useLimitedInfinityCall";

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
    await (await allTokenOfSwap()).get_token_list(BigInt(offset), BigInt(limit), [true]),
  ).data;
}

// export function useAllTokensOfSwap() {
//   const call = async (offset: number, limit: number) => {
//     const result = resultFormat<PaginationResult<AllTokenOfSwapTokenInfo>>(
//       await (await allTokenOfSwap()).get_token_list(BigInt(offset), BigInt(limit), [true]),
//     ).data;

//     return result?.content;
//   };

//   return useCallsData(
//     useCallback(async () => {
//       return getLimitedInfinityCall<AllTokenOfSwapTokenInfo>(call, 1000, 2);
//     }, []),
//   );
// }

export async function getAllSwapTokens(page: number, size: number) {
  const result = await fetch_post<IcpSwapAPIPageResult<IcpSwapAPITokenInfo>>(
    "https://api.icpswap.com/info/tokens/find",
    {
      page,
      limit: size,
    },
  );

  return result.data;
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
