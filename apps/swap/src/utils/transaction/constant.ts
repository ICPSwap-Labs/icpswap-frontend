export type SwapTransactionAction =
  | "Withdraw"
  | "RemoveLimitOrder"
  | "AddLiquidity"
  | "OneStepSwap"
  | "Deposit"
  | "Refund"
  | "Swap"
  | "ExecuteLimitOrder"
  | "TransferPosition"
  | "DecreaseLiquidity"
  | "Claim"
  | "AddLimitOrder";

export const SwapTransactionActions = [
  "Withdraw",
  "RemoveLimitOrder",
  "AddLiquidity",
  "OneStepSwap-Swap",
  "OneStepSwap-Withdraw",
  "OneStepSwap-Deposit",
  "Deposit",
  "Refund",
  "Swap",
  "ExecuteLimitOrder",
  "TransferPosition",
  "DecreaseLiquidity",
  "Claim",
  "AddLimitOrder",
];

export type SwapTransactionFailedStatus = "Failed";

export const SWAP_TRANSACTIONS_FAILED_STATUS = ["Failed"];

export type SwapTransactionResult = {
  status: string;
  message: string | undefined;
  action: string | undefined;
  failed: boolean;
  details: string;
  tokens: Array<{ tokenId: string; symbol: string; amount: string }>;
};
