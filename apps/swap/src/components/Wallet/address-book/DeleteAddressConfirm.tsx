import { useState, useCallback } from "react";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { Confirm } from "components/Wallet/Confirm";
import { useTranslation } from "react-i18next";
import { deleteAddressBook } from "@icpswap/hooks";
import { useRefreshTriggerManager } from "hooks/index";
import { ADDRESS_BOOK_REFRESH } from "constants/wallet";
import { useWalletContext } from "components/Wallet/context";

export function DeleteAddressConfirm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [, setRefreshTrigger] = useRefreshTriggerManager(ADDRESS_BOOK_REFRESH);
  const { deleteAddressBook: addressBook, setDeleteAddressBook } = useWalletContext();

  const handleCancel = useCallback(() => {
    setDeleteAddressBook(undefined);
  }, [setDeleteAddressBook]);

  const handleConfirm = useCallback(async () => {
    if (isUndefinedOrNull(addressBook) || loading) return;
    setLoading(true);
    setDeleteAddressBook(undefined);
    await deleteAddressBook(addressBook.id);
    setRefreshTrigger();
    setLoading(false);
  }, [addressBook, loading, setRefreshTrigger]);

  return (
    <Confirm
      open={nonUndefinedOrNull(addressBook)}
      title={t("wallet.delete.address")}
      content={t("wallet.delete.content")}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      confirmText={t("common.delete")}
    />
  );
}
