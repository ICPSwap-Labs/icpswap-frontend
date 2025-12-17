import { BitcoinTx } from "types/ckBTC";
import { WalletSortType, SortBalanceEnum } from "types/index";

export interface WalletState {
  taggedTokens: string[];
  ckBTCAddresses: { [key: string]: string };
  bitcoinDissolveTxs: BitcoinTx[];
  sort: WalletSortType;
  sortBalance: SortBalanceEnum;
  hideSmallBalance: boolean;
  removedWalletDefaultTokens: string[];
  hideZeroNFT: boolean;
  sortedTokens: string[];
}

export const initialState: WalletState = {
  ckBTCAddresses: {},
  bitcoinDissolveTxs: [],
  taggedTokens: [],
  sort: "High",
  sortBalance: SortBalanceEnum.ALL,
  hideSmallBalance: false,
  removedWalletDefaultTokens: [],
  hideZeroNFT: false,
  sortedTokens: [],
};
