import type { AddLimitOrderInfo } from "@icpswap/types";
import { SWAP_TRANSACTIONS_FAILED_STATUS, type SwapTransactionResult } from "utils/transaction/constant";

export function swapTransactionAddLimitFormat(info: AddLimitOrderInfo): SwapTransactionResult {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];

  const { positionId } = info;

  const details = `Add limit order, position id: ${positionId.toString()}`;

  return {
    status,
    message,
    action: "AddLimitOrder",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens: [],
  };
}
