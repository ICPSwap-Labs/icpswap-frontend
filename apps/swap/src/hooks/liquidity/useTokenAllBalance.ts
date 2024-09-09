import { useMemo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { useStoreTokenBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import { useUserUnusedBalance, useTokenBalance } from "@icpswap/hooks";
import { BigNumber, nonNullArgs } from "@icpswap/utils";

interface UseTokenAllBalanceProps {
  token0: Token | undefined;
  token1: Token | undefined;
  poolId: string | undefined;
  refresh?: number;
}

// Set the token0SubAccountBalance, token0SubAccountBalance, unusedBalance is 0 by default
// When pool is not created the value is undefined
// TODO: Fix this?
export function useTokenAllBalance({ token0, token1, poolId, refresh }: UseTokenAllBalanceProps) {
  const principal = useAccountPrincipal();

  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const { result: token0Balance } = useStoreTokenBalance(principal, token0, refresh);
  const { result: token1Balance } = useStoreTokenBalance(principal, token1, refresh);

  const { result: token0SubAccountBalance } = useTokenBalance({
    canisterId: token0?.address,
    address: poolId,
    sub,
    refresh,
  });
  const { result: token1SubAccountBalance } = useTokenBalance({
    canisterId: token1?.address,
    address: poolId,
    sub,
    refresh,
  });
  const { result: unusedBalance } = useUserUnusedBalance(poolId, principal, refresh);

  return useMemo(() => {
    return {
      unusedBalance: unusedBalance ?? { balance0: BigInt(0), balance1: BigInt(0) },
      token0Balance,
      token1Balance,
      token0SubAccountBalance: token0SubAccountBalance ?? new BigNumber(0),
      token1SubAccountBalance: token1SubAccountBalance ?? new BigNumber(0),
      token0AllBalance:
        nonNullArgs(token0Balance) && nonNullArgs(token0SubAccountBalance) && nonNullArgs(unusedBalance)
          ? token0Balance.plus(token0SubAccountBalance).plus(unusedBalance.balance0.toString())
          : undefined,
      token1AllBalance:
        nonNullArgs(token1Balance) && nonNullArgs(token1SubAccountBalance) && nonNullArgs(unusedBalance)
          ? token1Balance.plus(token1SubAccountBalance).plus(unusedBalance.balance1.toString())
          : undefined,
    };
  }, [token0, token1, unusedBalance, token0SubAccountBalance, token1SubAccountBalance, token0Balance, token1Balance]);
}
