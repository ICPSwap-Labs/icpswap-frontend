import { useRef } from "react";
import { Grid, Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

import QRCode from "../qrcode";
import Modal from "../modal/index";
import Copy, { CopyRef } from "../Copy";

export interface ReceiveModalProps {
  open: boolean;
  onClose: () => void;
  address: string;
}

export function ReceiveModal({ open, onClose, address }: ReceiveModalProps) {
  const { t } = useTranslation();
  const copy = useRef<CopyRef>(null);

  const onConfirm = () => {
    copy?.current?.copy();
  };

  return (
    <Modal
      title={t("common.receive")}
      open={open}
      onClose={onClose}
      showConfirm
      onConfirm={onConfirm}
      confirmText={t("common.copy.address")}
    >
      <Grid container spacing={2}>
        <Grid container item xs={12} justifyContent="center">
          <Grid item>
            <QRCode value={address} />
          </Grid>
        </Grid>

        <Grid container item xs={12} justifyContent="center">
          <Grid item>
            <Typography
              color="textSecondary"
              sx={{
                wordBreak: "break-all",
              }}
            >
              {address}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Copy ref={copy} content={address} hide />
    </Modal>
  );
}
