import { useMemo } from "react";
import type { UserSwapPoolsBalance, SwapPoolData } from "@icpswap/types";
import { Pool } from "@icpswap/swap-sdk";

import { Principal } from "@dfinity/principal";
import { _getSwapPoolAllBalance } from "./calls";
import { useUserUnDepositBalance } from "./useUserUnDepositBalance";
import { useUserUnUsedBalance } from "./useUserUnUsedBalance";

export function useSwapUserUnusedTokenByPool(
  pool: Pool | undefined | null,
  principal: Principal | undefined,
  reload?: boolean | number,
) {
  const __pools = useMemo(() => {
    if (!pool) return undefined;

    return [
      {
        fee: BigInt(pool.fee),
        key: "",
        tickSpacing: BigInt(pool.tickSpacing),
        token0: {
          address: pool.token0.address,
          standard: pool.token0.standard,
        },
        token1: {
          address: pool.token1.address,
          standard: pool.token1.standard,
        },
        canisterId: Principal.fromText(pool.id),
      } as SwapPoolData,
    ];
  }, [pool?.id.toString()]);

  const { loading: unDepositBalanceLoading, balances: unDepositBalances } = useUserUnDepositBalance(
    principal?.toString(),
    __pools,
    undefined,
    reload,
  );

  const { loading: unUsedBalanceLoading, balances: unUsedBalances } = useUserUnUsedBalance(
    principal?.toString(),
    __pools,
    undefined,
    reload,
  );

  return useMemo(
    () => ({
      loading: unUsedBalanceLoading || unDepositBalanceLoading,
      pools: __pools,
      balances: unUsedBalances.concat(unDepositBalances).filter((balances) => !!balances) as UserSwapPoolsBalance[],
    }),
    [__pools, unUsedBalanceLoading, unUsedBalances, unDepositBalanceLoading, unDepositBalances],
  );
}
