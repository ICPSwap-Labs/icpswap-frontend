import { Token } from "@icpswap/swap-sdk";
import { BigNumber, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { isUseTransfer } from "utils/token";

enum TokenInsufficient {
  NO_TRANSFER_APPROVE = "NO_TRANSFER_APPROVE",
  NEED_DEPOSIT_FROM_SUB = "NEED_DEPOSIT_FROM_SUB",
  NO_APPROVE = "NO_APPROVE",
  NEED_TRANSFER_APPROVE = "NEED_TRANSFER_APPROVE",
  INSUFFICIENT = "INSUFFICIENT",
}

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

  if (!new BigNumber(unusedBalance.toString()).isLessThan(formatTokenAmount))
    return TokenInsufficient.NO_TRANSFER_APPROVE;

  const depositAmount = new BigNumber(unusedBalance.toString()).plus(subAccountBalance).minus(formatTokenAmount).abs();

  // For token not support approve
  if (
    !new BigNumber(unusedBalance.toString())
      .plus(subAccountBalance)
      .isLessThan(new BigNumber(formatTokenAmount).plus(token.transFee))
  )
    return TokenInsufficient.NEED_DEPOSIT_FROM_SUB;

  // For token use approve
  if (!isUseTransfer(token) && nonNullArgs(allowance)) {
    if (new BigNumber(allowance.toString()).isGreaterThan(depositAmount)) {
      return TokenInsufficient.NO_APPROVE;
    }
  }

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
    return TokenInsufficient.NEED_TRANSFER_APPROVE;

  return TokenInsufficient.INSUFFICIENT;
}

export function isApproveByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return tokenInsufficient === TokenInsufficient.NEED_TRANSFER_APPROVE;
}

export function noApproveByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return !isApproveByTokenInsufficient(tokenInsufficient);
}

export function isTransferByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return (
    tokenInsufficient === TokenInsufficient.NEED_TRANSFER_APPROVE ||
    tokenInsufficient === TokenInsufficient.INSUFFICIENT
  );
}

export function noTransferByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return !isTransferByTokenInsufficient(tokenInsufficient);
}

export function isApproveOrTransferByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return (
    tokenInsufficient === TokenInsufficient.NEED_TRANSFER_APPROVE ||
    tokenInsufficient === TokenInsufficient.INSUFFICIENT
  );
}

export function noApproveOrTransferByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return !isApproveOrTransferByTokenInsufficient(tokenInsufficient);
}

export function isDepositByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return tokenInsufficient !== TokenInsufficient.NO_TRANSFER_APPROVE;
}

export function noDepositByTokenInsufficient(tokenInsufficient: TokenInsufficient | Null) {
  return !isDepositByTokenInsufficient(tokenInsufficient);
}
