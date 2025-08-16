import { OneStepSwapInfo } from "@icpswap/types";
import { swapTransactionWithdrawFormat } from "utils/transaction/withdraw";
import { swapTransactionDepositFormat } from "utils/transaction/deposit";
import { swapTransactionSwapFormat } from "utils/transaction/swap";
import { SwapTransactionResult, SWAP_TRANSACTIONS_FAILED_STATUS } from "utils/transaction/constant";

export async function swapTransactionOneStepSwapFormat(info: OneStepSwapInfo): Promise<SwapTransactionResult> {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];

  const withdrawInfo = await swapTransactionWithdrawFormat(info.withdraw);
  const depositInfo = await swapTransactionDepositFormat(info.deposit);
  const swapInfo = await swapTransactionSwapFormat(info.swap);

  const details = info.withdraw.err.length > 0 ? withdrawInfo : info.deposit.err.length > 0 ? depositInfo : swapInfo;

  return {
    status,
    message,
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    action: `OneStepSwap-${details.action}`,
    details: details.details,
    tokens: details.tokens,
  };
}
