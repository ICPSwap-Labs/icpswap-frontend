import { createContext } from "react";
import BigNumber from "bignumber.js";

export type TokenBalance = { [tokenId: string]: BigNumber };

export type Page = "token" | "nft";

export interface WalletContextProps {
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
  page: Page;
  setPage: (page: Page) => void;
  totalUSDBeforeChange: BigNumber;
  setTotalUSDBeforeChange: (tokenId: string, value: BigNumber) => void;
}

export default createContext<WalletContextProps>({
  allTokenUSDMap: {},
} as WalletContextProps);
