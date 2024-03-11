import { createReducer } from "@reduxjs/toolkit";
import { updateUserSlippage } from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder.addCase(updateUserSlippage, (state, { payload }) => {
    const { type, value } = payload;
    state.userSlippage[type] = value;
  });
});
