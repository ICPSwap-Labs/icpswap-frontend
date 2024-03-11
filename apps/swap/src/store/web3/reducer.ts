import { updateTX, updateWithdrawTX } from "./actions";
import { initialState } from "./states";
import { createReducer } from "@reduxjs/toolkit";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateTX, (state, { payload }) => {
      const allTx = state.tx[`${payload.principal}`] ? [payload.tx, ...state.tx[`${payload.principal}`]] : [payload.tx];
      state.tx[`${payload.principal}`] = allTx;
    })
    .addCase(updateWithdrawTX, (state, { payload }) => {
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
        value: !!payload.tx.value ? payload.tx.value : !!old_state ? old_state.value : "",
      });

      const newStates = otherStates.sort((a, b) => {
        if (Number(a.block_index) > Number(b.block_index)) return -1;
        if (Number(a.block_index) < Number(b.block_index)) return 1;
        return 0;
      });

      state.withdrawTx[`${payload.principal}`] = newStates;
    });
});
