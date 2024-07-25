import { StoredTxValue } from "types/ckBTC";
import { WalletSortType } from "types/index";

export interface WalletState {
  taggedTokens: string[];
  hideSmallBalance: boolean;
  ckBTCAddresses: { [key: string]: string };
  retrieveState: { [key: string]: StoredTxValue[] };
  sort: WalletSortType;
}

export const initialState: WalletState = {
  hideSmallBalance: false,
  ckBTCAddresses: {},
  retrieveState: {},
  taggedTokens: [],
  sort: "Default",
};
