import { createReducer } from "@reduxjs/toolkit";
import { SWAP_FIELD } from "constants/swap";
import {
  typeInput,
  clearSwapState,
  selectCurrency,
  switchCurrencies,
  updatePoolCanisterIds,
  updateSwapOutAmount,
  updateAllSwapPools,
} from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(typeInput, (state, { payload }) => {
      const { field: independentField, typedValue } = payload;

      state.independentField = independentField;
      state.typedValue = typedValue;
    })
    .addCase(selectCurrency, (state, { payload }) => {
      const { field, currencyId } = payload;

      const otherField = field === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT;
      if (currencyId === state[otherField]) {
        return {
          ...state,
          independentField: state.independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT,
          [field]: currencyId,
          [otherField]: state[field],
        };
      }

      // the normal case
      return {
        ...state,
        [field]: currencyId,
      };
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        typedValue: "",
        independentField: state.independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT,
      };
    })
    // Do not clear the input/output tokens
    .addCase(clearSwapState, (state) => {
      return {
        ...initialState,
        [SWAP_FIELD.INPUT]: state.INPUT,
        [SWAP_FIELD.OUTPUT]: state.OUTPUT,
        allSwapPools: state.allSwapPools,
      };
    })
    .addCase(updatePoolCanisterIds, (state, { payload }) => {
      state.poolCanisterIds[payload.key] = payload.id;
    })
    .addCase(updateSwapOutAmount, (state, { payload }) => {
      state.swapOutAmount[payload.key] = payload.value;
    })
    .addCase(updateAllSwapPools, (state, { payload }) => {
      state.allSwapPools = payload;
    });
});
