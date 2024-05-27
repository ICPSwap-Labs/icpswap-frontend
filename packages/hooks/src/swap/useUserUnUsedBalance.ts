/* eslint-disable no-console */
import { useEffect, useMemo, useState } from "react";
import type { SwapPoolData, UserSwapPoolsBalance } from "@icpswap/types";
import { Principal } from "@dfinity/principal";
import { getUserUnusedBalance, _getSwapPoolAllBalance } from "./calls";

const CALL_LIMITED = 20;

let unused_fetch_index = -1;

export function useUserUnUsedBalance(
  principal: string | undefined,
  _pools: SwapPoolData[] | undefined,
  selectedTokenId?: string,
  reload?: boolean,
) {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<(UserSwapPoolsBalance | undefined)[]>([]);

  const pools = useMemo(() => {
    if (!selectedTokenId) return _pools;
    return _pools?.filter((pool) => pool.token0.address === selectedTokenId || pool.token1.address === selectedTokenId);
  }, [_pools, selectedTokenId]);

  const poolIds = useMemo(() => {
    return pools?.map((pool) => pool.canisterId.toString());
  }, [pools]);

  useEffect(() => {
    unused_fetch_index++;
  }, [selectedTokenId]);

  const _fetch = async (poolId: string, fetch_index: number) => {
    if (!principal) return undefined;

    try {
      if (fetch_index !== unused_fetch_index) {
        console.log("abort");
        return undefined;
      }

      const _result = await getUserUnusedBalance(poolId, Principal.fromText(principal));
      if (!_result) return undefined;

      const pool = pools?.filter((pool) => pool.canisterId.toString() === poolId)[0];
      if (!pool) return undefined;

      return { ...pool, type: "unUsed", ..._result } as UserSwapPoolsBalance;
    } catch (err) {
      console.error(err);
    }

    return undefined;
  };

  useEffect(() => {
    const call = async (new_index: number) => {
      if (!poolIds) return;

      const calls: (() => Promise<UserSwapPoolsBalance | undefined>)[][] = [[]];

      for (let i = 0; i < poolIds.length; i++) {
        if (i % CALL_LIMITED === 0 && i !== 0) {
          calls.push([]);
        }

        const pool = poolIds[i];

        calls[calls.length - 1].push(async () => await _fetch(pool, new_index));
      }

      let allResult: (UserSwapPoolsBalance | undefined)[] = [];

      for (let i = 0; i < calls.length; i++) {
        const _calls = calls[i].map(async (call) => await call());
        const result = await Promise.all(_calls);
        allResult = allResult.concat(result);
      }

      if (new_index === unused_fetch_index) {
        setBalances(allResult);
        setLoading(false);
      }
    };

    if (poolIds && principal) {
      const new_index = unused_fetch_index;

      setBalances([]);
      setLoading(true);
      call(new_index);
    }
  }, [poolIds, reload, principal]);

  return useMemo(() => {
    const _balances = !selectedTokenId
      ? balances
      : (balances.filter((e) => !!e) as UserSwapPoolsBalance[]).map((e) => {
          return {
            ...e,
            balance0: e.token0.address === selectedTokenId ? e.balance0 : BigInt(0),
            balance1: e.token1.address === selectedTokenId ? e.balance1 : BigInt(0),
          };
        });

    return { loading, balances: _balances };
  }, [loading, balances, selectedTokenId]);
}
