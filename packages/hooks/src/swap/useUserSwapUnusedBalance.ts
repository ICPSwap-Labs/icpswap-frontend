import { useMemo } from "react";
import type { Null, UserSwapPoolsBalance, SwapPoolData } from "@icpswap/types";

import { useSwapPools, _getSwapPoolAllBalance } from "./calls";
import { useUserUnDepositBalance } from "./useUserUnDepositBalance";
import { useUserUnUsedBalance } from "./useUserUnUsedBalance";
import { useAllPoolsTVL } from "../info";

interface UseUserSwapPoolBalancesProps {
  principal: string | Null;
  tokenId?: string | Null;
  reload?: boolean;
  poolId?: string | Null;
}

export function useUserSwapPoolBalances({ principal, tokenId, reload, poolId }: UseUserSwapPoolBalancesProps) {
  const { result: allSwapPools } = useSwapPools();
  const { result: allPoolsTvl, loading: tvlLoading } = useAllPoolsTVL();

  const targetSwapPools = useMemo(() => {
    if (!allPoolsTvl || !allSwapPools) return [];
    if (poolId) return allSwapPools.filter((e) => e.canisterId.toString() === poolId);

    const __allSwapPools = allSwapPools.map((pool) => {
      const tvlUSD = allPoolsTvl.find(([poolId]) => pool.canisterId.toString() === poolId)?.[1];

      return { ...pool, tvlUSD: tvlUSD ?? 0 };
    });

    return __allSwapPools.sort((a, b) => {
      if (a.tvlUSD > b.tvlUSD) return -1;
      if (a.tvlUSD < b.tvlUSD) return 1;
      return 0;
    }) as SwapPoolData[];
  }, [allSwapPools, allPoolsTvl, poolId]);

  const { loading: unDepositBalanceLoading, balances: unDepositBalances } = useUserUnDepositBalance(
    principal,
    targetSwapPools,
    tokenId,
    reload,
  );
  const { loading: unUsedBalanceLoading, balances: unUsedBalances } = useUserUnUsedBalance(
    principal,
    targetSwapPools,
    tokenId,
    reload,
  );

  return useMemo(
    () => ({
      loading: unUsedBalanceLoading || unDepositBalanceLoading || tvlLoading,
      allSwapPools,
      balances: unUsedBalances.concat(unDepositBalances).filter((balances) => !!balances) as UserSwapPoolsBalance[],
    }),
    [allSwapPools, tvlLoading, unUsedBalanceLoading, unUsedBalances, unDepositBalanceLoading, unDepositBalances],
  );
}
