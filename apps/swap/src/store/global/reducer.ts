import { createReducer } from "@reduxjs/toolkit";
import {
  updateXDR2USD,
  updateDrawerWidth,
  updateICPPriceList,
  updateUserLocale,
  updateTokenList,
  updatePoolStandardInitialed,
} from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateXDR2USD, (state, { payload }) => {
      state.xdr_usdt = payload;
    })
    .addCase(updateDrawerWidth, (state, { payload }) => {
      state.drawerWidth = payload;
    })
    .addCase(updateICPPriceList, (state, { payload }) => {
      state.ICPPriceList = payload;
    })
    .addCase(updateUserLocale, (state, { payload }) => {
      state.userLocale = payload;
    })
    .addCase(updateTokenList, (state, { payload }) => {
      state.tokenList = payload;
    })
    .addCase(updatePoolStandardInitialed, (state, { payload }) => {
      state.poolStandardUpdated = payload;
    });
});
