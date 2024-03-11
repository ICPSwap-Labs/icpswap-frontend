import { updateTokenStandard, updateTokenCapId } from "./actions";
import { initialState } from "./states";
import { createReducer } from "@reduxjs/toolkit";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateTokenStandard, (state, { payload }) => {
      if (!!payload && !!payload.canisterId) {
        state.standards[payload.canisterId] = payload.standard;
      }
    })
    .addCase(updateTokenCapId, (state, { payload }) => {
      state.caps[payload.canisterId] = payload.capId;
    });
});
