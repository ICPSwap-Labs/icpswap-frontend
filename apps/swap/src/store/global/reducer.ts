import { createReducer } from "@reduxjs/toolkit";
import {
  updateAllSwapTokens,
  updateBridgeTokens,
  updateDefaultChartType,
  updateDefaultTokens,
  updateGlobalMinterInfo,
  updateTokenList,
  updateUserLocale,
  updateWalletConnector,
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
    .addCase(updateGlobalMinterInfo, (state, { payload }) => {
      state.globalMinterInfo = payload.minterInfo;
    })
    .addCase(updateDefaultTokens, (state, { payload }) => {
      state.defaultTokens = payload;
    })
    .addCase(updateDefaultChartType, (state, { payload }) => {
      state.defaultChartType = payload;
    });
});
