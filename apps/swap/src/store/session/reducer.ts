import { createReducer } from "@reduxjs/toolkit";
import { updateLockStatus } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder.addCase(updateLockStatus, (state, { payload }) => {
    state.isUnLocked = !payload;
  });
});
