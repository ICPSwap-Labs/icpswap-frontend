import { createReducer } from "@reduxjs/toolkit";
import { login, logout, updateConnected } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    })
    .addCase(logout, () => {
      return { ...initialState };
    })
    .addCase(updateConnected, (state, { payload }) => {
      state.isConnected = payload.isConnected;
    });
});
