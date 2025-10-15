import { createContext, ReactNode, useContext } from "react";
import { BigNumber } from "@icpswap/utils";
import { AddressBook } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";

export type TokenBalance = { [tokenId: string]: BigNumber };

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
  tokenReceiveId: string | undefined;
  setTokenReceiveId: (id: string | undefined) => void;
  editAddressBook: AddressBook | undefined;
  setEditAddressBook: (addressBook: AddressBook) => void;
  deleteAddressBook: AddressBook | undefined;
  setDeleteAddressBook: (addressBook: AddressBook | undefined) => void;
  deleteAddressBookLoading: boolean;
  setDeleteAddressBookLoading: (loading: boolean) => void;
  selectedContact: AddressBook | undefined;
  setSelectedContact: (contact: AddressBook | undefined) => void;
  sendToken: Token;
  setSendToken: (token: Token) => void;
  pages: Array<WalletManagerPage>;
  setPages: (page: WalletManagerPage, closeCurrent?: boolean) => void;
  addAddressBookPrevPage: WalletManagerPage;
  setAddAddressBookPrevPage: (page: WalletManagerPage) => void;
  logoutConfirmOpen: boolean;
  setLogoutConfirmOpen: (open: boolean) => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  removeTokenId: string | undefined;
  setRemoveTokenId: (tokenId: string | undefined) => void;
  xtcTopUpShow: boolean;
  setXTCTopUpShow: (show: boolean) => void;
  tokensConvertToSwap: Array<ConvertToIcp> | undefined;
  setTokensConvertToIcp: (amount: Array<ConvertToIcp> | undefined) => void;
  convertedTokenIds: string[];
  setConvertedTokenIds: (tokenIds: string[]) => void;
  convertLoading: boolean;
  setConvertLoading: (loading: boolean) => void;
  checkedConvertTokenIds: string[];
  setCheckedConvertTokenIds: (tokenIds: string[]) => void;
}

export const WalletContext = createContext<WalletContextProps>({
  allTokenUSDMap: {},
} as WalletContextProps);

export const useWalletContext = () => useContext(WalletContext);
