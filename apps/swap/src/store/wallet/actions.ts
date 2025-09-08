import { createAction } from "@reduxjs/toolkit";
import { BTCAddressType, TxState } from "types/ckBTC";
import { WalletSortType, SortBalanceEnum } from "types/index";

export const updateTaggedTokens = createAction<string[]>("wallet/updateTaggedTokens");

export const deleteTaggedTokens = createAction<string[]>("wallet/deleteTaggedTokens");

export const updateWalletSortType = createAction<WalletSortType>("wallet/updateWalletSortType");

export const updateSortBalance = createAction<SortBalanceEnum>("wallet/updateSortBalance");

export const updateCK_BTCAddresses = createAction<{
  principal: string;
  address: string;
  type: BTCAddressType;
}>("wallet/updateCK_BTCAddresses");

export const updateRetrieveState = createAction<{
  principal: string;
  block_index: number;
  state: TxState;
  txid: string;
  value: string;
}>("wallet/updateRetrieveState");

export const updateHideSmallBalance = createAction<boolean>("wallet/updateHideSmallBalance");

export const updateRemovedWalletDefaultTokens = createAction<{ tokenId: string; add?: boolean }>(
  "wallet/updateRemovedWalletDefaultTokens",
);
