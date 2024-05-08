/* eslint-disable no-console */
import { useMemo } from "react";
import type { UserSwapPoolsBalance } from "@icpswap/types";
import { useSwapPools, _getSwapPoolAllBalance } from "./calls";
import { useUserUnDepositBalance } from "./useUserUnDepositBalance";
import { useUserUnUsedBalance } from "./useUserUnUsedBalance";

export function useUserSwapUnusedBalanceByPoolId(
  principal: string | undefined,
  poolId: string | undefined,
  reload?: boolean,
) {
  const { result: allSwapPools } = useSwapPools();

  const pools = useMemo(() => {
    if (!poolId || !allSwapPools) return undefined;
    return allSwapPools.filter((ele) => ele.canisterId.toString() === poolId);
  }, [allSwapPools, poolId]);

  const { loading: unDepositBalanceLoading, balances: unDepositBalances } = useUserUnDepositBalance(
    principal,
    pools,
    undefined,
    reload,
  );

  const { loading: unUsedBalanceLoading, balances: unUsedBalances } = useUserUnUsedBalance(
    principal,
    pools,
    undefined,
    reload,
  );

  return useMemo(
    () => ({
      loading: unUsedBalanceLoading || unDepositBalanceLoading,
      pools,
      balances: unUsedBalances.concat(unDepositBalances).filter((balances) => !!balances) as UserSwapPoolsBalance[],
    }),
    [pools, unUsedBalanceLoading, unUsedBalances, unDepositBalanceLoading, unDepositBalances],
  );
}
