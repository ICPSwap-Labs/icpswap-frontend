import type { DogeDissolveTx } from "types/chain-key";
import type { BitcoinTx } from "types/ckBTC";
import { SortBalanceEnum, type WalletSortType } from "types/index";

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
  dogeDissolveTxs: DogeDissolveTx[];
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
  dogeDissolveTxs: [],
};
