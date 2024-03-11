import { StoredTxValue } from "types/ckBTC";

export interface WalletState {
  cacheTokenIds: string[];
  hideSmallBalance: boolean;
  ckBTCAddresses: { [key: string]: string };
  retrieveState: { [key: string]: StoredTxValue[] };
}

export const initialState: WalletState = {
  cacheTokenIds: [],
  hideSmallBalance: false,
  ckBTCAddresses: {},
  retrieveState: {},
};
