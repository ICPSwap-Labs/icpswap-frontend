import { createReducer } from "@reduxjs/toolkit";
import { updateUserSelectedCanisters, deleteUserSelectedCanisters, importNFT, deleteNFT } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateUserSelectedCanisters, (state, { payload }) => {
      state.userSelectedCanisters = [...state.userSelectedCanisters, ...(payload ?? [])];
    })
    .addCase(deleteUserSelectedCanisters, (state, { payload }) => {
      const userSelectedCanisters = new Set(state.userSelectedCanisters);

      userSelectedCanisters.delete(payload);

      state.userSelectedCanisters = [...userSelectedCanisters];
    })
    .addCase(importNFT, (state, { payload }) => {
      state.importedNFTs = state.importedNFTs.concat(payload);
    })
    .addCase(deleteNFT, (state, { payload }) => {
      state.importedNFTs = state.importedNFTs.filter((e) => e.canisterId !== payload.canisterId);
    });
});
