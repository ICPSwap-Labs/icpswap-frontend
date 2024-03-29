import { createReducer } from "@reduxjs/toolkit";
import { updateTokenStandard, updateImportedToken, updateAllTokenIds } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateTokenStandard, (state, { payload }) => {
      if (!!payload && !!payload.canisterId) {
        state.standards[payload.canisterId] = payload.standard;
      }
    })
    .addCase(updateImportedToken, (state, { payload }) => {
      if (!!payload && !!payload.canisterId) {
        state.importedTokens[payload.canisterId] = payload.metadata;
      }
    })
    .addCase(updateAllTokenIds, (state, { payload }) => {
      if (payload && !state.allTokenIds.includes(payload)) {
        state.allTokenIds = state.allTokenIds.concat(payload);
      }
    });
});
