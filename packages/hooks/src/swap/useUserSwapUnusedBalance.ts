import { useMemo } from "react";
import type { Null, UserSwapPoolsBalance } from "@icpswap/types";
import { useSwapPools, _getSwapPoolAllBalance } from "./calls";
import { useUserUnDepositBalance } from "./useUserUnDepositBalance";
import { useUserUnUsedBalance } from "./useUserUnUsedBalance";

export function useUserSwapPoolBalances({
  principal,
  tokenId,
  reload,
  poolId,
}: {
  principal: string | Null;
  tokenId?: string | Null;
  reload?: boolean;
  poolId?: string | Null;
}) {
  const { result: allSwapPools } = useSwapPools();

  const targetSwapPools = useMemo(() => {
    if (!poolId || !allSwapPools) return allSwapPools;

    return allSwapPools.filter((e) => e.canisterId.toString() === poolId);
  }, [allSwapPools, poolId]);

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
      loading: unUsedBalanceLoading || unDepositBalanceLoading,
      allSwapPools,
      balances: unUsedBalances.concat(unDepositBalances).filter((balances) => !!balances) as UserSwapPoolsBalance[],
    }),
    [allSwapPools, unUsedBalanceLoading, unUsedBalances, unDepositBalanceLoading, unDepositBalances],
  );
}
