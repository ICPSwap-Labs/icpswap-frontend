import type { Token } from "@icpswap/swap-sdk";
import { create } from "zustand";

export enum Page {
  token = "token",
  nft = "nft",
}

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
  NFTImporter = "NFTImporter",
  NFTExtCanister = "NFTExtCanister",
  NFTExtTokenDetails = "NFTExtTokenDetails",
  NFTExtSend = "NFTExtSend",
}

export type ConvertToIcp = {
  tokenId: string;
  icpAmount: string;
  poolId: string;
  amount: string;
  token: Token;
};

export interface WalletStoreProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  page: Page;
  setPage: (page: Page) => void;
  pages: Array<WalletManagerPage>;
  setPages: (page: WalletManagerPage, closeCurrent?: boolean) => void;
  logoutConfirmOpen: boolean;
  setLogoutConfirmOpen: (open: boolean) => void;
  closeDrawer: () => void;
  openDrawer: () => void;
}

export const useWalletStore = create<WalletStoreProps>((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open })),
  page: Page.token,
  setPage: (page: Page) => set(() => ({ page })),
  pages: [WalletManagerPage.Index],
  setPages: (page: WalletManagerPage) => set(() => ({ pages: [page] })),
  logoutConfirmOpen: false,
  setLogoutConfirmOpen: (open: boolean) => set(() => ({ logoutConfirmOpen: open })),
  closeDrawer: () => {
    set(() => ({ open: false, pages: [WalletManagerPage.Index] }));
  },
  openDrawer: () => set(() => ({ open: true, pages: [WalletManagerPage.Index] })),
}));
