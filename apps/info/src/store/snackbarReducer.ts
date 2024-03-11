import { createReducer, createAction } from "@reduxjs/toolkit";
import { SnackbarOrigin, AlertColor } from "@mui/material";

export const SNACKBAR_OPEN = createAction<{ message: string; type: "success" | "error" }>("snackbar/SNACKBAR_OPEN");
export const SNACKBAR_CLOSE = createAction<void>("snackbar/SNACKBAR_CLOSE");

export interface SnackbarState {
  action: boolean;
  open: boolean;
  message: string;
  anchorOrigin: SnackbarOrigin;
  variant: string;
  alertSeverity: AlertColor;
  transition: string;
  close: boolean;
  actionButton: boolean;
  autoHideDuration: number;
}

export const initialState: SnackbarState = {
  action: false,
  open: false,
  message: "No message",
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  variant: "default",
  alertSeverity: "success",
  transition: "Fade",
  close: true,
  actionButton: false,
  autoHideDuration: 3000,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(SNACKBAR_OPEN, (state, { payload }) => {
      state.open = true;
      state.message = payload.message;
      state.alertSeverity = payload.type;
    })
    .addCase(SNACKBAR_CLOSE, (state) => {
      state.open = false;
    });
});
