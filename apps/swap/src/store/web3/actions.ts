import type { WithdrawalDetail } from "@icpswap/types";
import { createAction } from "@reduxjs/toolkit";
import type { BitcoinTxResponse } from "types/ckBTC";
import type { DissolveTx } from "types/ckETH";
import type { TX } from "types/web3";
import type { TransactionReceipt } from "viem";

export const updateEthMintTx = createAction<{ principal: string; tx: TX }>("web3/updateEthMintTx");
export const updateEthDissolveTX = createAction<{ principal: string; tx: DissolveTx }>("web3/updateEthDissolveTX");
export const updateEthereumTxResponse = createAction<{
  principal: string;
  hash: string;
  response: TransactionReceipt;
}>("web3/updateEthereumTxResponse");

export const updateErc20TX = createAction<{ principal: string; ledger_id: string; tx: TX }>("web3/updateErc20TX");

export const updateBitcoinTxResponse = createAction<{
  principal: string;
  hash: string;
  response: BitcoinTxResponse;
}>("web3/updateBitcoinTxResponse");

export const updateEthereumFinalizedHashes = createAction<string>("web3/updateEthereumFinalizedHashes");

export const cleanEthereumFinalizedHashes = createAction<void>("web3/cleanEthereumFinalizedHashes");

export const updateErc20DissolveStatus = createAction<WithdrawalDetail>("web3/updateErc20DissolveStatus");

export const updateErc20DissolveUnCompletedTxs = createAction<{ id: string; type: "add" | "delete" }>(
  "web3/updateErc20DissolveCompletedTxs",
);

export const clearErc20DissolveUnCompletedTxs = createAction<void>("web3/clearErc20DissolveUnCompletedTxs");

export const updateBitcoinFinalizedHashes = createAction<string[]>("web3/updateBitcoinFinalizedHashes");

export const cleanBitcoinFinalizedHashes = createAction<void>("web3/cleanBitcoinFinalizedHashes");
