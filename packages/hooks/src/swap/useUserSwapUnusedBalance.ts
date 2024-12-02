/* eslint-disable no-console */
import { useMemo } from "react";
import type { Null, UserSwapPoolsBalance } from "@icpswap/types";
import { useSwapPools, _getSwapPoolAllBalance } from "./calls";
import { useUserUnDepositBalance } from "./useUserUnDepositBalance";
import { useUserUnUsedBalance } from "./useUserUnUsedBalance";

export function useUserSwapPoolBalances(principal: string | Null, selectedTokenId?: string, reload?: boolean) {
  const { result: pools } = useSwapPools();

  const { loading: unDepositBalanceLoading, balances: unDepositBalances } = useUserUnDepositBalance(
    principal,
    pools,
    selectedTokenId,
    reload,
  );
  const { loading: unUsedBalanceLoading, balances: unUsedBalances } = useUserUnUsedBalance(
    principal,
    pools,
    selectedTokenId,
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
