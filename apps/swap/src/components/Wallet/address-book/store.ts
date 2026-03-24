import type { AddressBook } from "@icpswap/types";
import { WalletManagerPage } from "components/Wallet/store";
import { create } from "zustand";

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

export const useWalletAddressBookStore = create<WalletAddressBookContextProps>((set) => ({
  editAddressBook: undefined,
  setEditAddressBook: (addressBook: AddressBook) => set(() => ({ editAddressBook: addressBook })),
  deleteAddressBook: undefined,
  setDeleteAddressBook: (addressBook: AddressBook | undefined) => set(() => ({ deleteAddressBook: addressBook })),
  deleteAddressBookLoading: false,
  setDeleteAddressBookLoading: (loading: boolean) => set(() => ({ deleteAddressBookLoading: loading })),
  selectedContact: undefined,
  setSelectedContact: (contact: AddressBook | undefined) => set(() => ({ selectedContact: contact })),
  addAddressBookPrevPage: WalletManagerPage.AddressBook,
  setAddAddressBookPrevPage: (page: WalletManagerPage) => set(() => ({ addAddressBookPrevPage: page })),
  selectContactPrevPage: WalletManagerPage.Send,
  setSelectContactPrevPage: (page: WalletManagerPage) => set(() => ({ selectContactPrevPage: page })),
}));
