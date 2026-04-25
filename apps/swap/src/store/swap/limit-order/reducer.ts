import { createReducer } from "@reduxjs/toolkit";

import { updatePlaceOrderPositionId } from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder.addCase(updatePlaceOrderPositionId, (state, { payload }) => {
    state.placeOrderPositionId = payload;
  });
});
