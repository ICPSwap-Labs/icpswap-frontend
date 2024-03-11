import { changeTheme, updateLocal, updateHideUnavailableClaim } from "./actions";
import { initialState } from "./states";

import { createReducer } from "@reduxjs/toolkit";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(changeTheme, (state, { payload }) => {
      state.mode = payload;
    })
    .addCase(updateLocal, (state, { payload }) => {
      state.locale = payload;
    })
    .addCase(updateHideUnavailableClaim, (state, { payload }) => {
      state.hideUnavailableClaim = payload;
    });
});
