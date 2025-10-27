import { useState, ReactNode } from "react";
import {
  ExtNFTSendInfo,
  WalletNFTContext,
  type DisplayedNFTInfo,
  type DisplayedNFTTokenInfo,
} from "components/Wallet/NFT/NFTContext";
import { NFTTokenMetadata } from "@icpswap/types";

interface WalletContextProviderProps {
  children: ReactNode;
}

export function WalletNFTContextProvider({ children }: WalletContextProviderProps) {
  const [displayedNFTInfo, setDisplayedNFTInfo] = useState<DisplayedNFTInfo | undefined>(undefined);
  const [displayedNFTTokenInfo, setDisplayedNFTTokenInfo] = useState<DisplayedNFTTokenInfo | undefined>(undefined);
  const [sendingNFTMetadata, setSendingNFTMetadata] = useState<NFTTokenMetadata | undefined>(undefined);
  const [extNFTSendingInfo, setExtNFTSendingInfo] = useState<ExtNFTSendInfo | undefined>(undefined);

  return (
    <WalletNFTContext.Provider
      value={{
        displayedNFTInfo,
        setDisplayedNFTInfo,
        displayedNFTTokenInfo,
        setDisplayedNFTTokenInfo,
        sendingNFTMetadata,
        setSendingNFTMetadata,
        extNFTSendingInfo,
        setExtNFTSendingInfo,
      }}
    >
      {children}
    </WalletNFTContext.Provider>
  );
}
