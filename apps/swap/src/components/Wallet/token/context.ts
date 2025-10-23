import { createContext, useContext } from "react";
import { BigNumber } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";

export type TokenBalance = { [tokenId: string]: BigNumber };

export interface WalletTokenContextProps {
  refreshTotalBalance?: boolean;
  setRefreshTotalBalance?: (refreshTotalBalance: boolean) => void;
  refreshCounter: number;
  setRefreshCounter: (refreshCounter: number) => void;
  allTokenUSDMap: { [tokenId: string]: BigNumber };
  noUSDTokens: string[];
  setNoUSDTokens: (token: string) => void;
  totalValue: BigNumber;
  setTotalValue: (tokenId: string, value: BigNumber) => void;
  transferTo: string;
  setTransferTo: (transferTo: string) => void;
  transferAmount: BigNumber;
  setTransferAmount: (transferAmount: BigNumber) => void;
  totalUSDBeforeChange: BigNumber;
  setTotalUSDBeforeChange: (tokenId: string, value: BigNumber) => void;
  tokenReceiveId: string | undefined;
  setTokenReceiveId: (id: string | undefined) => void;
  sendToken: Token;
  setSendToken: (token: Token) => void;
  removeTokenId: string | undefined;
  setRemoveTokenId: (tokenId: string | undefined) => void;
  xtcTopUpShow: boolean;
  setXTCTopUpShow: (show: boolean) => void;
}

export const WalletTokenContext = createContext<WalletTokenContextProps>({
  allTokenUSDMap: {},
} as WalletTokenContextProps);

export const useWalletTokenContext = () => useContext(WalletTokenContext);
