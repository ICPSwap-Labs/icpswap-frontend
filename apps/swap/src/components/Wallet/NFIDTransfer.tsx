import { useState, useContext } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { parseTokenAmount, isValidAccount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { ICP } from "@icpswap/tokens";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { getLocaleMessage } from "locales/services";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { Identity as CallIdentity } from "types/index";
import { useAccountPrincipalString, useAccount } from "store/auth/hooks";
import WalletContext from "components/Wallet/context";
import { Modal, NumberTextField } from "components/index";
import { Principal } from "@dfinity/principal";
import { NFIDRequestTransfer } from "utils/connector/NF_ID";

const useStyles = makeStyles((theme: Theme) => {
  return {
    warningText: {
      color: theme.palette.warning.dark,
    },
  };
});

export type Values = {
  to: string;
  amount: string;
};

export default function NFIDTransferModal({
  open,
  onClose,
  onTransferSuccess,
  token,
}: {
  open: boolean;
  onClose: () => void;
  onTransferSuccess?: () => void;
  token: TokenInfo;
}) {
  const classes = useStyles();
  const account = useAccount();
  const principalString = useAccountPrincipalString();
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();

  const { refreshTotalBalance, setRefreshTotalBalance } = useContext(WalletContext);

  const initialValues = {
    to: "",
    amount: "",
  };

  const [values, setValues] = useState<Values>(initialValues);

  const handleFieldChange = (value: string, field: string) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const getErrorMessage = () => {
    if (!values.to) return t`Enter transfer to`;

    if (token.standardType.includes("DIP20")) {
      try {
        Principal.fromText(values.to);
      } catch (error) {
        return t`Invalid principal ID`;
      }
    } else if (!isValidAccount(values.to)) return t`Invalid account ID`;

    if (!values.amount) return t`Enter an amount`;
    if (!new BigNumber(values.amount).minus(parseTokenAmount(token.transFee, token.decimals)).isGreaterThan(0))
      return t`Must be greater than trans fee`;
  };

  const handleSubmit = async (identity: CallIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    try {
      if (loading) return;

      const result = await NFIDRequestTransfer({
        to: values.to,
        amount: Number(new BigNumber(values.amount).toFixed(8, BigNumber.ROUND_DOWN)),
      });

      if (result.status === "SUCCESS") {
        openSuccessTip(t`Transferred successfully`);
        setValues(initialValues);
        if (onTransferSuccess) onTransferSuccess();
        if (token.canisterId.toString() === ICP.address) {
          if (setRefreshTotalBalance) setRefreshTotalBalance(!refreshTotalBalance);
        }
      }

      if (result.status === "REJECTED" || result.status === "ERROR") {
        openErrorTip(getLocaleMessage(result.message) ?? t`Failed to transfer`);
      }

      closeLoading();
    } catch (error) {
      console.error(error);
      closeLoading();
    }
  };

  const balanceActuallyToAccount = () => {
    const amount = new BigNumber(values.amount ?? 0).minus(parseTokenAmount(token.transFee, token.decimals));
    return amount.isGreaterThan(0) ? amount.toFormat() : 0;
  };

  const addressHelpText = () => {
    if (
      (token.standardType.includes("DIP20") && principalString === values.to) ||
      (!token.standardType.includes("DIP20") && account === values.to)
    ) {
      return (
        <span className={classes.warningText}>
          <Trans>Be careful, you are transferring tokens to your own address!</Trans>
        </span>
      );
    }
  };

  const errorMessage = getErrorMessage();

  return (
    <Modal open={open} onClose={onClose} title={t`NFID Transfer`}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField label={t`Token Symbol`} value={token.symbol} fullWidth disabled />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t`To`}
            value={values.to}
            placeholder={token.standardType.includes("DIP20") ? t`Enter the principal ID` : "Enter the account ID"}
            onChange={({ target: { value } }) => handleFieldChange(value, "to")}
            helperText={addressHelpText()}
            fullWidth
            autoComplete="To"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberTextField
            label={t`Amount`}
            type="text"
            value={values.amount}
            onChange={({ target: { value } }) => handleFieldChange(value, "amount")}
            fullWidth
            inputProps={{
              autocomplete: "new-password",
              form: {
                autocomplete: "off",
              },
            }}
            numericProps={{
              allowNegative: false,
              decimalScale: token.decimals,
            }}
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <Trans>Fee:</Trans> {parseTokenAmount(token?.transFee?.toString(), token.decimals).toFormat()}
            &nbsp;{token.symbol}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <Trans>Actually:</Trans> {balanceActuallyToAccount()}
            &nbsp;{token.symbol}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.danger">
            <Trans>Please ensure that the receiving address supports this Token/NFT!</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Identity onSubmit={handleSubmit} fullScreenLoading>
            {({ submit, loading }: CallbackProps) => (
              <Button
                variant="contained"
                fullWidth
                color="primary"
                size="large"
                disabled={loading || !!errorMessage}
                onClick={submit}
              >
                {errorMessage ||
                  (!loading ? <Trans>Approve by NFID</Trans> : <CircularProgress size={26} color="inherit" />)}
              </Button>
            )}
          </Identity>
        </Grid>
      </Grid>
    </Modal>
  );
}
