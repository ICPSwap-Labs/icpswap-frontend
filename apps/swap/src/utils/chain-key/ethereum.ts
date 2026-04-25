import type { RetrieveEthStatus } from "@icpswap/candid";
import type { DissolveTx } from "types/ckETH";

export const isEthereumDissolveTxEnd = (tx: DissolveTx) => {
  return tx.state === "TxFinalized";
};

export function isTxFinalizedByStatus(status: RetrieveEthStatus) {
  return "TxFinalized" in status;
}
