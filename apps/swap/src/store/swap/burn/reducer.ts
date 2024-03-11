import { createReducer } from "@reduxjs/toolkit";
import { updateTypedInput, resetBurnState } from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateTypedInput, (state, { payload }) => {
      const { typedValue, independentField } = payload;

      state.independentField = independentField;
      state.typedValue = typedValue;
    })
    .addCase(resetBurnState, () => {
      return initialState;
    });
});
