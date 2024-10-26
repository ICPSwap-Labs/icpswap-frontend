import { createAction } from "@reduxjs/toolkit";
import { TX } from "types/web3";
import { StoredWithdrawTxValue } from "types/ckETH";

export const updateTX = createAction<{ principal: string; tx: TX }>("web3/updateTX");

export const updateErc20TX = createAction<{ principal: string; ledger_id: string; tx: TX }>("web3/updateErc20TX");

export const updateWithdrawTX = createAction<{ principal: string; tx: StoredWithdrawTxValue }>("web3/updateWithdrawTX");
