import { useCallback, useState } from "react";
import { Modal, MaxButton, Flex, FilledTextField, NumberFilledTextField } from "components/index";
import { Box, Button, Typography } from "components/Mui";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";
import { XTC } from "constants/tokens";
import {
  parseTokenAmount,
  formatTokenAmount,
  numberToString,
  isValidPrincipal,
  BigNumber,
  isUndefinedOrNull,
} from "@icpswap/utils";
import { useTips, TIP_LOADING, TIP_SUCCESS, TIP_ERROR } from "hooks/useTips";
import { useXTCTopUp } from "hooks/token/dip20";
import { getLocaleMessage } from "i18n/service";
import { ResultStatus } from "constants/index";
import { useTranslation } from "react-i18next";

const XTC_TOP_UP_AMOUNT_DECIMALS = 4;

export interface XTCTopUpProps {
  open: boolean;
  onClose?: () => void;
  onTopUpSuccess?: () => void;
}

export interface Values {
  amount: string | number;
  canisterId: string;
}

export function XTCTopUpModal({ open, onClose, onTopUpSuccess }: XTCTopUpProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const { result: balance, loading } = useTokenBalance(XTC.address, principal);
  const [canisterId, setCanisterId] = useState<undefined | string>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [topUpLoading, setTopUpLoading] = useState<boolean>(false);
  const [openTip, closeTip] = useTips();

  const handleFieldChange = (value: string, field: string) => {
    if (field === "canisterId") {
      setCanisterId(value);
    } else if (field === "amount") {
      setAmount(amount);
    }
  };

  const XTCTopUp = useXTCTopUp();

  const handleTopUp = useCallback(async () => {
    if (loading || isUndefinedOrNull(canisterId) || isUndefinedOrNull(amount) || canisterId === "" || amount === "")
      return;

    if (onClose) onClose();
    setTopUpLoading(true);

    const loadingTipKey = openTip(t("wallet.xtc.top.up", { amount, canisterId }), TIP_LOADING);

    const { status, message } = await XTCTopUp({
      canisterId,
      amount: BigInt(numberToString(formatTokenAmount(amount, XTC.decimals).minus(Number(XTC.transFee)))),
    });

    closeTip(loadingTipKey);

    if (status === ResultStatus.OK) {
      openTip(t`Top-up successfully`, TIP_SUCCESS);
      if (onTopUpSuccess) onTopUpSuccess();
    } else {
      openTip(getLocaleMessage(message) ?? message, TIP_ERROR);
    }

    setTopUpLoading(false);
  }, [topUpLoading, setTopUpLoading, canisterId, name]);

  const handleMax = useCallback(() => {
    if (balance) {
      const amount = parseTokenAmount(balance, XTC.decimals).toFixed(XTC_TOP_UP_AMOUNT_DECIMALS);

      if (!new BigNumber(amount).isEqualTo(0)) {
        setAmount(amount);
      }
    }
  }, [balance]);

  let errorMessage = "";
  if (amount && XTC && new BigNumber(Number(amount)).isGreaterThan(parseTokenAmount(balance ?? 0, XTC.decimals)))
    errorMessage = t("common.error.insufficient.balance");
  if (!amount) errorMessage = t`Enter top-up XTC amount`;
  if (canisterId && !isValidPrincipal(canisterId)) errorMessage = t("common.error.invalid.canister.id");
  if (!canisterId) errorMessage = t("xtc.enter.canister");

  return (
    <Modal open={open} title={t("wallet.topUp.xtc")} onClose={onClose}>
      <Flex gap="8px 0" vertical align="flex-start" fullWidth>
        <Typography>{t("common.canister.id")}</Typography>

        <Box sx={{ width: "100%" }}>
          <FilledTextField
            value={canisterId}
            fullWidth
            onChange={(value) => handleFieldChange(value, "canisterId")}
            placeholder={t`Enter a canister ID`}
          />
        </Box>
      </Flex>

      <Box mt="30px" sx={{ width: "100%" }}>
        <Flex vertical fullWidth gap="8px 0" align="flex-start">
          <Typography>{t("common.amount")}</Typography>
          <Box sx={{ width: "100%" }}>
            <NumberFilledTextField
              fullWidth
              value={amount}
              onChange={(value) => handleFieldChange(value, "amount")}
              placeholder={t("xtc.topUp.enter.amount")}
              numericProps={{
                thousandSeparator: true,
                allowNegative: false,
                decimalScale: XTC_TOP_UP_AMOUNT_DECIMALS,
                maxLength: 16,
              }}
            />
          </Box>
        </Flex>
      </Box>

      <Flex fullWidth align="center" sx={{ margin: "12px 0 0 0" }}>
        <Typography color="text.primary" component="span">
          {t("common.balance.colon")}
        </Typography>
        &nbsp;
        <Typography color="text.primary" component="span" sx={{ marginRight: "4px" }}>
          {balance ? parseTokenAmount(balance, XTC?.decimals).toFormat() : loading ? "--" : 0}
        </Typography>
        <MaxButton onClick={handleMax} />
      </Flex>

      <Flex fullWidth align="center" sx={{ margin: "12px 0 0 0" }}>
        <Typography color="text.primary" component="span">
          {t("common.fee.colon.amount", { amount: XTC ? parseTokenAmount(XTC.transFee, XTC?.decimals).toFormat() : 0 })}
        </Typography>
      </Flex>

      <Box mt="40px">
        <Button size="large" fullWidth variant="contained" disabled={!!errorMessage} onClick={handleTopUp}>
          {errorMessage || t("common.submit")}
        </Button>
      </Box>
    </Modal>
  );
}
