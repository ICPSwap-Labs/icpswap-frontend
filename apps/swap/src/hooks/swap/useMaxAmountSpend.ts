import { CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { BigNumber, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useAllowance } from "hooks/token";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { isUseTransfer } from "utils/token";

export interface UseMaxPoolBalanceSpendProps {
  token: Token | Null;
  subBalance: string | Null;
  unusedBalance: bigint | Null;
}

export function usePoolBalanceMaxSpend({ token, subBalance, unusedBalance }: UseMaxPoolBalanceSpendProps) {
  return useMemo(() => {
    if (!token || isNullArgs(unusedBalance) || isNullArgs(subBalance)) return undefined;

    const totalPoolBalance = new BigNumber(unusedBalance.toString()).plus(subBalance);

    if (totalPoolBalance.isEqualTo(0)) return CurrencyAmount.fromRawAmount(token, 0);

    // The token use transfer to deposit
    // 1 token fee is needed  for deposit
    if (isUseTransfer(token)) {
      // No token fee needed
      if (new BigNumber(subBalance).isEqualTo(0)) {
        return CurrencyAmount.fromRawAmount(token, unusedBalance.toString());
      }

      return CurrencyAmount.fromRawAmount(
        token,
        new BigNumber(unusedBalance.toString()).plus(subBalance).minus(token.transFee).toString(),
      );
    }

    // If token use approve, no token fee needed
    // And the subAccountBalance is 0
    return CurrencyAmount.fromRawAmount(
      token,
      new BigNumber(unusedBalance.toString()).plus(subBalance.toString()).toString(),
    );
  }, [unusedBalance, subBalance]);
}

export interface UseMaxBalanceSpendArgs {
  token: Token | Null;
  balance: string | Null;
  poolId?: string | Null;
  allowance?: bigint | Null;
}

export function useBalanceMaxSpend({ token, balance, poolId, allowance: __allowance }: UseMaxBalanceSpendArgs) {
  const principal = useAccountPrincipalString();

  const allowanceCanisterId = useMemo(() => {
    if (!token || nonNullArgs(__allowance)) return undefined;
    return isUseTransfer(token) ? undefined : token.address;
  }, [token, __allowance]);

  const { result: allowance } = useAllowance({ canisterId: allowanceCanisterId, owner: principal, spender: poolId });

  return useMemo(() => {
    if (isNullArgs(balance) || isNullArgs(token)) return undefined;

    if (new BigNumber(balance).isEqualTo(0)) return CurrencyAmount.fromRawAmount(token, 0);

    // The token use transfer to deposit
    // 2 token fee is needed, 1 for deposit, 1 for token canister
    if (isUseTransfer(token)) {
      return CurrencyAmount.fromRawAmount(token, new BigNumber(balance).minus(token.transFee * 2).toString());
    }

    // The token use approve to deposit
    const innerAllowance = (allowance ?? __allowance) as bigint;

    // If token use approve, subaccount balance is 0
    // The tokens use approve to deposit, but can't get allowance, so 2 trans fee is needed
    if (innerAllowance === undefined) {
      return CurrencyAmount.fromRawAmount(token, new BigNumber(balance).minus(token.transFee * 2).toString());
    }

    // Need call token approve, would cost one transfer fee
    if (new BigNumber(innerAllowance.toString()).isLessThan(balance)) {
      return CurrencyAmount.fromRawAmount(token, new BigNumber(balance).minus(token.transFee * 2).toString());
    }

    return CurrencyAmount.fromRawAmount(token, new BigNumber(balance).minus(token.transFee).toString());
  }, [allowance, __allowance, token, balance, allowanceCanisterId]);
}

export interface UseMaxAmountSpendArgs {
  token: Token | Null;
  balance: string | Null;
  poolId?: string | Null;
  subBalance: string | Null;
  unusedBalance: bigint | Null;
  allowance?: bigint | Null;
}

export function useAllBalanceMaxSpend({
  poolId,
  subBalance,
  unusedBalance,
  allowance: __allowance,
  token,
  balance,
}: UseMaxAmountSpendArgs) {
  const maxBalanceSpend = useBalanceMaxSpend({ token, balance, poolId, allowance: __allowance });
  const maxPoolBalanceSpent = usePoolBalanceMaxSpend({ token, subBalance, unusedBalance });

  return useMemo(() => {
    if (isNullArgs(maxBalanceSpend) || isNullArgs(maxPoolBalanceSpent) || isNullArgs(token)) return undefined;
    if (!maxBalanceSpend.currency.equals(maxPoolBalanceSpent.currency)) return undefined;

    return maxBalanceSpend.add(maxPoolBalanceSpent);
  }, [maxBalanceSpend, maxPoolBalanceSpent]);
}
