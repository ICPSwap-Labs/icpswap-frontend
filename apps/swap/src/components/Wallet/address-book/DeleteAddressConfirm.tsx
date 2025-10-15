import { useCallback } from "react";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { Confirm } from "components/Wallet/Confirm";
import { useTranslation } from "react-i18next";
import { deleteAddressBook } from "@icpswap/hooks";
import { useRefreshTriggerManager } from "hooks/index";
import { ADDRESS_BOOK_REFRESH } from "constants/wallet";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";

export function DeleteAddressConfirm() {
  const { t } = useTranslation();
  const [, setRefreshTrigger] = useRefreshTriggerManager(ADDRESS_BOOK_REFRESH);
  const {
    deleteAddressBook: addressBook,
    setDeleteAddressBook,
    pages,
    setPages,
    deleteAddressBookLoading,
    setDeleteAddressBookLoading,
  } = useWalletContext();

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
  }, [addressBook, deleteAddressBookLoading, setRefreshTrigger, pages, setPages]);

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
