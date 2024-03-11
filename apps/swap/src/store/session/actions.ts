import { createAction } from "@reduxjs/toolkit";

export const updateLockStatus = createAction<boolean>("session/updateLockStatus");
