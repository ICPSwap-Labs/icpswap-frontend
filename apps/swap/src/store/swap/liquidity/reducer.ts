import { createReducer } from "@reduxjs/toolkit";
import {
  updateFiled,
  updateFullRange,
  updateLeftRange,
  updateRightRange,
  updateStartPrice,
  resetMintState,
} from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder

    .addCase(updateFiled, (state, { payload }) => {
      const { field, typedValue } = payload;

      if (field === state.independentField) {
        return {
          ...state,
          independentField: field,
          typedValue,
        };
      } 
        return {
          ...state,
          independentField: field,
          typedValue,
        };
      
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
