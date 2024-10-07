import { Typography } from "components/Mui";
import { Modal } from "@icpswap/ui";
import { t, Trans } from "@lingui/macro";

export interface CancelLimitConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelLimitConfirm({ open, onConfirm, onClose }: CancelLimitConfirmProps) {
  return (
    <Modal
      open={open}
      title={t`Cancel Limit`}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      cancelText={t`Nerve mind`}
      confirmText={t`Proceed`}
      showConfirm
      showCancel
      background="level1"
    >
      <Typography sx={{ lineHeight: "20px" }}>
        <Trans>
          Cancel this limit order? The tokens will be withdrawn to your wallet( or your pool balance). Proceed?
        </Trans>
      </Typography>
    </Modal>
  );
}
