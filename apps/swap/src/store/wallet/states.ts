import { BitcoinTx } from "types/ckBTC";
import { WalletSortType, SortBalanceEnum } from "types/index";

export interface WalletState {
  taggedTokens: string[];
  ckBTCAddresses: { [key: string]: string };
  bitcoinDissolveTxs: BitcoinTx[];
  sort: WalletSortType;
  sortBalance: SortBalanceEnum;
}

export const initialState: WalletState = {
  ckBTCAddresses: {},
  bitcoinDissolveTxs: [],
  taggedTokens: [],
  sort: "Default",
  sortBalance: SortBalanceEnum.ALL,
};
