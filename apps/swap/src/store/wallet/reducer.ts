import { createReducer } from "@reduxjs/toolkit";
import {
  deleteWalletCatchToken,
  saveWalletCacheToken,
  updateHideSmallBalance,
  updateCK_BTCAddresses,
  updateRetrieveState,
} from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(saveWalletCacheToken, (state, { payload }) => {
      const newSaveCacheTokenIds = [...(state.cacheTokenIds ?? []), ...(payload || [])];

      return {
        ...state,
        cacheTokenIds: newSaveCacheTokenIds,
      };
    })
    .addCase(deleteWalletCatchToken, (state, { payload }) => {
      const newDelCacheTokenIds = (state.cacheTokenIds ?? []).filter((token) => !(payload || []).includes(token));

      return {
        ...state,
        cacheTokenIds: newDelCacheTokenIds,
      };
    })
    .addCase(updateHideSmallBalance, (state, { payload }) => {
      state.hideSmallBalance = payload;
    })
    .addCase(updateCK_BTCAddresses, (state, { payload }) => {
      state.ckBTCAddresses = {
        ...state.ckBTCAddresses,
        [`${payload.principal}_${payload.type}`]: payload.address,
      };
    })
    .addCase(updateRetrieveState, (state, { payload }) => {
      const states = state.retrieveState[`${payload.principal}`]
        ? [...state.retrieveState[`${payload.principal}`]].filter(
            (state) => state.block_index !== String(payload.block_index),
          )
        : [];

      const old_state = (
        state.retrieveState[`${payload.principal}`] ? [...state.retrieveState[`${payload.principal}`]] : []
      ).filter((state) => state.block_index === String(payload.block_index))[0];

      states.unshift({
        state: payload.state,
        txid: payload.txid,
        block_index: String(payload.block_index),
        value: payload.value ? payload.value : old_state ? old_state.value : "",
      });

      const _states = states.sort((a, b) => {
        if (Number(a.block_index) > Number(b.block_index)) return -1;
        if (Number(a.block_index) < Number(b.block_index)) return 1;
        return 0;
      });

      state.retrieveState[`${payload.principal}`] = _states;
    });
});
