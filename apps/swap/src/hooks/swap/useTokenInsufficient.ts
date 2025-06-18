import { Token } from "@icpswap/swap-sdk";
import { BigNumber, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { isUseTransfer } from "utils/token";

export enum TokenInsufficient {
  NO_TRANSFER_APPROVE = "NO_TRANSFER_APPROVE",
  NEED_DEPOSIT_FROM_SUB = "NEED_DEPOSIT_FROM_SUB",
  NO_APPROVE = "NO_APPROVE",
  NEED_TRANSFER_APPROVE = "NEED_TRANSFER_APPROVE",
  INSUFFICIENT = "INSUFFICIENT",
}

export interface GetTokenInsufficientProps {
  token: Token | undefined;
  subAccountBalance: string | undefined;
  unusedBalance: bigint | undefined;
  balance: string | undefined;
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
    isUndefinedOrNull(token) ||
    isUndefinedOrNull(subAccountBalance) ||
    isUndefinedOrNull(unusedBalance) ||
    isUndefinedOrNull(balance) ||
    isUndefinedOrNull(formatTokenAmount)
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
      .isLessThan(new BigNumber(formatTokenAmount).plus(token.transFee)) &&
    isUseTransfer(token)
  )
    return TokenInsufficient.NEED_DEPOSIT_FROM_SUB;

  const hasEnoughToken = !new BigNumber(unusedBalance.toString())
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
    );

  if (!hasEnoughToken) return TokenInsufficient.INSUFFICIENT;

  // For token use approve
  if (hasEnoughToken) {
    if (!isUseTransfer(token) && nonUndefinedOrNull(allowance)) {
      if (new BigNumber(allowance.toString()).isGreaterThan(depositAmount)) {
        return TokenInsufficient.NO_APPROVE;
      }
    }
  }

  return TokenInsufficient.NEED_TRANSFER_APPROVE;
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
