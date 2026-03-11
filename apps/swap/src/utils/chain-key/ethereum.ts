import { DissolveTx } from "types/ckETH";
import { RetrieveEthStatus } from "@icpswap/candid";

export const isEthereumDissolveTxEnd = (tx: DissolveTx) => {
  return tx.state === "TxFinalized";
};

export function isTxFinalizedByStatus(status: RetrieveEthStatus) {
  return "TxFinalized" in status;
}
