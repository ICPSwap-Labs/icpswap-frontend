import type { Token } from "@icpswap/swap-sdk";
import { create } from "zustand";

export type ConvertToIcp = {
  tokenId: string;
  icpAmount: string;
  poolId: string;
  amount: string;
  token: Token;
};

export interface BalanceConvertContextProps {
  tokensConvertToSwap: Array<ConvertToIcp> | undefined;
  setTokensConvertToIcp: (amount: Array<ConvertToIcp> | undefined) => void;
  convertedTokenIds: string[];
  setConvertedTokenIds: (tokenIds: string[]) => void;
  convertLoading: boolean;
  setConvertLoading: (loading: boolean) => void;
  checkedConvertTokenIds: string[];
  setCheckedConvertTokenIds: (tokenIds: string[]) => void;
}

export const useBalanceConvertStore = create<BalanceConvertContextProps>((set) => ({
  tokensConvertToSwap: undefined,
  setTokensConvertToIcp: (amount: Array<ConvertToIcp> | undefined) => set(() => ({ tokensConvertToSwap: amount })),
  convertedTokenIds: [],
  setConvertedTokenIds: (tokenIds: string[], clear?: boolean) => {
    set((state) => ({ convertedTokenIds: clear ? [] : [...state.convertedTokenIds, ...tokenIds] }));
  },
  convertLoading: false,
  setConvertLoading: (loading: boolean) => set(() => ({ convertLoading: loading })),
  checkedConvertTokenIds: [],
  setCheckedConvertTokenIds: (tokenIds: string[]) => set(() => ({ checkedConvertTokenIds: tokenIds })),
}));
