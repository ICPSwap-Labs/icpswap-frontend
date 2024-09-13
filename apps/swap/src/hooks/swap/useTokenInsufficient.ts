import { Token } from "@icpswap/swap-sdk";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { isUseTransfer } from "utils/token";

export interface GetTokenInsufficientProps {
  token: Token | undefined;
  subAccountBalance: BigNumber | undefined;
  unusedBalance: bigint | undefined;
  balance: BigNumber | undefined;
  formatTokenAmount: string | undefined;
  allowance?: bigint | Null;
}

export function getTokenInsufficient({
  token,
  subAccountBalance,
  unusedBalance,
  balance,
  formatTokenAmount,
  allowance,
}: GetTokenInsufficientProps) {
  if (
    isNullArgs(token) ||
    isNullArgs(subAccountBalance) ||
    isNullArgs(unusedBalance) ||
    isNullArgs(balance) ||
    isNullArgs(formatTokenAmount)
  )
    return undefined;

  // console.log("xxxx unusedBalance:", unusedBalance.toString());
  // console.log("xxxx subAccountBalance:", subAccountBalance.toString());
  // console.log("xxxx formatTokenAmount: ", formatTokenAmount);
  // console.log("xxxx balance:", balance.toString());
  // console.log("allowance:", allowance);

  if (!new BigNumber(unusedBalance.toString()).isLessThan(formatTokenAmount)) return "NO_TRANSFER_APPROVE";

  if (
    !new BigNumber(unusedBalance.toString())
      .plus(subAccountBalance)
      .isLessThan(new BigNumber(formatTokenAmount).plus(token.transFee))
  )
    return "NEED_DEPOSIT";

  if (
    !new BigNumber(unusedBalance.toString())
      .plus(subAccountBalance)
      .plus(balance)
      .isLessThan(
        new BigNumber(formatTokenAmount).plus(
          isUseTransfer(token) || !allowance
            ? token.transFee * 2
            : // formatTokenAmount is the total amount, includes the unused balance
            // The approve amount is the user balance
            !new BigNumber(allowance?.toString()).isLessThan(balance)
            ? token.transFee
            : token.transFee * 2,
        ),
      )
  )
    return "NEED_TRANSFER_APPROVE";

  return "INSUFFICIENT";
}
