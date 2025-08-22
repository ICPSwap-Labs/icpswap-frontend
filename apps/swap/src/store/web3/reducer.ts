import { createReducer } from "@reduxjs/toolkit";
import {
  updateEthMintTx,
  updateErc20TX,
  updateEthDissolveTX,
  updateEthereumTxResponse,
  updateBitcoinTxResponse,
  updateEthereumFinalizedHashes,
  updateErc20DissolveStatus,
  updateErc20DissolveCompletedTxs,
  updateBitcoinFinalizedHashes,
  cleanBitcoinFinalizedHashes,
  cleanEthereumFinalizedHashes,
} from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateEthMintTx, (state, { payload }) => {
      const allTx = state.tx[`${payload.principal}`] ? [payload.tx, ...state.tx[`${payload.principal}`]] : [payload.tx];
      state.tx[`${payload.principal}`] = allTx;
    })
    .addCase(updateEthDissolveTX, (state, { payload }) => {
      const otherStates = state.withdrawTx[`${payload.principal}`]
        ? [...state.withdrawTx[`${payload.principal}`]].filter(
            (transaction) => transaction.block_index !== String(payload.tx.block_index),
          )
        : [];

      const old_state = (
        state.withdrawTx[`${payload.principal}`] ? [...state.withdrawTx[`${payload.principal}`]] : []
      ).filter((transaction) => transaction.block_index === String(payload.tx.block_index))[0];

      otherStates.unshift({
        state: payload.tx.state,
        hash: payload.tx.hash ?? old_state?.hash,
        block_index: String(payload.tx.block_index),
        value: payload.tx.value ? payload.tx.value : old_state ? old_state.value : "",
      });

      const newStates = otherStates.sort((a, b) => {
        if (Number(a.block_index) > Number(b.block_index)) return -1;
        if (Number(a.block_index) < Number(b.block_index)) return 1;
        return 0;
      });

      state.withdrawTx[`${payload.principal}`] = newStates;
    })
    .addCase(updateErc20TX, (state, { payload }) => {
      const key = `${payload.principal}_${payload.ledger_id}`;
      const allTx = state.erc20Transactions[key] ? [payload.tx, ...state.erc20Transactions[key]] : [payload.tx];
      state.erc20Transactions[key] = allTx;
    })
    .addCase(updateEthereumTxResponse, (state, { payload }) => {
      state.ethTxResponse[payload.principal] = {
        ...(state.ethTxResponse[payload.principal] ?? {}),
        [payload.hash]: payload.response,
      };
    })
    .addCase(updateBitcoinTxResponse, (state, { payload }) => {
      state.bitcoinTxResponse[payload.principal] = {
        ...(state.bitcoinTxResponse[payload.principal] ?? {}),
        [payload.hash]: payload.response,
      };
    })
    .addCase(updateEthereumFinalizedHashes, (state, { payload }) => {
      state.ethereumFinalizedHashes = [...new Set([...state.ethereumFinalizedHashes, payload])];
    })
    .addCase(updateErc20DissolveStatus, (state, { payload }) => {
      state.erc20DissolveDetails[payload.withdrawal_id.toString()] = payload;
    })
    .addCase(updateErc20DissolveCompletedTxs, (state, { payload }) => {
      state.erc20DissolveCompletedTxs = [...new Set([...state.erc20DissolveCompletedTxs, ...payload])];
    })
    .addCase(updateBitcoinFinalizedHashes, (state, { payload }) => {
      state.bitcoinFinalizedTxs = [...new Set([...state.bitcoinFinalizedTxs, ...payload])];
    })
    .addCase(cleanBitcoinFinalizedHashes, (state) => {
      state.bitcoinFinalizedTxs = [];
    })
    .addCase(cleanEthereumFinalizedHashes, (state) => {
      state.ethereumFinalizedHashes = [];
    });
});
