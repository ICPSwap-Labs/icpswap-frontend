import { createAction } from "@reduxjs/toolkit";

export const updateUserExpertMode = createAction<boolean>("swapCache/updateUserExpertMode");

export const updateUserSingleHop = createAction<boolean>("swapCache/updateUserSingleHop");

export const updateUserSelectedToken = createAction<string[]>("swapCache/updateUserSelectedToken");

export const updateUserSlippage = createAction<{ type: string; value: number }>("swapCache/updateUserSlippage");

export const updateUserTransactionsDeadline = createAction<number>("swapCache/updateUserTransactionsDeadline");

export const updateTaggedTokens = createAction<string[]>("swapCache/updateTaggedToken");

export const removeTaggedTokens = createAction<string[]>("swapCache/removeTaggedTokens");

export const updateShowClosedPosition = createAction<boolean>("swapCache/updateShowClosedPosition");

export const updateUserPositionPools = createAction<string[]>("swapCache/updateUserPositionPools");

export const updateUserMultipleApprove = createAction<number>("swapCache/updateUserMultipleApprove");

export const updateSwapProAutoRefresh = createAction<boolean>("global/updateSwapProAutoRefresh");

export const updateKeepTokenInPools = createAction<boolean>("swapCache/updateKeepTokenInPools");
