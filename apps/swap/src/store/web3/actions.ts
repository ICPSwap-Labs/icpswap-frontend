import { createAction } from "@reduxjs/toolkit";
import { Erc20DissolveTx, TX } from "types/web3";
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
export const updateErc20DissolveTx = createAction<{ tx: Erc20DissolveTx }>("web3/updateErc20DissolveTx");

export const updateBitcoinTxResponse = createAction<{
  principal: string;
  hash: string;
  response: BitcoinTxResponse;
}>("web3/updateBitcoinTxResponse");

export const updateEthereumFinalizedHashes = createAction<string>("web3/updateEthereumFinalizedHashes");

export const updateErc20DissolveStatus = createAction<WithdrawalDetail>("web3/updateErc20DissolveStatus");
