import { createAction } from "@reduxjs/toolkit";
import { BitcoinTx, BTCAddressType } from "types/ckBTC";
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

export const updateBitcoinDissolveTxs = createAction<BitcoinTx>("wallet/updateBitcoinDissolveTxs");
