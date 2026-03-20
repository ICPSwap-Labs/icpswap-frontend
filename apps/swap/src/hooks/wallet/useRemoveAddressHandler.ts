import type { AddressBook as AddressBookType } from "@icpswap/types";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { useCallback } from "react";

export function useRemoveAddressHandler() {
  const { setDeleteAddressBook } = useWalletAddressBookContext();

  return useCallback(
    (addressBook: AddressBookType) => {
      setDeleteAddressBook(addressBook);
    },
    [setDeleteAddressBook],
  );
}
