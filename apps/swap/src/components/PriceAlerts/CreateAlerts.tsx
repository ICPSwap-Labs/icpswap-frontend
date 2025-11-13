import { Flex, Modal, FilledTextField, TextButton } from "@icpswap/ui";
import { Box, Button, Typography, useTheme, CircularProgress } from "components/Mui";
import { SelectToken } from "components/Select/SelectToken";
import { PRICE_ALERTS_MODAL_WIDTH } from "constants/swap";
import { useCallback, useMemo, useState } from "react";
import { AlertTypeSelector } from "components/PriceAlerts/AlertTypeSelector";
import { NumberFilledTextField } from "components/Input/NumberFilledTextField";
import { TIP_ERROR, TIP_SUCCESS, useTips, useToken } from "hooks/index";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { addPriceAlert } from "@icpswap/hooks";
import { ResultStatus, type AlertType } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { useShowEmailManager } from "components/PriceAlerts/state";

interface SelectButtonProps {
  height?: string;
  text: string;
  active?: boolean;
  onClick: () => void;
}

function SelectButton({ text, height = "48px", active, onClick }: SelectButtonProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: theme.palette.background.level4,
        width: "100%",
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: active ? "1px solid #ffffff" : `1px slid ${theme.palette.background.level4}`,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Typography sx={{ color: "text.primary", fontWeight: 500 }}>{text}</Typography>
    </Box>
  );
}

interface CreateAlertsModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onCreateSuccess?: () => void;
}

export function CreateAlertsModal({ open, onClose, email, onCreateSuccess }: CreateAlertsModalProps) {
  const { t } = useTranslation();
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);
  const [targetPrice, setTargetPrice] = useState<undefined | string>(undefined);
  const [alertFrequency, setAlertFrequency] = useState<undefined | "Once" | "Every">(undefined);
  const [alertType, setAlertType] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState(false);
  const [, token] = useToken(tokenId);
  const [openTip] = useTips();
  const [, setShowEmail] = useShowEmailManager();

  const handleAdd = useCallback(async () => {
    if (
      isUndefinedOrNull(tokenId) ||
      isUndefinedOrNull(alertFrequency) ||
      isUndefinedOrNull(alertType) ||
      isUndefinedOrNull(targetPrice)
    )
      return;

    setLoading(true);

    const { status, message } = await addPriceAlert({
      repeated: alertFrequency === "Every",
      email,
      tokenId,
      alertType: { [alertType]: null } as AlertType,
      alertValue: Number(targetPrice),
    });

    if (status === ResultStatus.OK) {
      openTip("Create alert successfully", TIP_SUCCESS);
      onClose();
      if (onCreateSuccess) onCreateSuccess();
    } else {
      openTip(message ?? "Failed to create alert", TIP_ERROR);
    }

    setLoading(false);
  }, [tokenId, alertFrequency, alertType, targetPrice, email, onClose, onCreateSuccess]);

  const error = useMemo(() => {
    if (isUndefinedOrNull(tokenId)) return "Add";
    if (isUndefinedOrNull(alertFrequency)) return "Add";
    if (isUndefinedOrNull(alertType)) return "Add";
    if (isUndefinedOrNull(targetPrice)) return "Add";
    return undefined;
  }, [tokenId, alertFrequency, alertType, targetPrice]);

  return (
    <Modal open={open} title={t("price.alerts.create.alert")} dialogWidth={PRICE_ALERTS_MODAL_WIDTH} onClose={onClose}>
      <Flex fullWidth align="flex-start" vertical gap="16px 0">
        <Box sx={{ width: "100%" }}>
          <Typography>Token</Typography>
          <Box sx={{ height: "48px", margin: "12px 0 0 0" }}>
            <SelectToken filled showClean={false} fullHeight search onTokenChange={setTokenId} />
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography>Alert type</Typography>
          <Box sx={{ height: "48px", margin: "12px 0 0 0" }}>
            <AlertTypeSelector filled showClean={false} fullHeight onChange={setAlertType} />
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography>Targe price</Typography>
          <Box sx={{ width: "100%", margin: "12px 0 0 0" }}>
            <NumberFilledTextField
              value={targetPrice}
              border="none"
              onChange={(value: string) => setTargetPrice(value)}
              numericProps={{
                thousandSeparator: true,
                decimalScale: token?.decimals ?? 18,
                allowNegative: false,
                maxLength: 20,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography>Alert frequency</Typography>
          <Box sx={{ width: "100%", margin: "12px 0 0 0" }}>
            <Flex fullWidth gap="0 16px">
              <Box sx={{ flex: "50%" }}>
                <SelectButton
                  text={t("price.alerts.alert.type.every.time")}
                  onClick={() => setAlertFrequency("Every")}
                  active={alertFrequency === "Every"}
                />
              </Box>
              <Box sx={{ flex: "50%" }}>
                <SelectButton
                  text={t("price.alerts.alert.type.once.only")}
                  onClick={() => setAlertFrequency("Once")}
                  active={alertFrequency === "Once"}
                />
              </Box>
            </Flex>
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography>Email</Typography>
          <Box sx={{ width: "100%", margin: "12px 0 0 0" }}>
            <FilledTextField value={email} disabled disabledTextColor="#ffffff" />
            <Flex sx={{ margin: "12px 0 0 0" }} justify="flex-end">
              <TextButton onClick={() => setShowEmail(true)}>Change Email</TextButton>
            </Flex>
          </Box>
        </Box>
      </Flex>

      <Box sx={{ margin: "32px 0 0 0" }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={nonUndefinedOrNull(error) || loading}
          startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
          onClick={handleAdd}
        >
          {t("common.add")}
        </Button>
      </Box>
    </Modal>
  );
}
