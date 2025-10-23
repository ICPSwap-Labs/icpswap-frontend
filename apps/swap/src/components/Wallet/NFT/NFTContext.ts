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

export interface WalletNFTContextProps {
  displayedNFTInfo: DisplayedNFTInfo | undefined;
  setDisplayedNFTInfo: (info: DisplayedNFTInfo) => void;
  displayedNFTTokenInfo: DisplayedNFTTokenInfo | undefined;
  setDisplayedNFTTokenInfo: (info: DisplayedNFTTokenInfo) => void;
  sendingNFTMetadata: NFTTokenMetadata | undefined;
  setSendingNFTMetadata: (info: NFTTokenMetadata | undefined) => void;
}

export const WalletNFTContext = createContext<WalletNFTContextProps>({} as WalletNFTContextProps);

export const useWalletNFTContext = () => useContext(WalletNFTContext);
