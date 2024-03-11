import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { globalIndex } from "@icpswap/actor";
import {
  AllPoolsTVL,
  AllTokensTVL,
  PoolLatestTVL,
  PublicProtocolData,
  TokenLatestTVL,
} from "@icpswap/types";

// Global
export async function getAllPoolsTVL() {
  return resultFormat<AllPoolsTVL>(await (await globalIndex()).getAllPoolTvl())
    .data;
}

export function useAllPoolsTVL() {
  return useCallsData(
    useCallback(async () => {
      return await getAllPoolsTVL();
    }, [])
  );
}

export async function getAllTokensTVL() {
  return resultFormat<AllTokensTVL>(
    await (await globalIndex()).getAllTokenTvl()
  ).data;
}

export function useAllTokensTVL() {
  return useCallsData(
    useCallback(async () => {
      return await getAllTokensTVL();
    }, [])
  );
}

export async function getSwapProtocolData() {
  return resultFormat<PublicProtocolData>(
    await (await globalIndex()).getProtocolData()
  ).data;
}

export function useSwapProtocolData() {
  return useCallsData(
    useCallback(async () => {
      return await getSwapProtocolData();
    }, [])
  );
}

export async function getPoolLatestTVL(id: string) {
  return resultFormat<PoolLatestTVL>(
    await (await globalIndex()).getPoolLastTvl(id)
  ).data;
}

export function usePoolLatestTVL(id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!id) return undefined;
      return await getPoolLatestTVL(id!);
    }, [id])
  );
}

export async function getTokenLatestTVL(id: string) {
  return resultFormat<TokenLatestTVL>(
    await (await globalIndex()).getTokenLastTvl(id)
  ).data;
}

export function useTokenLatestTVL(id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!id) return undefined;
      return await getTokenLatestTVL(id!);
    }, [id])
  );
}

export async function getGlobalLatestStorageCanister() {
  return resultFormat<string>(
    await (await globalIndex()).globalLastStorageCanister()
  ).data;
}

export function useGlobalLatestStorageCanister() {
  return useCallsData(
    useCallback(async () => {
      return await getGlobalLatestStorageCanister();
    }, [])
  );
}

export async function getGlobalStorageCanister() {
  return resultFormat<string[]>(
    await (await globalIndex()).globalStorageCanister()
  ).data;
}

export function useGlobalStorageCanister() {
  return useCallsData(
    useCallback(async () => {
      return await getGlobalStorageCanister();
    }, [])
  );
}

export async function getTvlLatestStorageCanister() {
  return resultFormat<string>(
    await (await globalIndex()).tvlLastStorageCanister()
  ).data;
}

export function useTvlLatestStorageCanister() {
  return useCallsData(
    useCallback(async () => {
      return await getTvlLatestStorageCanister();
    }, [])
  );
}

export async function getTvlStorageCanister() {
  return resultFormat<string[]>(
    await (await globalIndex()).tvlStorageCanister()
  ).data;
}

export function useTvlStorageCanister() {
  return useCallsData(
    useCallback(async () => {
      return await getTvlStorageCanister();
    }, [])
  );
}
