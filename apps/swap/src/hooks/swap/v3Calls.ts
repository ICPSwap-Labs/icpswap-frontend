import { useCallback, useEffect, useMemo, useState } from "react";
import { getSwapTokenArgs } from "hooks/token/index";
import { userStorage, swapPool } from "@icpswap/actor";
import {
  useCallsData,
  useInfoUserStorageIds,
  quote,
  getSwapPoolMetadata,
  getSwapPosition,
  getSwapPool,
  createSwapPool,
  _getSwapPoolAllBalance,
} from "@icpswap/hooks";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { FeeAmount } from "@icpswap/swap-sdk";
import type { PaginationResult, SwapPoolData, UserStorageTransaction } from "@icpswap/types";
import BigNumber from "bignumber.js";
import { swapFactory_update_call } from "actor/swap";
import { UserPosition } from "types/swap";
import { Identity } from "types/global";
import { Principal } from "@dfinity/principal";
import { useStateCallsData } from "hooks/useCallsData";
import { sortToken } from "utils/swap";

export async function getPool(token0: string, token1: string, fee: FeeAmount = FeeAmount.MEDIUM) {
  const sortedToken = sortToken(token0, token1);

  return await getSwapPool({
    fee: BigInt(fee),
    token0: getSwapTokenArgs(sortedToken.token0),
    token1: getSwapTokenArgs(sortedToken.token1),
  });
}

export async function getPool_update_call(token0: string, token1: string, fee: FeeAmount = FeeAmount.MEDIUM) {
  const sortedToken = sortToken(token0, token1);

  return resultFormat<SwapPoolData>(
    await (
      await swapFactory_update_call()
    ).getPool({
      fee: BigInt(fee),
      token0: getSwapTokenArgs(sortedToken.token0),
      token1: getSwapTokenArgs(sortedToken.token1),
    }),
  ).data;
}

export async function createPool(
  identity: Identity,
  token0: string,
  token1: string,
  fee: FeeAmount,
  sqrtPriceX96: string,
) {
  let _token0 = token0;
  let _token1 = token1;

  if (_token0 > _token1) {
    _token0 = token1;
    _token1 = token0;
  }

  return await createSwapPool(identity, {
    fee: BigInt(fee),
    token0: getSwapTokenArgs(_token0),
    token1: getSwapTokenArgs(_token1),
    sqrtPriceX96,
  });
}

export { deposit, mint, increaseLiquidity, decreaseLiquidity, quote, swap, collect, withdraw } from "@icpswap/hooks";

export async function getPositionDetailsFromId(poolId: string, positionId: string) {
  const pool = await getSwapPoolMetadata(poolId);
  const position = await getSwapPosition(poolId, BigInt(positionId));

  if (pool && position) {
    return {
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      liquidity: position.liquidity,
      tokensOwed0: position.tokensOwed0,
      tokensOwed1: position.tokensOwed1,
      feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
      feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
      index: Number(positionId),
      id: poolId,
      token0: pool.token0.address,
      token1: pool.token1.address,
      fee: pool.fee.toString(),
    } as UserPosition;
  }

  return undefined;
}

export function usePositionDetailsFromId(poolId: string | undefined, positionId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (poolId === undefined || positionId === undefined) return undefined;
      return await getPositionDetailsFromId(poolId, positionId);
    }, [poolId, positionId]),
  );
}

export function useQuoteExactInput(args: string | undefined) {
  const call = useCallback(async () => {
    if (!args) return undefined;

    const _args = JSON.parse(args) as { amountIn: string; zeroForOne: boolean; poolId: string };

    return await quote(_args.poolId, {
      amountIn: _args.amountIn,
      zeroForOne: _args.zeroForOne,
      amountOutMinimum: "0",
    });
  }, [args]);

  return useStateCallsData(call, "quoteExactInput", !!args);
}

export function useQuoteUnitPrice(
  poolId: string | undefined,
  amountIn: string | undefined,
  zeroForOne: boolean | undefined,
) {
  return useCallsData(
    useCallback(async () => {
      if (!amountIn || amountIn === "0" || !poolId || zeroForOne === undefined) return undefined;
      return await quote(poolId, {
        amountIn,
        zeroForOne,
        amountOutMinimum: "0",
      });
    }, [amountIn, poolId, zeroForOne]),
  );
}

