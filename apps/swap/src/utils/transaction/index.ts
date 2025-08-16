import { FailedTransactionAction } from "@icpswap/types";
import { SwapTransactionResult } from "utils/transaction/constant";
import { swapTransactionWithdrawFormat } from "utils/transaction/withdraw";
import { swapTransactionRemoveLimitFormat } from "utils/transaction/removeLimitOrder";
import { swapTransactionAddLiquidityFormat } from "utils/transaction/addLiquidity";
import { swapTransactionDepositFormat } from "utils/transaction/deposit";
import { swapTransactionRefundtFormat } from "utils/transaction/refund";
import { swapTransactionExecuteLimitFormat } from "utils/transaction/executeLimit";
import { swapTransactionTransferPositionFormat } from "utils/transaction/transferPosition";
import { swapTransactionDecreaseLiquidityFormat } from "utils/transaction/decreaseLiquidity";
import { swapTransactionClaimFormat } from "utils/transaction/claim";
import { swapTransactionAddLimitFormat } from "utils/transaction/addLimit";
import { swapTransactionSwapFormat } from "utils/transaction/swap";
import { swapTransactionOneStepSwapFormat } from "utils/transaction/oneStepSwap";

export async function swapTransactionActionFormat(__action: FailedTransactionAction): Promise<SwapTransactionResult> {
  if ("Withdraw" in __action) {
    return await swapTransactionWithdrawFormat(__action.Withdraw);
  }
  if ("RemoveLimitOrder" in __action) {
    return await swapTransactionRemoveLimitFormat(__action.RemoveLimitOrder);
  }
  if ("AddLiquidity" in __action) {
    return await swapTransactionAddLiquidityFormat(__action.AddLiquidity);
  }
  if ("OneStepSwap" in __action) {
    return await swapTransactionOneStepSwapFormat(__action.OneStepSwap);
  }
  if ("Deposit" in __action) {
    return await swapTransactionDepositFormat(__action.Deposit);
  }
  if ("Refund" in __action) {
    return await swapTransactionRefundtFormat(__action.Refund);
  }
  if ("Swap" in __action) {
    return await swapTransactionSwapFormat(__action.Swap);
  }
  if ("ExecuteLimitOrder" in __action) {
    return await swapTransactionExecuteLimitFormat(__action.ExecuteLimitOrder);
  }
  if ("TransferPosition" in __action) {
    return await swapTransactionTransferPositionFormat(__action.TransferPosition);
  }
  if ("DecreaseLiquidity" in __action) {
    return await swapTransactionDecreaseLiquidityFormat(__action.DecreaseLiquidity);
  }
  if ("Claim" in __action) {
    return await swapTransactionClaimFormat(__action.Claim);
  }
  if ("AddLimitOrder" in __action) {
    return await swapTransactionAddLimitFormat(__action.AddLimitOrder);
  }

  throw new Error("No type found in swap transaction actions");
}
