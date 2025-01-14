import { useState } from "react";
import { Trans, t } from "@lingui/macro";
import { FilledTextField, Modal, TextFieldNumberComponent, MaxButton } from "components/index";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";
import { XTC } from "constants/tokens";
import { parseTokenAmount, formatTokenAmount, numberToString, isValidPrincipal, BigNumber } from "@icpswap/utils";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Identity as CallIdentity } from "types/global";
import { useTips, TIP_LOADING, TIP_SUCCESS, TIP_ERROR } from "hooks/useTips";
import { useXTCTopUp } from "hooks/token/dip20";
import { getLocaleMessage } from "locales/services";
import { ResultStatus } from "constants/index";

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
  const principal = useAccountPrincipal();
  const { result: balance, loading } = useTokenBalance(XTC.address, principal);

  const defaultValues = {
    canisterId: "",
    amount: "",
  };

  const [values, setValues] = useState<Values>(defaultValues);
  const [openTip, closeTip] = useTips();

  const onFieldChange = (value: any, field: string) => {
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

    const loadingTipKey = openTip(t`Top-up ${values.amount} XTC to canister ${values.canisterId}`, TIP_LOADING);

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
    errorMessage = t`Insufficient balance`;
  if (!values.amount) errorMessage = t`Enter top-up XTC amount`;
  if (values.canisterId && !isValidPrincipal(values.canisterId)) errorMessage = t`Invalid canister id`;
  if (!values.canisterId) errorMessage = t`Enter top-up canister id`;

  return (
    <Modal open={open} title={t`Top-up a Canister by XTC`} onClose={onClose}>
      <Box>
        <FilledTextField
          label={<Trans>Canister ID</Trans>}
          onChange={(value) => onFieldChange(value, "canisterId")}
          placeholder={t`Enter a canister ID`}
        />
      </Box>

      <Box mt="20px">
        <FilledTextField
          label={<Trans>Amount</Trans>}
          value={values.amount}
          onChange={(value) => onFieldChange(value, "amount")}
          InputProps={{
            inputComponent: TextFieldNumberComponent,
            inputProps: {
              allowNegative: false,
              decimalScale: 4,
              maxLength: 16,
            },
          }}
          placeholder={t`Enter top-up amount`}
        />
      </Box>

      <Grid container alignItems="center" mt="12px">
        <Typography color="text.primary" component="span">
          <Trans>Balance:</Trans>
        </Typography>
        &nbsp;
        <Typography color="text.primary" component="span" sx={{ marginRight: "4px" }}>
          {balance ? parseTokenAmount(balance, XTC?.decimals).toFormat() : loading ? "--" : 0}
        </Typography>
        <MaxButton onClick={handleMax} />
      </Grid>

      <Grid container alignItems="center" mt="12px">
        <Typography color="text.primary" component="span">
          <Trans>Fee:</Trans>
        </Typography>
        &nbsp;
        <Typography color="text.primary" component="span">
          {XTC ? parseTokenAmount(XTC.transFee, XTC?.decimals).toFormat() : 0}
        </Typography>
      </Grid>

      <Box mt="40px">
        <Identity onSubmit={handleTopUp}>
          {({ submit }: CallbackProps) => (
            <Button size="large" fullWidth variant="contained" onClick={submit} disabled={!!errorMessage}>
              {errorMessage || <Trans>Submit</Trans>}
            </Button>
          )}
        </Identity>
      </Box>
    </Modal>
  );
}
