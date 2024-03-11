import { createAction } from "@reduxjs/toolkit";

export const updateCallResult = createAction<{ callKey: string; result: any }>("auth/updateCallResult");

export const updateCallIndex = createAction<void>("auth/updateCallIndex");

export const updateCallKeys = createAction<{ callKey: string; callIndex: number }>("auth/updateCallKeys");
