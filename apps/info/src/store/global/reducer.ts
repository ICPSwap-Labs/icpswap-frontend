import { updateICPBlocks, updateICPPriceList, updateUserLocale, storeTokenList, updateXDR2USD } from "./actions";
import { initialState } from "./states";

import { createReducer } from "@reduxjs/toolkit";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(storeTokenList, (state, { payload }) => {
      state.tokenList = [...payload, ...(state.tokenList || [])];
    })
    .addCase(updateICPBlocks, (state, { payload }) => {
      state.blocks = payload.blocks;
      state.secondBlocks = payload.secondBlocks;
    })
    .addCase(updateICPPriceList, (state, { payload }) => {
      state.ICPPriceList = payload;
    })
    .addCase(updateUserLocale, (state, { payload }) => {
      state.userLocale = payload;
    })
    .addCase(updateXDR2USD, (state, { payload }) => {
      state.xdr_usdt = payload;
    });
});
