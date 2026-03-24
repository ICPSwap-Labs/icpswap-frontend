import type { NFTTokenMetadata } from "@icpswap/types";
import { create } from "zustand";

export type DisplayedNFTInfo = {
  id: string;
  name: string;
};

export type DisplayedNFTTokenInfo = {
  id: string;
  index: number;
};

export type ExtNFTSendInfo = {
  name: string;
  canister: string;
  extTokenId: string;
  logo: string;
};

export interface WalletNFTContextProps {
  displayedNFTInfo: DisplayedNFTInfo | undefined;
  setDisplayedNFTInfo: (info: DisplayedNFTInfo) => void;
  displayedNFTTokenInfo: DisplayedNFTTokenInfo | undefined;
  setDisplayedNFTTokenInfo: (info: DisplayedNFTTokenInfo) => void;
  sendingNFTMetadata: NFTTokenMetadata | undefined;
  setSendingNFTMetadata: (info: NFTTokenMetadata | undefined) => void;
  extNFTSendingInfo: ExtNFTSendInfo | undefined;
  setExtNFTSendingInfo: (info: ExtNFTSendInfo | undefined) => void;
}

export const useWalletNFTStore = create<WalletNFTContextProps>((set) => ({
  displayedNFTInfo: undefined,
  setDisplayedNFTInfo: (info: DisplayedNFTInfo) => set(() => ({ displayedNFTInfo: info })),
  displayedNFTTokenInfo: undefined,
  setDisplayedNFTTokenInfo: (info: DisplayedNFTTokenInfo) => set(() => ({ displayedNFTTokenInfo: info })),
  sendingNFTMetadata: undefined,
  setSendingNFTMetadata: (info: NFTTokenMetadata | undefined) => set(() => ({ sendingNFTMetadata: info })),
  extNFTSendingInfo: undefined,
  setExtNFTSendingInfo: (info: ExtNFTSendInfo | undefined) => set(() => ({ extNFTSendingInfo: info })),
}));
