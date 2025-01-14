import { createReducer } from "@reduxjs/toolkit";

import { updateSwapOutAmount, updatePlaceOrderPositionId } from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateSwapOutAmount, (state, { payload }) => {
      state.swapOutAmount[payload.key] = payload.value;
    })
    .addCase(updatePlaceOrderPositionId, (state, { payload }) => {
      state.placeOrderPositionId = payload;
    });
});
