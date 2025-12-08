import { createReducer } from "@reduxjs/toolkit";
import { updateEmailSecond, updateShowGetCode } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateEmailSecond, (state, { payload }) => {
      return {
        ...state,
        second: payload,
      };
    })
    .addCase(updateShowGetCode, (state, { payload }) => {
      return {
        ...state,
        showGetCode: payload,
      };
    });
});
