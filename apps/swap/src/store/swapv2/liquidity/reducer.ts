import { createReducer } from "@reduxjs/toolkit";
import {
  updateFiled,
  updateFullRange,
  updateLeftRange,
  updateRightRange,
  updateStartPrice,
  updateUserPositions,
  resetMintState,
} from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateUserPositions, (state, { payload }) => {
      state.userPositions = payload;
    })
    .addCase(updateFiled, (state, { payload }) => {
      const { field, typedValue } = payload;

      if (field === state.independentField) {
        return {
          ...state,
          independentField: field,
          typedValue: typedValue,
        };
      } else {
        return {
          ...state,
          independentField: field,
          typedValue: typedValue,
        };
      }
    })
    .addCase(updateFullRange, (state) => {
      state.leftRangeValue = true;
      state.rightRangeValue = true;
    })
    .addCase(updateLeftRange, (state, { payload }) => {
      state.leftRangeValue = payload;
    })
    .addCase(updateRightRange, (state, { payload }) => {
      state.rightRangeValue = payload;
    })
    .addCase(updateStartPrice, (state, { payload }) => {
      state.startPrice = payload;
    })
    .addCase(resetMintState, () => {
      return initialState;
    });
});
