import { TransactionResponse } from "@ethersproject/abstract-provider";
import BigNumber from "bignumber.js";
import { ETHEREUM_CONFIRMATIONS } from "constants/web3";
import { RetrieveEthStatus, WithdrawalStatus } from "@icpswap/types";
import { Erc20DissolveStatus } from "types/web3";

export function isTxFinalized(status: RetrieveEthStatus) {
  return "TxFinalized" in status;
}

export function isEthereumMintFinalized(transactionResponse: TransactionResponse) {
  return !new BigNumber(transactionResponse.confirmations).isLessThan(ETHEREUM_CONFIRMATIONS);
}

export function isErc20Finalized(status: WithdrawalStatus) {
  return "TxFinalized" in status;
}

export function erc20DissolveStatus(status: WithdrawalStatus) {
  return Object.keys(status)[0] as Erc20DissolveStatus;
}

export function erc20DissolveHash(status: WithdrawalStatus) {
  if ("TxSent" in status) {
    return status.TxSent.transaction_hash;
  }

  if ("TxFinalized" in status) {
    if ("Success" in status.TxFinalized) {
      return status.TxFinalized.Success.transaction_hash;
    }

    if ("Reimbursed" in status.TxFinalized) {
      return status.TxFinalized.Reimbursed.transaction_hash;
    }

    if ("PendingReimbursement" in status.TxFinalized) {
      return status.TxFinalized.PendingReimbursement.transaction_hash;
    }
  }

  return undefined;
}
