import { createReducer } from "@reduxjs/toolkit";
import { SWAP_FIELD } from "constants/swap";
import {
  typeInput,
  clearSwapState,
  selectCurrency,
  switchCurrencies,
  updatePoolCanisterIds,
  updateSwapOutAmount,
  updateDecreaseLiquidityAmount,
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
      if (currencyId === state[otherField].currencyId) {
        return {
          ...state,
          independentField: state.independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        };
      } 
        // the normal case
        return {
          ...state,
          [field]: { currencyId },
        };
      
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        typedValue: "",
        independentField: state.independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT,
        [SWAP_FIELD.INPUT]: { currencyId: state[SWAP_FIELD.OUTPUT].currencyId },
        [SWAP_FIELD.OUTPUT]: { currencyId: state[SWAP_FIELD.INPUT].currencyId },
      };
    })
    .addCase(clearSwapState, () => {
      return initialState;
    })
    .addCase(updatePoolCanisterIds, (state, { payload }) => {
      state.poolCanisterIds[payload.key] = payload.id;
    })
    .addCase(updateSwapOutAmount, (state, { payload }) => {
      state.swapOutAmount[payload.key] = payload.value;
    })
    .addCase(updateDecreaseLiquidityAmount, (state, { payload }) => {
      state.decreaseLiquidityAmount[payload.key] = { amount0: payload.amount0, amount1: payload.amount1 };
    });
});
