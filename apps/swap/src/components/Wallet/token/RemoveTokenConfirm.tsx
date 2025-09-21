import { useState, useCallback } from "react";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { Confirm } from "components/Wallet/Confirm";
import { useTranslation } from "react-i18next";
import { useWalletContext } from "components/Wallet/context";
import { useRemoveTokenHandler } from "hooks/wallet/useRemoveToken";
import { useTips, TIP_SUCCESS } from "hooks/index";

export function RemoveTokenConfirm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [openTip] = useTips();
  const { setRemoveTokenId, removeTokenId } = useWalletContext();

  const removeTokenHandler = useRemoveTokenHandler();

  const handleCancel = useCallback(() => {
    setRemoveTokenId(undefined);
  }, [setRemoveTokenId]);

  const handleConfirm = useCallback(async () => {
    if (isUndefinedOrNull(removeTokenId) || loading) return;
    setLoading(true);
    await removeTokenHandler(removeTokenId);
    openTip(t("wallet.token.removed.success"), TIP_SUCCESS);
    setLoading(false);
    setRemoveTokenId(undefined);
  }, [removeTokenId, loading]);

  return (
    <Confirm
      open={nonUndefinedOrNull(removeTokenId)}
      title={t("common.remove.token")}
      content={t("wallet.remove.token.confirms")}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      confirmText={t("common.remove")}
    />
  );
}