export async function getPoolCanisterId(token0Id: string, token1Id: string, fee: FeeAmount) {
  const pool = await getPool(token0Id, token1Id, fee);
  return pool?.canisterId.toString();
}

export function usePoolCanisterId(
  token0Id: string | undefined | null,
  token1Id: string | undefined | null,
  fee: FeeAmount | undefined | null,
) {
  return useCallsData(
    useCallback(async () => {
      if (!token0Id || !token1Id || !fee) return undefined;
      return await getPoolCanisterId(token0Id, token1Id, fee);
    }, [token0Id, token1Id, fee]),
  );
}

export type TokenAmounts = [Principal, { balance0: bigint; balance1: bigint }];

export async function getPoolTokenAmounts(poolId: string) {
  const result = await _getSwapPoolAllBalance(poolId);

  if (result) {
    return result.reduce(
      (prev, curr) => {
        return {
          balance0: prev.balance0.plus(curr[1].balance0.toString()),
          balance1: prev.balance1.plus(curr[1].balance1.toString()),
        };
      },
      { balance0: new BigNumber(0), balance1: new BigNumber(1) },
    );
  }

  return undefined;
}

export function usePoolTokenAmounts(poolId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return await getPoolTokenAmounts(poolId);
    }, [poolId]),
  );
}

export type Key = {
  token0: string;
  token1: string;
  fee: FeeAmount;
};

export function usePoolIdsFromKey(keys: (Key | undefined)[] | undefined) {
  const [ids, setIds] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    const call = async () => {
      const queries = keys?.map(async (key) => {
        if (!key) return undefined;
        return await getPoolCanisterId(key.token0, key.token1, key.fee);
      });

      if (queries && !!queries.length) {
        const ids = await Promise.all<string | undefined>(queries);
        setIds(ids);
      }
    };

    call();
  }, [keys]);

  return useMemo(() => ids, [ids]);
}

export function usePoolIdFromKey(key: Key | undefined) {
  const ids = usePoolIdsFromKey([key]);
  return useMemo(() => ids[0], [ids]);
}

export function usePoolsTokenAmountsFromKey(keys: (Key | undefined)[] | undefined) {
  const [amounts, setAmounts] = useState<({ balance0: BigNumber; balance1: BigNumber } | undefined)[]>([]);
  const [loading, setLoading] = useState(false);

  const ids = usePoolIdsFromKey(keys);

  useEffect(() => {
    const call = async () => {
      if (ids.length) {
        setLoading(true);
        const queries = ids?.map(async (id) => {
          if (id) return await getPoolTokenAmounts(id);
          return undefined;
        });

        if (queries && !!queries.length) {
          const results = await Promise.all<{ balance0: BigNumber; balance1: BigNumber } | undefined>(queries);
          setAmounts(results);
        }
        setLoading(false);
      }
    };

    call();
  }, [ids]);

  return useMemo(() => ({ result: amounts, loading }), [amounts, loading]);
}

export function usePoolTokenAmountsFromKey(key: Key | undefined) {
  const keys = useMemo(() => [key], [key]);
  const { result, loading } = usePoolsTokenAmountsFromKey(keys);
  return useMemo(() => ({ result: result[0], loading }), [result, loading]);
}

export function useUserSwapTransactions(principal: string | undefined, offset: number, limit: number) {
  const { result: storageIds } = useInfoUserStorageIds(principal);

  const storageId = useMemo(() => {
    if (!storageIds) return undefined;
    return storageIds[storageIds.length - 1];
  }, [storageIds]);

  return useCallsData(
    useCallback(async () => {
      if (!storageId || !principal || !isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<UserStorageTransaction>>(
        await (await userStorage(storageId)).get(principal, BigInt(offset), BigInt(limit), []),
      ).data;
    }, [principal, offset, limit, storageId]),
  );
}

export async function getSwapPoolAvailable(canisterId: string) {
  const result = resultFormat<{ whitelist: string[]; available: boolean }>(
    await (await swapPool(canisterId)).getAvailabilityState(),
  ).data;

  return result?.available;
}

export function useSwapPoolAvailable(canisterId: string | undefined) {
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const call = async () => {
      if (!canisterId) return;
      const available = await getSwapPoolAvailable(canisterId);
      setAvailable(!!available);
    };

    call();
  }, [canisterId]);

  return useMemo(() => available, [available]);
}
