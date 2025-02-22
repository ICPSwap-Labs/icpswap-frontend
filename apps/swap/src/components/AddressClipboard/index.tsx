import { useRef } from "react";
import { Grid, Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

import QRCode from "../qrcode";
import Modal from "../modal/index";
import Copy, { CopyRef } from "../Copy";

export interface AddressClipboardProps {
  open: boolean;
  onClose: () => void;
  address: string;
  onConfirm?: () => void;
}

export default function AddressClipboard({
  open,
  onClose,
  address,
  onConfirm: propsConfirm,
  ...props
}: AddressClipboardProps) {
  const { t } = useTranslation();

  const copy = useRef<CopyRef>(null);

  const onConfirm = () => {
    copy?.current?.copy();
    if (propsConfirm) propsConfirm();
  };

  return (
    <Modal
      title={t("common.address")}
      open={open}
      onClose={onClose}
      confirmText={t`Copy Address`}
      showConfirm
      onConfirm={onConfirm}
      {...props}
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
