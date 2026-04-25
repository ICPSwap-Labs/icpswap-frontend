import type { AddressBook as AddressBookType } from "@icpswap/types";
import { useWalletAddressBookStore } from "components/Wallet/address-book/store";
import { useCallback } from "react";

export function useRemoveAddressHandler() {
  const { setDeleteAddressBook } = useWalletAddressBookStore();

  return useCallback(
    (addressBook: AddressBookType) => {
      setDeleteAddressBook(addressBook);
    },
    [setDeleteAddressBook],
  );
}
