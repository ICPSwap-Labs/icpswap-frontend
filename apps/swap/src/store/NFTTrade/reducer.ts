import { createReducer } from "@reduxjs/toolkit";
import { updateAllowance } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder.addCase(updateAllowance, (state, { payload }) => {
    state.allowance = [...state.allowance, ...payload];
  });
});
