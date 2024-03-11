import { createAction } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";

export const openLoading = createAction<void>("loading/open");
export const closeLoading = createAction<void>("loading/close");

export interface LoadingState {
  open: boolean;
}

const initialState: LoadingState = {
  open: false,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(openLoading, (state) => {
      state.open = true;
    })
    .addCase(closeLoading, (state) => {
      state.open = false;
    });
});
