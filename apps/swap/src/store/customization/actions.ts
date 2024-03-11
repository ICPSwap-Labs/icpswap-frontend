import { createAction } from "@reduxjs/toolkit";

export const changeTheme = createAction<string>("customization/changeTheme");
export const updateLocal = createAction<string>("customization/updateLocal");
export const updateHideUnavailableClaim = createAction<boolean>("customization/updateHideUnavailableClaim");
