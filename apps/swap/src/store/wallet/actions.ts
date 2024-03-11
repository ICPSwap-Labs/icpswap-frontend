import { createAction } from "@reduxjs/toolkit";
import { BTCAddressType, TxState } from "types/ckBTC";

export const saveWalletCacheToken = createAction<string[]>("wallet/saveWalletCacheToken");

export const deleteWalletCatchToken = createAction<string[]>("wallet/deleteWalletCatchToken");

export const updateHideSmallBalance = createAction<boolean>("wallet/updateHideSmallBalance");

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
