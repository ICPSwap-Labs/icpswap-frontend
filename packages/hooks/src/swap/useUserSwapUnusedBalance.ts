import { useMemo } from "react";
import type { Null, UserSwapPoolsBalance, SwapPoolData } from "@icpswap/types";

import { useSwapPools, _getSwapPoolAllBalance } from "./calls";
import { useUserUnDepositBalance } from "./useUserUnDepositBalance";
import { useUserUnUsedBalance } from "./useUserUnUsedBalance";
import { useNodeInfoAllPools } from "../info";

interface UseUserSwapPoolBalancesProps {
  principal: string | Null;
  tokenId?: string | Null;
  reload?: boolean;
  poolId?: string | Null;
}

export function useUserSwapPoolBalances({ principal, tokenId, reload, poolId }: UseUserSwapPoolBalancesProps) {
  const { result: allSwapPools } = useSwapPools();
  const { result: infoPools, loading: allPoolsLoading } = useNodeInfoAllPools();

  const targetSwapPools = useMemo(() => {
    if (!infoPools || !allSwapPools) return [];
    if (poolId) return allSwapPools.filter((e) => e.canisterId.toString() === poolId);

    const __allSwapPools = allSwapPools.map((pool) => {
      const volumeUSD = infoPools.find((infoPool) => pool.canisterId.toString() === infoPool.pool)?.volumeUSD7d;
      return { ...pool, volumeUSD: volumeUSD ?? 0 };
    });

    const sortedPools = __allSwapPools.sort((a, b) => {
      if (a.volumeUSD > b.volumeUSD) return -1;
      if (a.volumeUSD < b.volumeUSD) return 1;
      return 0;
    }) as SwapPoolData[];

    return sortedPools;
  }, [allSwapPools, infoPools, poolId]);

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
      loading: unUsedBalanceLoading || unDepositBalanceLoading || targetSwapPools.length === 0,
      allSwapPools,
      balances: unUsedBalances.concat(unDepositBalances).filter((balances) => !!balances) as UserSwapPoolsBalance[],
    }),
    [allSwapPools, targetSwapPools, unUsedBalanceLoading, unUsedBalances, unDepositBalanceLoading, unDepositBalances],
  );
}
