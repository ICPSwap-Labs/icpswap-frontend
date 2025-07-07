import { createReducer } from "@reduxjs/toolkit";
import {
  updateUserLocale,
  updateTokenList,
  updateAllSwapTokens,
  updateWalletConnector,
  updateBridgeTokens,
  updateTokenBalance,
} from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateUserLocale, (state, { payload }) => {
      state.userLocale = payload;
    })
    .addCase(updateTokenList, (state, { payload }) => {
      state.tokenList = payload;
    })
    .addCase(updateAllSwapTokens, (state, { payload }) => {
      state.allSwapTokens = payload;
    })
    .addCase(updateWalletConnector, (state, { payload }) => {
      state.walletConnector = payload;
    })
    .addCase(updateBridgeTokens, (state, { payload }) => {
      state.bridgeTokens = payload;
    })
    .addCase(updateTokenBalance, (state, { payload: { canisterId, balance } }) => {
      state.tokenBalances = {
        ...state.tokenBalances,
        [canisterId]: balance,
      };
    });
});
