import { createReducer } from "@reduxjs/toolkit";
import {
  updateTaggedTokens,
  deleteTaggedTokens,
  updateCK_BTCAddresses,
  updateBitcoinDissolveTxs,
  updateWalletSortType,
  updateSortBalance,
  updateHideSmallBalance,
  updateRemovedWalletDefaultTokens,
  updateHideZeroNFT,
  updateSortedTokens,
} from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateTaggedTokens, (state, { payload }) => {
      const newTaggedTokens = [...state.taggedTokens, ...payload];

      return {
        ...state,
        taggedTokens: newTaggedTokens,
      };
    })
    .addCase(deleteTaggedTokens, (state, { payload }) => {
      const newTaggedTokens = [...state.taggedTokens].filter((token) => !payload.includes(token));

      return {
        ...state,
        taggedTokens: newTaggedTokens,
      };
    })
    .addCase(updateCK_BTCAddresses, (state, { payload }) => {
      state.ckBTCAddresses = {
        ...state.ckBTCAddresses,
        [`${payload.principal}_${payload.type}`]: payload.address,
      };
    })
    .addCase(updateBitcoinDissolveTxs, (state, { payload }) => {
      const old_state = [...state.bitcoinDissolveTxs];
      const index = old_state.findIndex((tx) => tx.id === payload.id);

      if (index === -1) {
        old_state.unshift(payload);
      } else {
        old_state.splice(index, 1, payload);
      }

      const dissolveTxs = old_state.sort((a, b) => {
        if (Number(a.block_index) > Number(b.block_index)) return -1;
        if (Number(a.block_index) < Number(b.block_index)) return 1;
        return 0;
      });

      state.bitcoinDissolveTxs = dissolveTxs;
    })
    .addCase(updateWalletSortType, (state, { payload }) => {
      state.sort = payload;
    })
    .addCase(updateSortBalance, (state, { payload }) => {
      state.sortBalance = payload;
    })
    .addCase(updateHideSmallBalance, (state, { payload }) => {
      state.hideSmallBalance = payload;
    })
    .addCase(updateRemovedWalletDefaultTokens, (state, { payload }) => {
      if (payload.add) {
        const __removedWalletDefaultTokens = [...state.removedWalletDefaultTokens];
        const index = __removedWalletDefaultTokens.findIndex((tokenId) => tokenId === payload.tokenId);
        if (index !== -1) {
          __removedWalletDefaultTokens.splice(index, 1);
        }

        state.removedWalletDefaultTokens = __removedWalletDefaultTokens;
      } else {
        state.removedWalletDefaultTokens = [...new Set([...state.removedWalletDefaultTokens, payload.tokenId])];
      }
    })
    .addCase(updateHideZeroNFT, (state, { payload }) => {
      state.hideZeroNFT = payload;
    })
    .addCase(updateSortedTokens, (state, { payload }) => {
      state.sortedTokens = payload;
    });
});
