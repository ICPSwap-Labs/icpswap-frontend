import { ExecuteLimitOrderInfo } from "@icpswap/types";
import { SwapTransactionResult, SWAP_TRANSACTIONS_FAILED_STATUS } from "utils/transaction/constant";

export function swapTransactionExecuteLimitFormat(info: ExecuteLimitOrderInfo): SwapTransactionResult {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];
  const details = `Execute liquidity order, position id: ${info.positionId.toString()}`;

  return {
    status,
    message,
    action: "ExecuteLimitOrder",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens: [],
  };
}
