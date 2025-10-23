import { useState, ReactNode } from "react";
import { WalletManagerPage } from "components/Wallet/context";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { WalletAddressBookContext } from "components/Wallet/address-book/context";

interface WalletAddressBookProviderProps {
  children: ReactNode;
}

export function WalletAddressBookProvider({ children }: WalletAddressBookProviderProps) {
  const [editAddressBook, setEditAddressBook] = useState<AddressBookType | undefined>(undefined);
  const [deleteAddressBook, setDeleteAddressBook] = useState<AddressBookType | undefined>(undefined);
  const [selectedContact, setSelectedContact] = useState<AddressBookType | undefined>(undefined);
  const [addAddressBookPrevPage, setAddAddressBookPrevPage] = useState<WalletManagerPage>(
    WalletManagerPage.AddressBook,
  );
  const [deleteAddressBookLoading, setDeleteAddressBookLoading] = useState<boolean>(false);
  const [selectContactPrevPage, setSelectContactPrevPage] = useState<WalletManagerPage>(WalletManagerPage.Send);

  return (
    <WalletAddressBookContext.Provider
      value={{
        editAddressBook,
        setEditAddressBook,
        deleteAddressBook,
        setDeleteAddressBook,
        selectedContact,
        setSelectedContact,
        addAddressBookPrevPage,
        setAddAddressBookPrevPage,
        deleteAddressBookLoading,
        setDeleteAddressBookLoading,
        selectContactPrevPage,
        setSelectContactPrevPage,
      }}
    >
      {children}
    </WalletAddressBookContext.Provider>
  );
}
