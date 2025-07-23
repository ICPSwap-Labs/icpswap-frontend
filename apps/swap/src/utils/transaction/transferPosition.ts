import { shorten } from "@icpswap/utils";
import { TransferPositionInfo } from "@icpswap/types";
import { SwapTransactionResult, SWAP_TRANSACTIONS_FAILED_STATUS } from "utils/transaction/constant";

export async function swapTransactionTransferPositionFormat(
  info: TransferPositionInfo,
): Promise<SwapTransactionResult> {
  const __status = info.status;
  const message = info.err[0];
  const status = Object.keys(__status)[0];
  const details = `${shorten(info.from.owner.toString())} transfer ${info.positionId.toString()} position to ${shorten(
    info.to.owner.toString(),
  )}`;

  return {
    status,
    message,
    action: "TransferPosition",
    failed: SWAP_TRANSACTIONS_FAILED_STATUS.includes(status),
    details,
    tokens: [],
  };
}
