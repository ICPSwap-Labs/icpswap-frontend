import { createContext, ReactNode, useContext } from "react";
import { Token } from "@icpswap/swap-sdk";

export type Page = "token" | "nft";

export type ConfirmProps = {
  open: boolean;
  title: ReactNode | undefined;
  content: ReactNode | undefined;
};

export enum WalletManagerPage {
  Index = "Index",
  ManageTokens = "ManageTokens",
  Receive = "Receive",
  Send = "Send",
  TokenSelector = "TokenSelector",
  AddressBook = "AddressBook",
  AddAddress = "AddAddress",
  EditAddress = "EditAddress",
  SelectContact = "SelectContact",
  Convert = "Convert",

  NFTCanister = "NFTCanister",
  NFTTokenDetails = "NFTTokenDetails",
  NFTSend = "NFTSend",
}

export type ConvertToIcp = {
  tokenId: string;
  icpAmount: string;
  poolId: string;
  amount: string;
  token: Token;
};

export interface WalletContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  // refreshCounter: number;
  // setRefreshCounter: (refreshCounter: number) => void;
  page: Page;
  setPage: (page: Page) => void;
  pages: Array<WalletManagerPage>;
  setPages: (page: WalletManagerPage, closeCurrent?: boolean) => void;
  logoutConfirmOpen: boolean;
  setLogoutConfirmOpen: (open: boolean) => void;
  closeDrawer: () => void;
  openDrawer: () => void;
}

export const WalletContext = createContext<WalletContextProps>({} as WalletContextProps);

export const useWalletContext = () => useContext(WalletContext);
