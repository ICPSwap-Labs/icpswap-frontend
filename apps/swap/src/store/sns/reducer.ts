import { createReducer } from "@reduxjs/toolkit";
import { updateSnsAllTokensInfo } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder.addCase(updateSnsAllTokensInfo, (state, { payload }) => {
    state.snsAllTokensInfo = payload;
  });
});
