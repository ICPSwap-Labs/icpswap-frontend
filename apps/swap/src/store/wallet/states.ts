import { StoredTxValue } from "types/ckBTC";

export interface WalletState {
  taggedTokens: string[];
  hideSmallBalance: boolean;
  ckBTCAddresses: { [key: string]: string };
  retrieveState: { [key: string]: StoredTxValue[] };
}

export const initialState: WalletState = {
  hideSmallBalance: false,
  ckBTCAddresses: {},
  retrieveState: {},
  taggedTokens: [],
};
