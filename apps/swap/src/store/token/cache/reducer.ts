import { createReducer } from "@reduxjs/toolkit";
import { updateTokenStandards, updateAllTokenIds } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateTokenStandards, (state, { payload }) => {
      payload.forEach(({ canisterId, standard }) => {
        if (canisterId) {
          state.standards[canisterId] = standard;
        }
      });
    })
    .addCase(updateAllTokenIds, (state, { payload }) => {
      state.allTokenIds = [...new Set(state.allTokenIds.concat(payload))];
    });
});
