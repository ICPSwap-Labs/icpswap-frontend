import { useCallback } from "react";
import { v2SwapFactory, v2SwapPool } from "hooks/v2-actor";
import { PoolInfo, TickLiquidityInfo } from "types/swap-v2";
import { useCallsData } from "@icpswap/hooks";
import { resultFormat } from "@icpswap/utils";
import { TOKEN_STANDARD } from "@icpswap/types";

export async function getSwapPoolIds() {
  return resultFormat<string[]>(await (await v2SwapFactory()).getPoolIds()).data;
}

export async function getSwapPoolInfo(canisterId: string) {
  return resultFormat<PoolInfo>(await (await v2SwapPool(canisterId)).infoWithNoBalance()).data;
}

export function useSwapPoolInfo(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolInfo(canisterId);
    }, [canisterId]),
  );
}

export async function getSwapPools() {
  const poolIds = await getSwapPoolIds();

  if (poolIds && poolIds.length > 0) {
    const pools = await Promise.all(
      poolIds.map(async (poolId) => {
        return await getSwapPoolInfo(poolId);
      }),
    );

    return pools;
  }

  return [];
}

export function useSwapPools() {
  return useCallsData(
    useCallback(async () => {
      const pools = await getSwapPools();
      const _pools = pools.filter((pool) => pool !== undefined) as PoolInfo[];
      return _pools;
    }, []),
  );
}

export async function getSwapPoolTokenStandard(canisterId: string, tokenId: string) {
  return (await (await v2SwapPool(canisterId)).getStandard(tokenId)) as TOKEN_STANDARD;
}

export function useSwapPoolTokenStandard(canisterId: string | undefined, tokenId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !tokenId) return undefined;
      return await getSwapPoolTokenStandard(canisterId, tokenId);
    }, [canisterId, tokenId]),
  );
}

export async function getSwapPoolIdByKey(key: string) {
  return await (await v2SwapFactory()).getPool(key);
}

export function useSwapPoolIdByKey(key: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!key) return undefined;
      return await getSwapPoolIdByKey(key);
    }, [key]),
  );
}

export async function getSwapPoolTicks(canisterId: string) {
  return resultFormat<TickLiquidityInfo[]>(await (await v2SwapPool(canisterId)).getTickInfos()).data;
}

export function useLiquidityTicks(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolTicks(canisterId);
    }, [canisterId]),
  );
}
