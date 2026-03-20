import { node_index } from "@icpswap/actor";
import type { InfoPoolRealTimeDataResponse, InfoTokenRealTimeDataResponse, Null } from "@icpswap/types";
import { icpswap_info_fetch_get, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getNodeInfoAllPools() {
  return (await icpswap_info_fetch_get<InfoPoolRealTimeDataResponse[]>("/pool/all")).data;
}

export function useNodeInfoAllPools(): UseQueryResult<InfoPoolRealTimeDataResponse[] | undefined, Error> {
  return useQuery({
    queryKey: ["useNodeInfoAllPools"],
    queryFn: async () => {
      return await getNodeInfoAllPools();
    },
  });
}

export async function getNodeInfoAllTokens() {
  return (await icpswap_info_fetch_get<InfoTokenRealTimeDataResponse[]>("/token/all")).data;
}

export function useNodeInfoAllTokens(): UseQueryResult<InfoTokenRealTimeDataResponse[] | undefined, Error> {
  return useQuery({
    queryKey: ["useNodeInfoAllTokens"],
    queryFn: async () => {
      return await getNodeInfoAllTokens();
    },
  });
}

export async function getInfoTokenPools(tokenId: string) {
  return (await icpswap_info_fetch_get<InfoPoolRealTimeDataResponse[]>(`/token/${tokenId}/pool`)).data;
}

export function useInfoTokenPools(
  tokenId: string | Null,
): UseQueryResult<InfoPoolRealTimeDataResponse[] | undefined, Error> {
  return useQuery({
    queryKey: ["useInfoTokenPools", tokenId],
    queryFn: async () => {
      if (!tokenId) return undefined;
      return await getInfoTokenPools(tokenId);
    },
    enabled: !!tokenId,
  });
}

export async function getInfoTokenStorageIds(token: string) {
  return resultFormat<string[]>(await (await node_index()).tokenStorage(token)).data;
}

export async function getInfoUserStorageIds(principal: string) {
  return resultFormat<string[]>(await (await node_index()).userStorage(principal)).data;
}

export function useInfoUserStorageIds(principal: string | Null): UseQueryResult<string[] | undefined, Error> {
  return useQuery({
    queryKey: ["useInfoUserStorageIds", principal],
    queryFn: async () => {
      if (!principal) return undefined;
      return await getInfoUserStorageIds(principal!);
    },
    enabled: !!principal,
  });
}
