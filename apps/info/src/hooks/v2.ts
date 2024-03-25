/* eslint-disable import/named */
import { useCallback, useEffect, useState, useMemo } from "react";
import { isAvailablePageArgs, availableArgsNull, resultFormat } from "@icpswap/utils";
import type { CallResult } from "@icpswap/types";
import { useCallsData } from "@icpswap/hooks";
import { analyticPool, analyticToken, analyticSwap, v2SwapPool } from "./v2-actor";
import {
  Pool,
  Transaction,
  ChartData,
  Token,
  ProtocolResult,
  TokenPriceChartData,
  PoolInfo,
  PublicTokenChartDayData,
  TransactionType,
} from "../types/analytic-v2";

export function useGraphAllPools(id?: bigint) {
  return useCallsData<Pool[]>(
    useCallback(async () => {
      return await (await analyticPool()).getAllPools(availableArgsNull<bigint>(id));
    }, [id]),
  );
}

export function useGraphPool(canisterId: string | undefined | null) {
  return useCallsData<Pool>(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await (await analyticPool()).getPool(canisterId!);
    }, [canisterId]),
  );
}

export async function getGraphPoolTransactions(canisterId: string, offset: number, limit: number) {
  return await (await analyticPool()).getPoolTransactions(canisterId, BigInt(offset), BigInt(limit));
}

export function useGraphPoolTransactions(canisterId: string | undefined | null, offset: number, limit: number) {
  return useCallsData<Transaction[]>(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getGraphPoolTransactions(canisterId!, offset, limit);
    }, [canisterId, offset, limit]),
  );
}

export function useGraphPoolTVLChartData(canisterId: string | undefined | null, offset: number, limit: number) {
  return useCallsData<ChartData[]>(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await (await analyticPool()).getPoolChartData(canisterId!, BigInt(offset), BigInt(limit));
    }, [canisterId, offset, limit]),
  );
}

export function useGraphAllTokens(id?: bigint) {
  return useCallsData<Token[]>(
    useCallback(async () => {
      const result = (await (await analyticToken()).getAllToken(availableArgsNull<bigint>(id))) as Token[];
      return (result ?? []).filter((token) => {
        return !(
          token.priceUSD === 0 &&
          token.priceUSDChange === 0 &&
          token.totalVolumeUSD === 0 &&
          token.volumeUSD === 0
        );
      });
    }, []),
  );
}

export function useGraphToken(canisterId: string | undefined | null) {
  return useCallsData<Token>(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await (await analyticToken()).getToken(canisterId!);
    }, [canisterId]),
  );
}

export function useGraphTokenTransactions(canisterId: string | undefined | null, offset: number, limit: number) {
  return useCallsData<Transaction[]>(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await (await analyticToken()).getTokenTransactions(canisterId!, BigInt(offset), BigInt(limit));
    }, [canisterId, offset, limit]),
  );
}

export function useGraphTokenPools(canisterId: string | undefined | null) {
  return useCallsData<PoolInfo[]>(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await (await analyticToken()).getPoolsForToken(canisterId!);
    }, [canisterId]),
  );
}

export function useGraphTokenPoolsDetails(canisterId: string | undefined | null): CallResult<Pool[]> {
  const { result: tokenPools, loading: poolsLoading } = useGraphTokenPools(canisterId);

  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (poolsLoading) setLoading(true);

    const call = async () => {
      setLoading(true);

      Promise.all(
        tokenPools!.map(async (tokenPool) => {
          const poolInfo = (await (await analyticPool()).getPool(tokenPool.pool)) as Pool;
          return poolInfo;
        }),
      ).then((result) => {
        const pools = result.filter(
          (pool) =>
            !(pool.feeTier === BigInt(0) && pool.token0Price === 0 && pool.token1Price === 0 && pool.volumeUSD === 0),
        );

        setPools(pools);
        setLoading(false);
      });
    };

    if (tokenPools?.length) {
      call();
    }
  }, [tokenPools, poolsLoading]);

  return useMemo(
    () => ({
      loading,
      result: pools,
    }),
    [pools, loading],
  );
}

export function useGraphTokenTVLChartData(canisterId: string | undefined | null, offset: number, limit: number) {
  return useCallsData<PublicTokenChartDayData[]>(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await (await analyticToken()).getTokenChartData(canisterId!, BigInt(offset), BigInt(limit));
    }, [canisterId, offset, limit]),
  );
}

export function useGraphSwapProtocolData() {
  return useCallsData<ProtocolResult>(
    useCallback(async () => {
      return await (await analyticSwap()).getProtocolData();
    }, []),
  );
}

export function useGraphSwapProtocolChart(offset: number, limit: number) {
  return useCallsData<ChartData[]>(
    useCallback(async () => {
      const result = ((await (await analyticSwap()).getChartData(BigInt(offset), BigInt(limit))) ?? []) as ChartData[];
      return result.reverse();
    }, []),
  );
}

export function useGraphTokenPriceChartData(
  canisterId: string,
  startTimestamp: number | bigint,
  _interval: number | bigint,
  limit: number | bigint,
) {
  return useCallsData<TokenPriceChartData[]>(
    useCallback(async () => {
      return await (
        await analyticToken()
      ).getTokenPricesData(canisterId, BigInt(startTimestamp), BigInt(_interval), BigInt(limit));
    }, []),
  );
}

export interface useGraphSwapTransactionProps {
  token0: string;
  token1: string;
  fee: number;
  type: string | undefined;
  offset: number;
  limit: number;
}

export async function getGraphSwapTransactions({
  token0,
  token1,
  fee,
  type,
  offset,
  limit,
}: useGraphSwapTransactionProps) {
  return await (
    await analyticSwap()
  ).getAllTransactions(
    token0,
    token1,
    BigInt(fee),
    availableArgsNull<TransactionType>(type ? ({ [type]: null } as TransactionType) : undefined),
    BigInt(offset),
    BigInt(limit),
  );
}

export function useGraphSwapTransactions({ token0, token1, fee, type, offset, limit }: useGraphSwapTransactionProps) {
  return useCallsData(
    useCallback(async () => {
      if (!token0 || !token1 || !fee || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getGraphSwapTransactions({ token0, token1, fee, type, offset, limit });
    }, [token0, token1, fee, type, offset, limit]),
  );
}

export function useGraphSwapUserTransaction(account: string, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;
      return await (await analyticSwap()).get(account, BigInt(offset), BigInt(limit));
    }, [account, offset, limit]),
  );
}

export interface SwapPoolInfo {
  fee: bigint;
  ticks: Array<bigint>;
  pool: string;
  liquidity: bigint;
  tickCurrent: bigint;
  token0: string;
  token1: string;
  sqrtRatioX96: bigint;
  balance0: bigint;
  balance1: bigint;
}

export async function getSwapPoolInfo(canisterId: string) {
  return resultFormat<SwapPoolInfo>(await (await v2SwapPool(canisterId)).infoWithNoBalance()).data;
}

export function useSwapPoolInfo(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolInfo(canisterId!);
    }, [canisterId]),
  );
}
