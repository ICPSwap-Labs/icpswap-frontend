import { createContext, useContext } from "react";
import type { NFTTokenMetadata } from "@icpswap/types";

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

export const WalletNFTContext = createContext<WalletNFTContextProps>({} as WalletNFTContextProps);

export const useWalletNFTContext = () => useContext(WalletNFTContext);
