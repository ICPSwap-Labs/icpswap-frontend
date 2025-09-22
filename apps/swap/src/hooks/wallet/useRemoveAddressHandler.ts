import { useCallback } from "react";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { useWalletContext } from "components/Wallet/context";

export function useRemoveAddressHandler() {
  const { setDeleteAddressBook } = useWalletContext();

  return useCallback(
    (addressBook: AddressBookType) => {
      setDeleteAddressBook(addressBook);
    },
    [setDeleteAddressBook],
  );
}
