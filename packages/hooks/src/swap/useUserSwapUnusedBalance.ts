import { useEffect, useMemo, useState } from "react";
import { getTokenBalance } from "../token/index";
import {
  useSwapPools,
  getUserUnusedBalance,
  _getSwapPoolAllBalance,
} from "../swap/index";
import type { SwapPoolData, UserSwapPoolsBalance } from "@icpswap/types";
import { SubAccount } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";

const CALL_LIMITED = 20;

let un_deposit_fetch_index = -1;

export function useUserUnDepositBalance(
  principal: string,
  _pools: SwapPoolData[] | undefined,
  selectedTokenId?: string,
  reload?: boolean
) {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<
    (UserSwapPoolsBalance | undefined)[]
  >([]);

  const pools = useMemo(() => {
    if (!selectedTokenId) return _pools;
    return _pools?.filter(
      (pool) =>
        pool.token0.address === selectedTokenId ||
        pool.token1.address === selectedTokenId
    );
  }, [_pools, selectedTokenId]);

  useEffect(() => {
    un_deposit_fetch_index++;
  }, [selectedTokenId]);

  const _fetch = async (pool: SwapPoolData, fetch_index: number) => {
    if (!principal) return undefined;

    const sub = SubAccount.fromPrincipal(
      Principal.fromText(principal)
    ).toUint8Array();

    const call = async (token: { address: string; standard: string }) => {
      let result: bigint | undefined = undefined;

      try {
        if (fetch_index !== un_deposit_fetch_index) {
        } else {
          const _result = token.standard.includes("DIP20")
            ? BigInt(0)
            : await getTokenBalance({
                canisterId: token.address,
                address: pool.canisterId,
                sub,
              });
          result = _result;
        }
      } catch (err) {}

      return result;
    };

    const result = await Promise.all([call(pool.token0), call(pool.token1)]);

    return {
      ...pool,
      type: "unDeposit",
      balance0: result[0] ?? BigInt(0),
      balance1: result[1] ?? BigInt(0),
    } as UserSwapPoolsBalance;
  };

  useEffect(() => {
    const call = async (new_index: number) => {
      if (!pools) return;

      let calls: (() => Promise<UserSwapPoolsBalance | undefined>)[][] = [[]];

      for (let i = 0; i < pools.length; i++) {
        if (i % CALL_LIMITED === 0 && i !== 0) {
          calls.push([]);
        }

        const pool = pools[i];

        calls[calls.length - 1].push(async () => await _fetch(pool, new_index));
      }

      let allResult: (UserSwapPoolsBalance | undefined)[] = [];

      for (let i = 0; i < calls.length; i++) {
        const _calls = calls[i].map(async (call) => await call());
        const result = await Promise.all(_calls);
        allResult = allResult.concat(result);
      }

      if (new_index === un_deposit_fetch_index) {
        setBalances(allResult);
        setLoading(false);
      }
    };

    if (pools && principal) {
      let new_index = un_deposit_fetch_index;
      setBalances([]);
      setLoading(true);
      call(new_index);
    }
  }, [pools, reload, principal]);

  return useMemo(() => {
    const _balances = !selectedTokenId
      ? balances
      : (balances.filter((e) => !!e) as UserSwapPoolsBalance[]).map((e) => {
          return {
            ...e,
            balance0:
              e.token0.address === selectedTokenId ? e.balance0 : BigInt(0),
            balance1:
              e.token1.address === selectedTokenId ? e.balance1 : BigInt(0),
          };
        });

    return { loading, balances: _balances };
  }, [loading, balances, selectedTokenId]);
}

let unused_fetch_index = -1;

export function useUserUnUsedBalance(
  principal: string | undefined,
  _pools: SwapPoolData[] | undefined,
  selectedTokenId?: string,
  reload?: boolean
) {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<
    (UserSwapPoolsBalance | undefined)[]
  >([]);

  const pools = useMemo(() => {
    if (!selectedTokenId) return _pools;
    return _pools?.filter(
      (pool) =>
        pool.token0.address === selectedTokenId ||
        pool.token1.address === selectedTokenId
    );
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
        console.log("abort..");
        return undefined;
      }

      const _result = await getUserUnusedBalance(
        poolId,
        Principal.fromText(principal)
      );
      if (!_result) return undefined;

      const pool = pools?.filter(
        (pool) => pool.canisterId.toString() === poolId
      )[0];
      if (!pool) return undefined;

      return { ...pool, type: "unUsed", ..._result } as UserSwapPoolsBalance;
    } catch (err) {}

    return undefined;
  };

  useEffect(() => {
    const call = async (new_index: number) => {
      if (!poolIds) return;

      let calls: (() => Promise<UserSwapPoolsBalance | undefined>)[][] = [[]];

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
      let new_index = unused_fetch_index;

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
            balance0:
              e.token0.address === selectedTokenId ? e.balance0 : BigInt(0),
            balance1:
              e.token1.address === selectedTokenId ? e.balance1 : BigInt(0),
          };
        });

    return { loading, balances: _balances };
  }, [loading, balances, selectedTokenId]);
}

export function useUserSwapPoolBalances(
  principal: string | undefined,
  selectedTokenId?: string,
  reload?: boolean
) {
  const { result: pools, loading: poolsLoading } = useSwapPools();

  const { loading: unDepositBalanceLoading, balances: unDepositBalances } =
    useUserUnDepositBalance(principal, pools, selectedTokenId, reload);
  const { loading: unUsedBalanceLoading, balances: unUsedBalances } =
    useUserUnUsedBalance(principal, pools, selectedTokenId, reload);

  return useMemo(
    () => ({
      loading: unUsedBalanceLoading || poolsLoading || unDepositBalanceLoading,
      pools,
      balances: unUsedBalances
        .concat(unDepositBalances)
        .filter((balances) => !!balances) as UserSwapPoolsBalance[],
    }),
    [
      pools,
      poolsLoading,
      unUsedBalanceLoading,
      unUsedBalances,
      unDepositBalanceLoading,
      unDepositBalances,
    ]
  );
}
