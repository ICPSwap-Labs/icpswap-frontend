import { createReducer } from "@reduxjs/toolkit";
import {
  updateUserExpertMode,
  updateUserSelectedToken,
  updateUserSingleHop,
  updateUserSlippage,
  updateUserTransactionsDeadline,
  updateTaggedTokens,
  removeTaggedTokens,
  updateShowClosedPosition,
  updateUserPositionPools,
  updateUserMultipleApprove,
  updateSwapProAutoRefresh,
  updateKeepTokenInPools,
} from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateUserExpertMode, (state, { payload }) => {
      state.userExpertMode = payload;
    })
    .addCase(updateUserSelectedToken, (state, { payload }) => {
      state.userSelectedToken = payload;
    })
    .addCase(updateUserSingleHop, (state, { payload }) => {
      state.userSingleHop = payload;
    })
    .addCase(updateUserTransactionsDeadline, (state, { payload }) => {
      state.userTransactionsDeadline = payload;
    })
    .addCase(updateUserSlippage, (state, { payload }) => {
      const { type, value } = payload;
      state.userSlippage[type] = value;
    })
    .addCase(updateTaggedTokens, (state, { payload }) => {
      state.taggedTokens = [...state.taggedTokens, ...payload];
    })
    .addCase(removeTaggedTokens, (state, { payload }) => {
      state.taggedTokens = state.taggedTokens.filter((token) => payload.findIndex((_token) => _token === token) === -1);
    })
    .addCase(updateShowClosedPosition, (state, { payload }) => {
      state.showClosedPosition = payload;
    })
    .addCase(updateUserPositionPools, (state, { payload }) => {
      const { userPositionPools } = state;
      const allPoolIds = [...new Set([...userPositionPools, ...payload])];

      state.userPositionPools = allPoolIds;
    })
    .addCase(updateUserMultipleApprove, (state, { payload }) => {
      state.multipleApprove = payload;
    })
    .addCase(updateSwapProAutoRefresh, (state, { payload }) => {
      state.swapProAutoRefresh = payload;
    })
    .addCase(updateKeepTokenInPools, (state, { payload }) => {
      state.keepTokenInPools = payload;
    });
});
