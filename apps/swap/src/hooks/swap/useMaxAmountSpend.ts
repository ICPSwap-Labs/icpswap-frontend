import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { BigNumber, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useAllowance } from "hooks/token";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { isUseTransfer } from "utils/token";

export interface UseMaxAmountSpendArgs {
  currencyAmount: CurrencyAmount<Token> | undefined;
  poolId?: string;
  subBalance?: BigNumber | Null;
  unusedBalance?: bigint | Null;
  allowance?: bigint | Null;
}

export function useMaxAmountSpend({
  currencyAmount,
  poolId,
  subBalance,
  unusedBalance,
  allowance: __allowance,
}: UseMaxAmountSpendArgs) {
  const principal = useAccountPrincipalString();

  const token = useMemo(() => {
    if (!currencyAmount) return undefined;
    return currencyAmount?.wrapped.currency;
  }, [currencyAmount]);

  const allowanceCanisterId = useMemo(() => {
    if (!token || nonNullArgs(__allowance)) return undefined;
    return isUseTransfer(token) ? undefined : token.address;
  }, [token, __allowance]);

  const { result: allowance } = useAllowance({ canisterId: allowanceCanisterId, owner: principal, spender: poolId });

  return useMemo(() => {
    if (!currencyAmount || isNullArgs(unusedBalance)) return undefined;

    // The token use transfer to deposit
    // 2 token fee is needed, 1 for deposit, 1 for token canister
    if (isUseTransfer(token)) {
      return currencyAmount
        .add(CurrencyAmount.fromRawAmount(currencyAmount.currency, unusedBalance?.toString() ?? 0))
        .add(CurrencyAmount.fromRawAmount(currencyAmount.currency, subBalance?.toString() ?? 0))
        .subtract(CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee * 2));
    }

    // The token use approve to deposit
    const innerAllowance = (allowance ?? __allowance) as bigint;

    // If token use approve, subaccount balance is 0
    // The tokens use approve to deposit, but can't get allowance, so 2 trans fee is needed
    if (innerAllowance === undefined) {
      return currencyAmount
        .add(CurrencyAmount.fromRawAmount(currencyAmount.currency, unusedBalance?.toString() ?? 0))
        .subtract(CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee * 2));
    }

    // Need call token approve, would cost one transfer fee
    if (new BigNumber(innerAllowance.toString()).isLessThan(currencyAmount.quotient.toString())) {
      return currencyAmount
        .add(CurrencyAmount.fromRawAmount(currencyAmount.currency, unusedBalance?.toString() ?? 0))
        .subtract(CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee * 2));
    }

    return currencyAmount
      .add(CurrencyAmount.fromRawAmount(currencyAmount.currency, unusedBalance?.toString() ?? 0))
      .subtract(CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee));
  }, [allowance, __allowance, currencyAmount, allowanceCanisterId, unusedBalance, subBalance]);
}
