import { createReducer } from "@reduxjs/toolkit";
import { open, close, updateStepDetails, updateKey, closeAll, updateData } from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(open, (state, { payload }) => {
      if (payload) {
        state.opened = [payload];
      }
    })
    .addCase(close, (state, { payload }) => {
      if (payload && state.opened.includes(payload)) {
        state.opened = [];
      }
    })
    .addCase(closeAll, (state) => {
      state.opened = [];
    })
    .addCase(updateStepDetails, (state, { payload }) => {
      state.steps = {
        ...state.steps,
        [payload.key]: payload.value,
      };
    })
    .addCase(updateKey, (state) => {
      state.key += 1;
    })
    .addCase(updateData, (state, { payload }) => {
      state.data = {
        ...state.data,
        [payload.key]: payload.data,
      };
    });
});
