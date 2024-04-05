import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { useAllowance } from "hooks/token";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { isUseTransfer } from "utils/token";

export interface UseMaxAmountSpendArgs {
  currencyAmount: CurrencyAmount<Token> | undefined;
  poolId?: string;
}

export function useMaxAmountSpend({ currencyAmount, poolId }: UseMaxAmountSpendArgs) {
  const principal = useAccountPrincipalString();

  const token = useMemo(() => {
    if (!currencyAmount) return undefined;
    return currencyAmount?.wrapped.currency;
  }, [currencyAmount]);

  const allowanceCanisterId = useMemo(() => {
    if (!token) return undefined;
    return isUseTransfer(token) ? undefined : token.address;
  }, [token]);

  const { result: allowance } = useAllowance({ canisterId: allowanceCanisterId, owner: principal, spender: poolId });

  return useMemo(() => {
    if (!currencyAmount) return undefined;

    // The tokens use transfer to deposit, 1 trans fee is needed
    if (allowanceCanisterId === undefined) {
      return currencyAmount.subtract(
        CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee),
      );
    }

    // The tokens use approve to deposit, but can't get allowance, so 2 trans fee is needed
    if (allowance === undefined) {
      return currencyAmount.subtract(
        CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee * 2),
      );
    }

    // Need call token approve, would cost one transfer fee
    if (new BigNumber(allowance.toString()).isLessThan(currencyAmount.quotient.toString())) {
      return currencyAmount.subtract(
        CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee * 2),
      );
    }

    return currencyAmount.subtract(
      CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.currency.transFee),
    );
  }, [allowance, currencyAmount, allowanceCanisterId]);
}
