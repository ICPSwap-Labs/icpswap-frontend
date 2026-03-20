import type { AddressBook } from "@icpswap/types";
import type { WalletManagerPage } from "components/Wallet/context";
import { createContext, useContext } from "react";

export interface WalletAddressBookContextProps {
  editAddressBook: AddressBook | undefined;
  setEditAddressBook: (addressBook: AddressBook) => void;
  deleteAddressBook: AddressBook | undefined;
  setDeleteAddressBook: (addressBook: AddressBook | undefined) => void;
  deleteAddressBookLoading: boolean;
  setDeleteAddressBookLoading: (loading: boolean) => void;
  selectedContact: AddressBook | undefined;
  setSelectedContact: (contact: AddressBook | undefined) => void;
  addAddressBookPrevPage: WalletManagerPage;
  setAddAddressBookPrevPage: (page: WalletManagerPage) => void;
  selectContactPrevPage: WalletManagerPage;
  setSelectContactPrevPage: (page: WalletManagerPage) => void;
}

export const WalletAddressBookContext = createContext<WalletAddressBookContextProps>(
  {} as WalletAddressBookContextProps,
);

export const useWalletAddressBookContext = () => useContext(WalletAddressBookContext);
