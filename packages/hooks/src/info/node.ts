import { useCallback } from "react";
import { icpswap_info_fetch_get, resultFormat } from "@icpswap/utils";
import { node_index } from "@icpswap/actor";
import { InfoPoolRealTimeDataResponse, InfoTokenRealTimeDataResponse, Null } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getNodeInfoAllPools() {
  return (await icpswap_info_fetch_get<InfoPoolRealTimeDataResponse[]>("/pool/all")).data;
}

export function useNodeInfoAllPools() {
  return useCallsData(
    useCallback(async () => {
      return await getNodeInfoAllPools();
    }, []),
  );
}

export async function getNodeInfoAllTokens() {
  return (await icpswap_info_fetch_get<InfoTokenRealTimeDataResponse[]>("/token/all")).data;
}

export function useNodeInfoAllTokens() {
  return useCallsData(
    useCallback(async () => {
      return await getNodeInfoAllTokens();
    }, []),
  );
}

export async function getInfoTokenPools(tokenId: string) {
  return (await icpswap_info_fetch_get<InfoPoolRealTimeDataResponse[]>(`/token/${tokenId}/pool`)).data;
}

export function useInfoTokenPools(tokenId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId) return undefined;
      return await getInfoTokenPools(tokenId);
    }, [tokenId]),
  );
}

export async function getInfoTokenStorageIds(token: string) {
  return resultFormat<string[]>(await (await node_index()).tokenStorage(token)).data;
}

export async function getInfoUserStorageIds(principal: string) {
  return resultFormat<string[]>(await (await node_index()).userStorage(principal)).data;
}

export function useInfoUserStorageIds(principal: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!principal) return undefined;
      return await getInfoUserStorageIds(principal!);
    }, [principal]),
  );
}
