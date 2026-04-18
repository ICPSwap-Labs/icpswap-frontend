import { createAction } from "@reduxjs/toolkit";
import type { DogeDissolveTx } from "types/chain-key";
import type { BitcoinTx } from "types/ckBTC";
import type { SortBalanceEnum, WalletSortType } from "types/index";

export const updateTaggedTokens = createAction<string[]>("wallet/updateTaggedTokens");

export const deleteTaggedTokens = createAction<string[]>("wallet/deleteTaggedTokens");

export const updateWalletSortType = createAction<WalletSortType>("wallet/updateWalletSortType");

export const updateSortBalance = createAction<SortBalanceEnum>("wallet/updateSortBalance");

export const updateHideSmallBalance = createAction<boolean>("wallet/updateHideSmallBalance");

export const updateRemovedWalletDefaultTokens = createAction<{ tokenId: string; add?: boolean }>(
  "wallet/updateRemovedWalletDefaultTokens",
);

export const updateBitcoinDissolveTxs = createAction<BitcoinTx>("wallet/updateBitcoinDissolveTxs");

export const updateDogeDissolveTxs = createAction<DogeDissolveTx>("wallet/updateDogeDissolveTxs");

export const cleanDogeDissolveTxs = createAction("wallet/cleanDogeDissolveTxs");

export const updateHideZeroNFT = createAction<boolean>("wallet/updateHideZeroNFT");

export const updateSortedTokens = createAction<string[]>("wallet/updateSortedTokens");
