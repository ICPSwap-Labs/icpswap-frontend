import { useCallback } from "react";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";

export function useRemoveAddressHandler() {
  const { setDeleteAddressBook } = useWalletAddressBookContext();

  return useCallback(
    (addressBook: AddressBookType) => {
      setDeleteAddressBook(addressBook);
    },
    [setDeleteAddressBook],
  );
}
