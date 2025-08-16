import { RemoveLimitOrderInfo } from "@icpswap/types";
import { SwapTransactionResult, SWAP_TRANSACTIONS_FAILED_STATUS } from "utils/transaction/constant";

export function swapTransactionRemoveLimitFormat(info: RemoveLimitOrderInfo): SwapTransactionResult {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];
  const details = `Remove liquidity order, position id: ${info.positionId.toString()}`;

  return {
    status,
    message,
    action: "RemoveLimitOrder",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens: [],
  };
}
