import {
  updateXDR2USD,
  updateDrawerWidth,
  updateICPPriceList,
  addCatchToken,
  updateUserLocale,
  updateTokenList,
  updatePoolStandardInitialed,
  updateSNSTokenRoots,
} from "./actions";
import { initialState } from "./states";

import { createReducer } from "@reduxjs/toolkit";

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
    .addCase(addCatchToken, (state, { payload }) => {
      state.requestTokenList = [...state.requestTokenList, ...(payload ? payload : [])];
    })
    .addCase(updateUserLocale, (state, { payload }) => {
      state.userLocale = payload;
    })
    .addCase(updateTokenList, (state, { payload }) => {
      state.tokenList = payload;
    })
    .addCase(updatePoolStandardInitialed, (state, { payload }) => {
      state.poolStandardUpdated = payload;
    })
    .addCase(updateSNSTokenRoots, (state, { payload }) => {
      state.snsTokenRoots[payload.id] = payload.root;
    });
});
