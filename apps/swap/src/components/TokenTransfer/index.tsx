import React, { useState, useContext, useMemo } from "react";
import { Button, Grid, TextField, Typography, Box, InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  parseTokenAmount,
  formatTokenAmount,
  isValidAccount,
  isValidPrincipal,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { WRAPPED_ICP, ICP } from "constants/tokens";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { tokenTransfer } from "hooks/token/calls";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { getLocaleMessage } from "locales/services";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { Identity as CallIdentity } from "types/index";
import { useAccountPrincipalString, useAccount, useAccountPrincipal } from "store/auth/hooks";
import WalletContext from "components/Wallet/context";
import { Modal, NumberTextField } from "components/index";
import { Principal } from "@dfinity/principal";
import MaxButton from "components/MaxButton";
import { useUSDPriceById } from "hooks/useUSDPrice";

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

function usePrincipalStandard(tokenId: string, standard: string) {
  return (standard.includes("DIP20") || standard.includes("ICRC")) && tokenId !== ICP.address;
}

function useAccountStandard(tokenId: string, standard: string) {
  return !usePrincipalStandard(tokenId, standard);
}

export interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  onTransferSuccess?: () => void;
  token: TokenInfo;
  transferTo?: string;
}

export default function TransferModal({ open, onClose, onTransferSuccess, token, transferTo }: TransferModalProps) {
  const classes = useStyles();
  const account = useAccount();
  const principalString = useAccountPrincipalString();
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();

  const { refreshTotalBalance, setRefreshTotalBalance } = useContext(WalletContext);

  const { result: balance } = useTokenBalance(token.canisterId, principal);
  const tokenUSDPrice = useUSDPriceById(token.canisterId);

  const initialValues = {
    to: transferTo ?? "",
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

    if (usePrincipalStandard(token.canisterId, token.standardType)) {
      try {
        Principal.fromText(values.to);
      } catch (error) {
        return t`Invalid principal ID`;
      }
    } else if (!isValidAccount(values.to) && !isValidPrincipal(values.to)) return t`Invalid account ID or principal ID`;

    if (!values.amount) return t`Enter an amount`;
    if (
      values.amount &&
      new BigNumber(values.amount ?? 0).isGreaterThan(parseTokenAmount(balance ?? 0, token.decimals))
    )
      return t`Insufficient balance`;
    if (!new BigNumber(values.amount).minus(parseTokenAmount(token.transFee, token.decimals)).isGreaterThan(0))
      return t`Must be greater than trans fee`;

    return undefined;
  };

  const handleSubmit = async (identity: CallIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    try {
      if (loading || !account) return;

      const { status, message } = await tokenTransfer({
        canisterId: token.canisterId.toString(),
        to: values.to,
        amount: formatTokenAmount(
          new BigNumber(values.amount).minus(parseTokenAmount(token.transFee, token.decimals)),
          token.decimals,
        ),
        identity,
        from: account,
        fee: token.transFee,
        decimals: token.decimals,
      });

      if (status === "ok") {
        openSuccessTip(t`Transferred successfully`);
        setValues(initialValues);
        if (onTransferSuccess) onTransferSuccess();
        if (token.canisterId.toString() === ICP.address || token.canisterId.toString() === WRAPPED_ICP.address) {
          if (setRefreshTotalBalance) setRefreshTotalBalance(!refreshTotalBalance);
        }
      } else {
        openErrorTip(getLocaleMessage(message) ?? t`Failed to transfer`);
      }

      closeLoading();
    } catch (error) {
      console.error(error);
      closeLoading();
    }
  };

  const actualTransferAmount = useMemo(() => {
    const amount = new BigNumber(values.amount ?? 0).minus(parseTokenAmount(token.transFee, token.decimals));
    return amount.isGreaterThan(0) ? amount.toString() : 0;
  }, [values, token]);

  const addressHelpText = () => {
    if (
      (usePrincipalStandard(token.canisterId, token.standardType) && principalString === values.to) ||
      (useAccountStandard(token.canisterId, token.standardType) && account === values.to) ||
      (useAccountStandard(token.canisterId, token.standardType) &&
        isValidPrincipal(values.to) &&
        principalString === values.to)
    ) {
      return (
        <span className={classes.warningText}>
          <Trans>Be careful, you are transferring tokens to your own address!</Trans>
        </span>
      );
    }
  };

  const errorMessage = getErrorMessage();

  const handleMax = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();

    if (balance) {
      handleFieldChange(parseTokenAmount(balance, token.decimals).toString(), "amount");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t`Transfer`}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
        <TextField label={t`Token Symbol`} value={token.symbol} fullWidth disabled />
        <TextField
          label={t`To`}
          value={values.to}
          placeholder={
            usePrincipalStandard(token.canisterId, token.standardType)
              ? t`Enter the principal ID`
              : t`Enter the account ID or principal ID`
          }
          onChange={({ target: { value } }) => handleFieldChange(value, "to")}
          helperText={addressHelpText()}
          fullWidth
          autoComplete="To"
          multiline
        />

        <NumberTextField
          label={t`Amount`}
          type="text"
          value={values.amount}
          onChange={({ target: { value } }) => handleFieldChange(value, "amount")}
          fullWidth
          numericProps={{
            allowNegative: false,
            decimalScale: token.decimals,
          }}
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography color="text.primary">
                  {tokenUSDPrice && values.amount
                    ? `~$${toSignificantWithGroupSeparator(
                        new BigNumber(values.amount).multipliedBy(tokenUSDPrice).toString(),
                        4,
                      )}`
                    : "--"}
                </Typography>
              </InputAdornment>
            ),
          }}
        />

        <Grid container alignItems="center">
          <Typography>
            <Trans>
              Balance:{" "}
              {`${
                balance
                  ? new BigNumber(
                      parseTokenAmount(balance, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
                    ).toFormat()
                  : "--"
              }`}
            </Trans>
          </Typography>
          <MaxButton
            sx={{
              marginLeft: "6px",
            }}
            onClick={handleMax}
          />
        </Grid>
        <Typography>
          <Trans>Fee:</Trans> {parseTokenAmount(token?.transFee?.toString(), token.decimals).toFormat()}
          &nbsp;{token.symbol}&nbsp;(
          {tokenUSDPrice && token
            ? `$${toSignificantWithGroupSeparator(
                parseTokenAmount(token.transFee.toString(), token.decimals).multipliedBy(tokenUSDPrice).toString(),
                4,
              )}`
            : "--"}
          )
        </Typography>
        <Typography>
          <Trans>Actually:</Trans> {toSignificantWithGroupSeparator(actualTransferAmount, 18)}
          &nbsp;{token.symbol}&nbsp;(
          {tokenUSDPrice && token
            ? `$${toSignificantWithGroupSeparator(
                new BigNumber(actualTransferAmount).multipliedBy(tokenUSDPrice).toString(),
                4,
              )}`
            : "--"}
          )
        </Typography>
        <Typography color="text.warning">
          <Trans>Please ensure that the receiving address supports this Token/NFT!</Trans>
        </Typography>
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
              {errorMessage || (!loading ? <Trans>Confirm</Trans> : <CircularProgress size={26} color="inherit" />)}
            </Button>
          )}
        </Identity>
      </Box>
    </Modal>
  );
}
