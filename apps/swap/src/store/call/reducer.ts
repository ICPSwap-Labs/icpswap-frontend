import { createReducer } from "@reduxjs/toolkit";
import { updateCallResult, updateCallIndex, updateCallKeys } from "./actions";
import { initialState } from "./states";


export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateCallResult, (state, { payload }) => {
      state.callResults = {
        ...state.callResults,
        [payload.callKey]: payload.result,
      };
    })
    .addCase(updateCallIndex, (state) => {
      state.callIndex += 1;
    })
    .addCase(updateCallKeys, (state, { payload }) => {
      state.callKeys = {
        ...state.callKeys,
        [payload.callKey]: payload.callIndex,
      };
    });
});
