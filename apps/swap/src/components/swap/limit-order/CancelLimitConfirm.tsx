import { Typography } from "components/Mui";
import { Modal } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface CancelLimitConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelLimitConfirm({ open, onConfirm, onClose }: CancelLimitConfirmProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      title={t("limit.cancel")}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      cancelText={t`Nerve mind`}
      confirmText={t("common.proceed")}
      showConfirm
      showCancel
      background="level1"
    >
      <Typography sx={{ lineHeight: "20px" }}>{t("limit.cancel.confirms")}</Typography>
    </Modal>
  );
}
