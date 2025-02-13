import React, { useState, useContext, useMemo } from "react";
import { Button, Typography, Box, InputAdornment, makeStyles, Theme, CircularProgress } from "components/Mui";
import {
  parseTokenAmount,
  formatTokenAmount,
  isValidAccount,
  isValidPrincipal,
  toSignificantWithGroupSeparator,
  BigNumber,
} from "@icpswap/utils";
import { MessageTypes, useFullscreenLoading, useTips } from "hooks/useTips";
import { tokenTransfer } from "hooks/token/calls";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { getLocaleMessage } from "i18n/service";
import { useAccountPrincipalString, useAccount, useAccountPrincipal } from "store/auth/hooks";
import WalletContext from "components/Wallet/context";
import { Modal, FilledTextField, NumberFilledTextField } from "components/index";
import { Principal } from "@dfinity/principal";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { ICP, WRAPPED_ICP } from "@icpswap/tokens";
import { MaxButton, Flex } from "@icpswap/ui";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

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
  token: Token;
  transferTo?: string;
}

export function TokenTransferModal({ open, onClose, onTransferSuccess, token, transferTo }: TransferModalProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const account = useAccount();
  const principalString = useAccountPrincipalString();
  const principal = useAccountPrincipal();
  const [openTip] = useTips();
  const [openFullLoading, closeFullLoading] = useFullscreenLoading();

  const { refreshTotalBalance, setRefreshTotalBalance } = useContext(WalletContext);

  const { result: balance } = useTokenBalance(token.address, principal);
  const tokenUSDPrice = useUSDPriceById(token.address);

  const [loading, setLoading] = useState(false);

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

    if (usePrincipalStandard(token.address, token.standard)) {
      try {
        Principal.fromText(values.to);
      } catch (error) {
        return t`Invalid principal ID`;
      }
    } else if (!isValidAccount(values.to) && !isValidPrincipal(values.to)) return t`Invalid account ID or principal ID`;

    if (!values.amount) return t("common.error.input.amount");
    if (
      values.amount &&
      new BigNumber(values.amount ?? 0).isGreaterThan(parseTokenAmount(balance ?? 0, token.decimals))
    )
      return t`t("common.error.insufficient.balance");`;
    if (!new BigNumber(values.amount).minus(parseTokenAmount(token.transFee, token.decimals)).isGreaterThan(0))
      return t`Must be greater than trans fee`;

    return undefined;
  };

  const handleSubmit = async () => {
    try {
      if (!account) return;

      openFullLoading();
      setLoading(true);

      const { status, message } = await tokenTransfer({
        canisterId: token.address.toString(),
        to: values.to,
        amount: formatTokenAmount(
          new BigNumber(values.amount).minus(parseTokenAmount(token.transFee, token.decimals)),
          token.decimals,
        ),
        from: account,
        fee: token.transFee,
        decimals: token.decimals,
      });

      if (status === "ok") {
        openTip(t`Transferred successfully`, MessageTypes.success);
        setValues(initialValues);
        if (onTransferSuccess) onTransferSuccess();
        if (token.address.toString() === ICP.address || token.address.toString() === WRAPPED_ICP.address) {
          if (setRefreshTotalBalance) setRefreshTotalBalance(!refreshTotalBalance);
        }
      } else {
        openTip(getLocaleMessage(message) ?? t`Failed to transfer`, MessageTypes.error);
      }
    } catch (error) {
      console.error(error);
    }

    closeFullLoading();
    setLoading(false);
  };

  const actualTransferAmount = useMemo(() => {
    const amount = new BigNumber(values.amount ?? 0).minus(parseTokenAmount(token.transFee, token.decimals));
    return amount.isGreaterThan(0) ? amount.toString() : 0;
  }, [values, token]);

  const addressHelpText = () => {
    if (
      (usePrincipalStandard(token.address, token.standard) && principalString === values.to) ||
      (useAccountStandard(token.address, token.standard) && account === values.to) ||
      (useAccountStandard(token.address, token.standard) &&
        isValidPrincipal(values.to) &&
        principalString === values.to)
    ) {
      return <span className={classes.warningText}>{t("common.warning.transfer")}</span>;
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
        <FilledTextField value={token.symbol} fullWidth disabled />
        <FilledTextField
          value={values.to}
          placeholder={
            usePrincipalStandard(token.address, token.standard)
              ? t`Enter the principal ID`
              : t`Enter the account ID or principal ID`
          }
          onChange={(value: string) => handleFieldChange(value, "to")}
          helperText={addressHelpText()}
          fullWidth
          autoComplete="To"
          multiline
        />

        <NumberFilledTextField
          placeholder="Enter the amount"
          value={values.amount}
          onChange={(value: string) => handleFieldChange(value, "amount")}
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

        <Flex fullWidth gap="0 6px">
          <Typography>
            {t("common.balance.colon.amount", {
              amount: `${
                balance
                  ? new BigNumber(
                      parseTokenAmount(balance, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
                    ).toFormat()
                  : "--"
              }`,
            })}
          </Typography>

          <MaxButton onClick={handleMax} />
        </Flex>

        <Typography>
          {t("common.fee.colon.amount", {
            amount: `${parseTokenAmount(token?.transFee?.toString(), token.decimals).toFormat()} ${token.symbol} (
          ${
            tokenUSDPrice && token
              ? `$${toSignificantWithGroupSeparator(
                  parseTokenAmount(token.transFee.toString(), token.decimals).multipliedBy(tokenUSDPrice).toString(),
                  4,
                )}`
              : "--"
          }
          )`,
          })}
        </Typography>
        <Typography>
          {t("wallet.token.transfer.actually.colon", {
            amount: `${toSignificantWithGroupSeparator(actualTransferAmount, 18)} ${token.symbol} ${
              tokenUSDPrice && token
                ? `$${toSignificantWithGroupSeparator(
                    new BigNumber(actualTransferAmount).multipliedBy(tokenUSDPrice).toString(),
                    4,
                  )}`
                : "--"
            }`,
          })}
        </Typography>
        <Typography color="text.danger">{t("common.warning.transfer.address.supports")}</Typography>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          size="large"
          disabled={loading || !!errorMessage}
          onClick={handleSubmit}
        >
          {errorMessage || (!loading ? t("common.confirm") : <CircularProgress size={26} color="inherit" />)}
        </Button>
      </Box>
    </Modal>
  );
}
