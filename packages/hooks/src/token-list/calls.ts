import { tokenList } from "@icpswap/actor";
import type { TokenListMetadata, IcpSwapAPIPageResult, IcpSwapAPITokenInfo, TokensTreeMapRow } from "@icpswap/types";
import { icpswap_fetch_get, icpswap_fetch_post, nonUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getLimitedInfinityCallV1 } from "../useLimitedInfinityCall";

export async function getTokensFromList() {
  return resultFormat<TokenListMetadata[]>(await (await tokenList()).getList()).data;
}

export function useTokensFromList(): UseQueryResult<TokenListMetadata[], Error> {
  return useQuery({
    queryKey: ["tokensFromList"],
    queryFn: async () => {
      return await getTokensFromList();
    },
  });
}

export function useTokenListTokenInfo(canisterId: string | undefined | null): UseQueryResult<TokenListMetadata, Error> {
  return useQuery({
    queryKey: ["tokenListTokenInfo", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      const info = resultFormat<TokenListMetadata[]>(await (await tokenList()).get(canisterId)).data;
      return info ? info[0] : undefined;
    },
    enabled: nonUndefinedOrNull(canisterId),
  });
}

export async function getAllSwapTokens(page: number, size: number) {
  const result = await icpswap_fetch_post<IcpSwapAPIPageResult<IcpSwapAPITokenInfo>>("/info/tokens/find", {
    page,
    limit: size,
  });

  return result?.data;
}

export function useAllSwapTokens(): UseQueryResult<IcpSwapAPITokenInfo[], Error> {
  const call = async (page: number, size: number) => {
    const result = await getAllSwapTokens(page, size);
    return result?.content;
  };

  return useQuery({
    queryKey: ["allSwapTokens"],
    queryFn: async () => {
      return await getLimitedInfinityCallV1<IcpSwapAPITokenInfo>(call, 1000, 2);
    },
  });
}

export async function getTokensFromAPI(): Promise<TokensTreeMapRow[] | undefined> {
  return (await icpswap_fetch_get<Array<TokensTreeMapRow>>("/info/token/chart/list")).data;
}

export function useTokensFromAPI(): UseQueryResult<TokensTreeMapRow[] | undefined, Error> {
  return useQuery({
    queryKey: ["info-tokens"],
    queryFn: async () => {
      return await getTokensFromAPI();
    },
  });
}
