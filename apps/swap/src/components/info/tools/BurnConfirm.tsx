import { Modal } from "@icpswap/ui";
import { TokenImage } from "components/index";
import { Typography, Box, Button, CircularProgress } from "components/Mui";
import { tokenTransfer } from "hooks/token/calls";
import { useAccountPrincipal } from "store/auth/hooks";
import { BigNumber, formatTokenAmount } from "@icpswap/utils";
import { useSuccessTip, useErrorTip, useLoadingTip } from "hooks/useTips";
import { useState } from "react";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export interface ConfirmBurnProps {
  open: boolean;
  onClose: () => void;
  token: Token | undefined;
  mintingAccount:
    | {
        owner: string;
        sub: number[] | undefined;
      }
    | undefined;
  amount: string | undefined;
  onBurnSuccess?: () => void;
}

export function BurnConfirmModal({ open, onClose, token, mintingAccount, amount, onBurnSuccess }: ConfirmBurnProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();

  const [loading, setLoading] = useState(false);
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const handleConfirm = async () => {
    if (loading || amount === undefined || mintingAccount === undefined || !token || !principal) return;

    setLoading(true);

    const loadingKey = openLoadingTip(t("tools.burning.amount", { amount: `${amount} ${token.symbol}` }));
    onClose();

    const { status, message } = await tokenTransfer({
      canisterId: token.address,
      to: mintingAccount.owner,
      subaccount: mintingAccount.sub,
      from: principal.toString(),
      amount: formatTokenAmount(amount, token.decimals),
    });

    closeLoadingTip(loadingKey);

    if (status === "ok") {
      openSuccessTip(`Burn ${token.symbol} successfully`);
      if (onBurnSuccess) onBurnSuccess();
    } else {
      openErrorTip(message ?? `Failed to burn ${token.symbol}`);
    }

    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} title={t("burn.confirm")}>
      <Box sx={{ padding: "30px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TokenImage logo={token?.logo} size="56px" />
        <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "text.primary", margin: "12px 0 0 0" }}>
          {token?.symbol}
        </Typography>
      </Box>

      <Box sx={{ margin: "32px 0 0 0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>{t("tools.minting.account")}</Typography>
          <Typography color="text.primary">{mintingAccount?.owner}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", margin: "20px 0 0 0" }}>
          <Typography>{t("common.amount")}</Typography>
          <Typography color="text.primary">{amount ? new BigNumber(amount).toFormat() : "--"}</Typography>
        </Box>
      </Box>

      <Box sx={{ margin: "48px 0 0 0" }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress color="inherit" size={30} /> : null}
          onClick={handleConfirm}
        >
          {t("common.confirm")}
        </Button>
      </Box>
    </Modal>
  );
}
