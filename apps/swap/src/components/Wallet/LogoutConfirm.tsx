import { useCallback } from "react";
import { Confirm } from "components/Wallet/Confirm";
import { useTranslation } from "react-i18next";
import { useConnectManager } from "store/auth/hooks";
import { useWalletContext } from "./context";

export function LogoutConfirm() {
  const { t } = useTranslation();
  const { logoutConfirmOpen, setLogoutConfirmOpen, setOpen } = useWalletContext();
  const { disconnect } = useConnectManager();

  const handleCancel = useCallback(() => {
    setLogoutConfirmOpen(false);
  }, [setLogoutConfirmOpen]);

  const handleLogoutConfirm = useCallback(async () => {
    await disconnect();
    setOpen(false);
    setLogoutConfirmOpen(false);
  }, [disconnect]);

  return (
    <Confirm
      open={logoutConfirmOpen}
      title={t("common.logout")}
      content={t("logout.description")}
      onCancel={handleCancel}
      onConfirm={handleLogoutConfirm}
    />
  );
}
