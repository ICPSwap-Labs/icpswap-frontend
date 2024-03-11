import { login, logout, updateConnected, updateWalletConnector } from "./actions";
import { initialState } from "./states";

import { createReducer } from "@reduxjs/toolkit";

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
    })
    .addCase(updateWalletConnector, (state, { payload }) => {
      state.walletConnectorOpen = payload;
    });
});
