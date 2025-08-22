import { createAction } from "@reduxjs/toolkit";
import { TX } from "types/web3";
import { DissolveTx } from "types/ckETH";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BitcoinTxResponse } from "types/ckBTC";
import { WithdrawalDetail } from "@icpswap/types";

export const updateEthMintTx = createAction<{ principal: string; tx: TX }>("web3/updateEthMintTx");
export const updateEthDissolveTX = createAction<{ principal: string; tx: DissolveTx }>("web3/updateEthDissolveTX");
export const updateEthereumTxResponse = createAction<{
  principal: string;
  hash: string;
  response: TransactionResponse;
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

export const updateErc20DissolveCompletedTxs = createAction<string[]>("web3/updateErc20DissolveCompletedTxs");

export const updateBitcoinFinalizedHashes = createAction<string[]>("web3/updateBitcoinFinalizedHashes");

export const cleanBitcoinFinalizedHashes = createAction<void>("web3/cleanBitcoinFinalizedHashes");
