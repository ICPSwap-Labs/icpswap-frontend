import { StoredTxValue } from "types/ckBTC";
import { WalletSortType, SortBalanceEnum } from "types/index";

export interface WalletState {
  taggedTokens: string[];
  ckBTCAddresses: { [key: string]: string };
  retrieveState: { [key: string]: StoredTxValue[] };
  sort: WalletSortType;
  sortBalance: SortBalanceEnum;
}

export const initialState: WalletState = {
  ckBTCAddresses: {},
  retrieveState: {},
  taggedTokens: [],
  sort: "Default",
  sortBalance: SortBalanceEnum.ALL,
};
