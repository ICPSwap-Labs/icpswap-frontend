import { deletePriceAlertEmail, sendPriceAlertEmail, verifyPriceAlertEmail } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";
import { FilledTextField, Modal, TextButton } from "@icpswap/ui";
import { isUndefinedOrNull, isUndefinedOrNullOrEmpty, validateEmail } from "@icpswap/utils";
import { Box, Button, Typography, InputAdornment, CircularProgress } from "components/Mui";
import { PRICE_ALERTS_MODAL_WIDTH } from "constants/price-alerts";
import { TIP_ERROR, TIP_SUCCESS, useTips } from "hooks/index";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useEmailSecondManger, useShowGetCodeManager } from "store/price-alerts/hooks";
import { useResetEmailManager } from "components/PriceAlerts/state";

interface EmailSettingProps {
  open: boolean;
  onClose?: () => void;
  onVerifySuccess?: () => void;
}

export function EmailSetting({ open, onClose, onVerifySuccess }: EmailSettingProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const [openTip] = useTips();

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [email, setEmail] = useState<undefined | string>(undefined);
  const [code, setCode] = useState<string | undefined>(undefined);
  const [showGetCode, setShowGetCode] = useShowGetCodeManager();
  const [second] = useEmailSecondManger();
  const [isResetEmail] = useResetEmailManager();

  const handleGetCode = useCallback(async () => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(email)) return;

    setShowGetCode(false);

    const { status, message } = await sendPriceAlertEmail({ principal, email });

    if (status === ResultStatus.OK) {
      openTip(t("price.alerts.email.send.success"), TIP_SUCCESS);
    } else {
      openTip(message ?? t("price.alerts.email.send.failed"), TIP_ERROR);
    }
  }, [setShowGetCode, email, principal]);

  const handleSetEmail = useCallback(
    (email: string) => {
      setEmail(email);
    },
    [setEmail],
  );

  const handleSetCode = useCallback(
    (code: string) => {
      setCode(code);
    },
    [setCode],
  );

  const handleVerifyEmail = useCallback(async () => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(email) || isUndefinedOrNull(code)) return;

    setVerifyLoading(true);

    const { status, message } = await verifyPriceAlertEmail({ email, principal, code });

    if (status === ResultStatus.OK) {
      openTip(t("price.alerts.email.verify.success"), TIP_SUCCESS);

      if (isResetEmail) await deletePriceAlertEmail();
      if (onClose) onClose();
      if (onVerifySuccess) onVerifySuccess();
    } else {
      openTip(isUndefinedOrNullOrEmpty(message) ? t("price.alerts.email.verify.failed") : message, TIP_ERROR);
    }

    setVerifyLoading(false);
  }, [principal, email, code, onClose, onVerifySuccess, isResetEmail]);

  const disableGetCode = useMemo(() => {
    if (isUndefinedOrNull(email)) return true;

    return !validateEmail(email);
  }, [email]);

  return (
    <Modal
      open={open}
      title={isResetEmail ? "Change Email" : t("price.alerts.create.alert")}
      dialogWidth={PRICE_ALERTS_MODAL_WIDTH}
      onClose={onClose}
      onCancel={onClose}
    >
      {isResetEmail ? (
        <Typography sx={{ lineHeight: "20px" }}>
          When you change your email address, all previously created alerts will be automatically cancelled. Please
          re-set any alerts you wish to keep.
        </Typography>
      ) : null}

      {isResetEmail ? <Typography sx={{ margin: "32px 0 0 0" }}>New Email</Typography> : <Typography>Email</Typography>}
      <Box sx={{ margin: "9px 0 0 0" }}>
        <FilledTextField
          fullWidth
          placeholder={isResetEmail ? "Enter new email" : "Enter email"}
          onChange={handleSetEmail}
        />
      </Box>
      <Box sx={{ margin: "12px 0 0 0" }}>
        <FilledTextField
          fullWidth
          placeholder="Enter verification code"
          textFieldProps={{
            slotProps: {
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {showGetCode ? (
                      <TextButton
                        sx={{
                          "&:hover": {
                            textDecoration: "none",
                          },
                        }}
                        onClick={handleGetCode}
                        disabled={disableGetCode}
                      >
                        Get code
                      </TextButton>
                    ) : (
                      <Typography>{second}s</Typography>
                    )}
                  </InputAdornment>
                ),
                maxLength: 50,
              },
            },
          }}
          onChange={handleSetCode}
        />
      </Box>

      <Box sx={{ margin: "32px 0 0 0" }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={isUndefinedOrNullOrEmpty(email) || isUndefinedOrNullOrEmpty(code) || verifyLoading}
          onClick={handleVerifyEmail}
          startIcon={verifyLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {t("common.confirm")}
        </Button>
      </Box>
    </Modal>
  );
}
