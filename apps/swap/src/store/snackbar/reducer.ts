import { createReducer } from "@reduxjs/toolkit";
import { closeSnackbar, openSnackbar } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(openSnackbar, (state, { payload }) => {
      return {
        ...state,
        action: !state.action,
        open: true,
        message: payload.message ? payload.message : initialState.message,
        anchorOrigin: payload.anchorOrigin ? payload.anchorOrigin : initialState.anchorOrigin,
        variant: payload.variant ? payload.variant : initialState.variant,
        alertSeverity: payload.alertSeverity ? payload.alertSeverity : initialState.alertSeverity,
        transition: payload.transition ? payload.transition : initialState.transition,
        close: false,
        actionButton: payload.actionButton ? payload.actionButton : initialState.actionButton,
      };
    })
    .addCase(closeSnackbar, (state) => {
      return {
        ...state,
        action: !state.action,
        open: false,
        message: "",
        close: true,
      };
    });
});
