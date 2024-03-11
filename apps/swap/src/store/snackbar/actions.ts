import { createAction } from "@reduxjs/toolkit";

export const openSnackbar = createAction<{ [key: string]: any }>("snackbar/openSnackbar");
export const closeSnackbar = createAction<void>("snackbar/closeSnackbar");
