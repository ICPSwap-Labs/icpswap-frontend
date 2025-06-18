import { useMemo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { getTokenInsufficient } from "hooks/swap/index";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Null } from "@icpswap/types";

export interface useSwapTokenFeeCostProps {
  tokenBalance: string | undefined;
  subAccountBalance: string | undefined;
  unusedBalance: bigint | undefined;
  token: Token | Null;
  amount: string | undefined;
}

export function useSwapTokenFeeCost({
  token,
  tokenBalance,
  subAccountBalance,
  unusedBalance,
  amount,
}: useSwapTokenFeeCostProps) {
  return useMemo(() => {
    if (
      isUndefinedOrNull(token) ||
      isUndefinedOrNull(tokenBalance) ||
      isUndefinedOrNull(subAccountBalance) ||
      isUndefinedOrNull(unusedBalance) ||
      isUndefinedOrNull(amount)
    )
      return undefined;

    const tokenInsufficient = getTokenInsufficient({
      token,
      subAccountBalance,
      balance: tokenBalance,
      formatTokenAmount: amount,
      unusedBalance,
    });

    if (tokenInsufficient === "NO_TRANSFER_APPROVE") return "0";
    if (tokenInsufficient === "NEED_DEPOSIT_FROM_SUB") return token.transFee.toString();
    if (tokenInsufficient === "NEED_TRANSFER_APPROVE") return (token.transFee * 2).toString();

    return "0";
  }, [token, tokenBalance, subAccountBalance, unusedBalance]);
}
