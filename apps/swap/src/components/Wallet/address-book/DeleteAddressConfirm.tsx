import { deleteAddressBook } from "@icpswap/hooks";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useWalletAddressBookStore } from "components/Wallet/address-book/store";
import { Confirm } from "components/Wallet/Confirm";
import { useWalletStore, WalletManagerPage } from "components/Wallet/store";
import { ADDRESS_BOOK_REFRESH } from "constants/wallet";
import { useRefreshTriggerManager } from "hooks/index";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function DeleteAddressConfirm() {
  const { t } = useTranslation();
  const [, setRefreshTrigger] = useRefreshTriggerManager(ADDRESS_BOOK_REFRESH);
  const { pages, setPages } = useWalletStore();
  const {
    deleteAddressBook: addressBook,
    setDeleteAddressBook,
    deleteAddressBookLoading,
    setDeleteAddressBookLoading,
  } = useWalletAddressBookStore();

  const handleCancel = useCallback(() => {
    setDeleteAddressBook(undefined);
  }, [setDeleteAddressBook]);

  const handleConfirm = useCallback(async () => {
    if (isUndefinedOrNull(addressBook) || deleteAddressBookLoading) return;
    setDeleteAddressBookLoading(true);
    await deleteAddressBook(addressBook.id);
    setRefreshTrigger();
    setDeleteAddressBookLoading(false);
    setDeleteAddressBook(undefined);

    if (pages[0] === WalletManagerPage.EditAddress) {
      setPages(WalletManagerPage.AddressBook);
    }
  }, [
    addressBook,
    deleteAddressBookLoading,
    setRefreshTrigger,
    pages,
    setPages,
    setDeleteAddressBook,
    setDeleteAddressBookLoading,
  ]);

  return (
    <Confirm
      open={nonUndefinedOrNull(addressBook) && deleteAddressBookLoading === false}
      title={t("wallet.delete.address")}
      content={t("wallet.delete.content")}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      confirmText={t("common.delete")}
    />
  );
}
