import { useState } from "react";
import { Modal, MaxButton, NumberTextField, Flex } from "components/index";
import { Box, Button, Typography, TextField } from "components/Mui";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";
import { XTC } from "constants/tokens";
import { parseTokenAmount, formatTokenAmount, numberToString, isValidPrincipal, BigNumber } from "@icpswap/utils";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Identity as CallIdentity } from "types/global";
import { useTips, TIP_LOADING, TIP_SUCCESS, TIP_ERROR } from "hooks/useTips";
import { useXTCTopUp } from "hooks/token/dip20";
import { getLocaleMessage } from "i18n/service";
import { ResultStatus } from "constants/index";
import { useTranslation } from "react-i18next";

export interface XTCTopUpProps {
  open: boolean;
  onClose: () => void;
  onTopUpSuccess?: () => void;
}

export interface Values {
  amount: string | number;
  canisterId: string;
}

export default function XTCTopUp({ open, onClose, onTopUpSuccess }: XTCTopUpProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const { result: balance, loading } = useTokenBalance(XTC.address, principal);

  const defaultValues = {
    canisterId: "",
    amount: "",
  };

  const [values, setValues] = useState<Values>(defaultValues);
  const [openTip, closeTip] = useTips();

  const onFieldChange = (value: string, field: string) => {
    setValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const XTCTopUp = useXTCTopUp();

  const handleTopUp = async (identity: CallIdentity, { loading }: SubmitLoadingProps) => {
    if (loading) return;

    onClose();
    setValues(defaultValues);

    const loadingTipKey = openTip(
      t("wallet.xtc.top.up", { amount: values.amount, canisterId: values.canisterId }),
      TIP_LOADING,
    );

    const { status, message } = await XTCTopUp({
      identity,
      canisterId: values.canisterId,
      amount: BigInt(numberToString(formatTokenAmount(values.amount, XTC.decimals).minus(Number(XTC.transFee)))),
    });

    closeTip(loadingTipKey);

    if (status === ResultStatus.OK) {
      openTip(t`Top-up successfully`, TIP_SUCCESS);
      if (onTopUpSuccess) onTopUpSuccess();
    } else {
      openTip(getLocaleMessage(message) ?? message, TIP_ERROR);
    }
  };

  const handleMax = () => {
    if (balance) {
      setValues((prevState) => ({
        ...prevState,
        amount: parseTokenAmount(balance, XTC.decimals).toNumber(),
      }));
    }
  };

  let errorMessage = "";
  if (
    values.amount &&
    XTC &&
    new BigNumber(Number(values.amount)).isGreaterThan(parseTokenAmount(balance ?? 0, XTC.decimals))
  )
    errorMessage = t("common.error.insufficient.balance");
  if (!values.amount) errorMessage = t`Enter top-up XTC amount`;
  if (values.canisterId && !isValidPrincipal(values.canisterId)) errorMessage = t("common.error.invalid.canister.id");
  if (!values.canisterId) errorMessage = t("xtc.enter.canister");

  return (
    <Modal open={open} title={t("wallet.topUp.xtc")} onClose={onClose}>
      <Box>
        <TextField
          fullWidth
          label={t("common.canister.id")}
          onChange={(event) => onFieldChange(event.target.value, "canisterId")}
          placeholder={t`Enter a canister ID`}
        />
      </Box>

      <Box mt="20px">
        <NumberTextField
          fullWidth
          label={t("common.amount")}
          value={values.amount}
          onChange={(event) => onFieldChange(event.target.value, "amount")}
          placeholder={t("xtc.topUp.enter.amount")}
          numericProps={{
            thousandSeparator: true,
            allowNegative: false,
            decimalScale: 4,
            maxLength: 16,
          }}
        />
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
        <Identity onSubmit={handleTopUp}>
          {({ submit }: CallbackProps) => (
            <Button size="large" fullWidth variant="contained" onClick={submit} disabled={!!errorMessage}>
              {errorMessage || t("common.submit")}
            </Button>
          )}
        </Identity>
      </Box>
    </Modal>
  );
}
