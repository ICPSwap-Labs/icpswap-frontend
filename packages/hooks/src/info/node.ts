import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { node_index } from "@icpswap/actor";
import { PublicPoolOverView, PublicTokenOverview } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getNodeInfoAllPools() {
  return resultFormat<PublicPoolOverView[]>(await (await node_index()).getAllPools()).data;
}

export function useNodeInfoAllPools() {
  return useCallsData(
    useCallback(async () => {
      return await getNodeInfoAllPools();
    }, []),
  );
}

export async function getNodeInfoAllTokens() {
  return resultFormat<PublicTokenOverview[]>(await (await node_index()).getAllTokens()).data;
}

export function useNodeInfoAllTokens() {
  return useCallsData(
    useCallback(async () => {
      return await getNodeInfoAllTokens();
    }, []),
  );
}

export async function getInfoPoolStorageIds(pool: string) {
  return resultFormat<string[]>(await (await node_index()).poolStorage(pool)).data;
}

export function useInfoPoolStorageIds(pool: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!pool) return undefined;
      return await getInfoPoolStorageIds(pool!);
    }, [pool]),
  );
}

export async function getInfoTokenStorageIds(token: string) {
  return resultFormat<string[]>(await (await node_index()).tokenStorage(token)).data;
}

export function useInfoTokenStorageIds(token: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!token) return undefined;
      return await getInfoTokenStorageIds(token!);
    }, [token]),
  );
}

export async function getInfoUserStorageIds(principal: string) {
  return resultFormat<string[]>(await (await node_index()).userStorage(principal)).data;
}

export function useInfoUserStorageIds(principal: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!principal) return undefined;
      return await getInfoUserStorageIds(principal!);
    }, [principal]),
  );
}
