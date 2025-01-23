import { useEffect, useMemo, useState } from "react";
import { Override } from "@icpswap/types";
import { Principal } from "@dfinity/principal";
import { useSwapPools, getUserUnusedBalance, getTokenBalance } from "@icpswap/hooks";
import type { SwapPoolData } from "@icpswap/types";
import { principalToSubaccount } from "@icpswap/utils";

export type UserSwapPoolsBalance = Override<
  SwapPoolData,
  { type: "unDeposit" | "unUsed"; balance0: bigint; balance1: bigint }
>;

export function useUserUnDepositBalance(
  pools: SwapPoolData[] | undefined,
  principal: string | undefined | null,
  reload?: boolean,
) {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<(UserSwapPoolsBalance | null)[]>([]);

  useEffect(() => {
    if (balances.length === pools?.length && pools?.length !== 0) {
      setLoading(false);
    }
  }, [balances, pools]);

  useEffect(() => {
    const _fetch = async (pool: SwapPoolData) => {
      const sub = principalToSubaccount(principal!);

      const call = async (token: { address: string; standard: string }) =>
        token.standard.includes("DIP20")
          ? BigInt(0)
          : await getTokenBalance({
              canisterId: token.address,
              address: pool.canisterId,
              sub,
            });

      Promise.all([call(pool.token0), call(pool.token1)])
        .then((result) => {
          if (result) {
            setBalances((prevState) => {
              return [
                ...prevState,
                {
                  ...pool!,
                  type: "unDeposit",
                  balance0: result[0] ?? BigInt(0),
                  balance1: result[1] ?? BigInt(0),
                },
              ];
            });
          } else {
            setBalances((prevState) => {
              return [...prevState, null];
            });
          }
        })
        .catch(() => {
          setBalances((prevState) => {
            return [...prevState, null];
          });
        });
    };

    const call = async () => {
      if (!pools) return;

      for (let i = 0; i < pools.length; i++) {
        const pool = pools[i];
        _fetch(pool);
      }
    };

    if (pools && principal) {
      setBalances([]);
      setLoading(true);
      call();
    }
  }, [pools, reload, principal]);

  return useMemo(() => ({ loading, balances }), [loading, balances]);
}

export function useUserAllReclaims(principal: string | undefined | null, reload?: boolean) {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<(UserSwapPoolsBalance | null)[]>([]);

  const { result: pools, loading: poolsLoading } = useSwapPools();

  useEffect(() => {
    if (balances.length === pools?.length && pools?.length !== 0) {
      setLoading(false);
    }
  }, [balances, pools]);

  const poolIds = useMemo(() => {
    return pools?.map((pool) => pool.canisterId.toString());
  }, [pools]);

  useEffect(() => {
    const _fetch = async (poolId: string) => {
      getUserUnusedBalance(poolId, Principal.fromText(principal!))
        .then((result) => {
          if (result) {
            setBalances((prevState) => {
              const pool = pools?.filter((pool) => pool.canisterId.toString() === poolId)[0];
              return [...prevState, { ...pool!, type: "unUsed", ...result }];
            });
          } else {
            setBalances((prevState) => {
              return [...prevState, null];
            });
          }
        })
        .catch(() => {
          setBalances((prevState) => {
            return [...prevState, null];
          });
        });
    };

    const call = async () => {
      if (!poolIds) return;

      for (let i = 0; i < poolIds.length; i++) {
        const pool = poolIds[i];
        _fetch(pool);
      }
    };

    if (poolIds && principal) {
      setBalances([]);
      setLoading(true);
      call();
    }
  }, [poolIds, reload, principal]);

  const { loading: unDepositBalanceLoading, balances: unDepositBalances } = useUserUnDepositBalance(
    pools,
    principal,
    reload,
  );

  return useMemo(
    () => ({
      loading: loading || poolsLoading || unDepositBalanceLoading,
      pools,
      balances: balances.concat(unDepositBalances).filter((balances) => !!balances) as UserSwapPoolsBalance[],
    }),
    [pools, poolsLoading, loading, balances, unDepositBalanceLoading, unDepositBalances],
  );
}
