import type { WithdrawalStatus, EthTransaction, TxFinalizedStatus } from "@icpswap/types";
import { WithdrawalState } from "constants/ckERC20";

export function formatWithdrawalStatus(withdrawalStatus: WithdrawalStatus) {
  let state: WithdrawalState = WithdrawalState.TxCreated;
  let tx: TxFinalizedStatus | EthTransaction | undefined;
  let hash: string | undefined;

  if ("TxCreated" in withdrawalStatus) {
    state = WithdrawalState.TxCreated;
  } else if ("Pending" in withdrawalStatus) {
    state = WithdrawalState.Pending;
  } else if ("TxSent" in withdrawalStatus) {
    state = WithdrawalState.TxSent;
    tx = withdrawalStatus.TxSent;
    hash = withdrawalStatus.TxSent.transaction_hash;
  } else if ("TxFinalized" in withdrawalStatus) {
    state = WithdrawalState.TxFinalized;
    tx = withdrawalStatus.TxFinalized;

    if ("Success" in withdrawalStatus.TxFinalized) {
      hash = withdrawalStatus.TxFinalized.Success.transaction_hash;
    } else if ("Reimbursed" in withdrawalStatus.TxFinalized) {
      hash = withdrawalStatus.TxFinalized.Reimbursed.transaction_hash;
    } else if ("PendingReimbursement" in withdrawalStatus.TxFinalized) {
      hash = withdrawalStatus.TxFinalized.PendingReimbursement.transaction_hash;
    }
  }

  return {
    state,
    tx,
    hash,
  };
}
