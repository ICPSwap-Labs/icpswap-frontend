import type { Token } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import { BigNumber } from "@icpswap/utils";
import { create } from "zustand";

export type TokenBalance = { [tokenId: string]: BigNumber };

export enum AssetsType {
  Token = "Token",
  NFTS = "NFTs",
}

type WalletTokenState = {
  allTokenUSDMap: { [tokenId: string]: BigNumber };
  noUSDTokens: string[];
  setNoUSDTokens: (token: string) => void;
  _totalValue: TokenBalance;
  setTotalValue: (tokenId: string, value: BigNumber) => void;
  totalValue: BigNumber;
  transferTo: string;
  setTransferTo: (transferTo: string) => void;
  transferAmount: BigNumber;
  setTransferAmount: (transferAmount: BigNumber) => void;
  _totalUSDBeforeChange: TokenBalance;
  setTotalUSDBeforeChange: (tokenId: string, value: BigNumber) => void;
  totalUSDBeforeChange: BigNumber;
  tokenReceiveId: string | undefined;
  setTokenReceiveId: (id: string | undefined) => void;
  sendToken: Token;
  setSendToken: (token: Token) => void;
  removeTokenId: string | undefined;
  setRemoveTokenId: (tokenId: string | undefined) => void;
  xtcTopUpShow: boolean;
  setXTCTopUpShow: (show: boolean) => void;
  activeAssetsTab: AssetsType;
  setActiveAssetsTab: (tab: AssetsType) => void;
  displayedAssetsTabs: AssetsType[];
  setDisplayedAssetsTabs: (tabs: Array<AssetsType>) => void;
};

export const useWalletTokenStore = create<WalletTokenState>((set) => ({
  allTokenUSDMap: {},
  noUSDTokens: [],
  setNoUSDTokens: (tokenId: string) => {
    set((state) => ({ noUSDTokens: [...new Set([...state.noUSDTokens, tokenId])] }));
  },
  _totalValue: {},
  setTotalValue: (tokenId: string, value: BigNumber) => {
    set((state) => ({ _totalValue: { ...state._totalValue, [tokenId]: value } }));
    set((state) => {
      const _totalValue = state._totalValue;
      return { totalValue: Object.values(_totalValue).reduce((prev, curr) => prev.plus(curr), new BigNumber(0)) };
    });
  },
  totalValue: new BigNumber(0),
  transferTo: "",
  setTransferTo: (transferTo: string) => set(() => ({ transferTo })),
  transferAmount: new BigNumber(0),
  setTransferAmount: (amount: BigNumber) => set(() => ({ transferAmount: amount })),
  _totalUSDBeforeChange: {},
  setTotalUSDBeforeChange: (tokenId: string, value: BigNumber) => {
    set((state) => ({ _totalUSDBeforeChange: { ...state._totalUSDBeforeChange, [tokenId]: value } }));
    set((state) => {
      return {
        totalUSDBeforeChange: Object.values(state._totalUSDBeforeChange).reduce(
          (prev, curr) => prev.plus(curr),
          new BigNumber(0),
        ),
      };
    });
  },
  totalUSDBeforeChange: new BigNumber(0),
  tokenReceiveId: undefined,
  setTokenReceiveId: (id: string | undefined) => set(() => ({ tokenReceiveId: id })),
  sendToken: ICP,
  setSendToken: (token: Token) => set(() => ({ sendToken: token })),
  removeTokenId: undefined,
  setRemoveTokenId: (tokenId: string | undefined) => {
    set(() => ({ removeTokenId: tokenId }));
  },
  xtcTopUpShow: false,
  setXTCTopUpShow: (show: boolean) => set(() => ({ xtcTopUpShow: show })),
  activeAssetsTab: AssetsType.Token,
  setActiveAssetsTab: (tab: AssetsType) => set(() => ({ activeAssetsTab: tab })),
  displayedAssetsTabs: [AssetsType.Token],
  setDisplayedAssetsTabs: (tabs: Array<AssetsType>) => set(() => ({ displayedAssetsTabs: tabs })),
}));
