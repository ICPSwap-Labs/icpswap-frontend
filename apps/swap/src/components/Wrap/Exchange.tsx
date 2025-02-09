import { useState, useCallback, useMemo, useContext, useEffect } from "react";
import { Grid, Box, Typography, makeStyles, Theme } from "components/Mui";
import { SwapInput } from "components/swap/SwapInput";
import { SWAP_FIELD, WRAPPED_ICP as WICP } from "constants/index";
import { formatCurrencyAmount } from "utils/swap/formatCurrencyAmount";
import { useTips, TIP_LOADING, TIP_SUCCESS, TIP_ERROR } from "hooks/useTips";
import { useDebouncedChangeHandler, useParsedQueryString } from "@icpswap/hooks";
import { CurrencySelectorButton } from "components/CurrencySelector/button";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { CurrencyAmount } from "@icpswap/swap-sdk";
import { formatDollarAmount, BigNumber, formatTokenAmount, parseTokenAmount, principalToAccount } from "@icpswap/utils";
import ConfirmModal from "components/Wrap/ConfirmModal";
import { wrapICP, unwrapICP } from "hooks/useWICPCalls";
import { tokenTransfer } from "hooks/token/calls";
import { getLocaleMessage } from "i18n/service";
import Identity, { CallbackProps } from "components/Identity";
import WrapContext from "components/Wrap/context";
import { AuthButton } from "components/index";
import { WICPCanisterId } from "constants/canister";
import { useICPPrice } from "hooks/useUSDPrice";
import { StatusResult } from "@icpswap/types";
import { ICP } from "@icpswap/tokens";
import { Image } from "@icpswap/ui";
import { Principal } from "@dfinity/principal";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => {
  return {
    maxButton: {
      padding: "1px 3px",
      cursor: "pointer",
      borderRadius: "2px",
      backgroundColor: theme.colors.secondaryMain,
      color: "#ffffff",
      marginLeft: "4px",
    },
    inputBox: {
      backgroundColor: theme.palette.background.level3,
      borderRadius: "16px",
      padding: "16px",
      [theme.breakpoints.down("sm")]: {
        padding: "16px 12px",
      },
    },
    switchIcon: {
      cursor: "pointer",
    },
  };
});

export default function Exchange() {
  const { t } = useTranslation();
  const classes = useStyles();
  const principal = useAccountPrincipalString();
  const { retryTrigger, setRetryTrigger } = useContext(WrapContext);

  const { input } = useParsedQueryString() as { input: string };

  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const [values, setValues] = useState<{
    independentField: SWAP_FIELD;
    typedValue: string;
  }>({
    independentField: SWAP_FIELD.INPUT,
    typedValue: "",
  });

  const [inputCurrency, setInputCurrency] = useState(ICP);
  const [outputCurrency, setOutputCurrency] = useState(WICP);

  const ICPPrice = useICPPrice();

  const { result: _ICPBalance } = useTokenBalance(ICP.address, principal, retryTrigger);
  const { result: WICPBalance } = useTokenBalance(WICP.address, principal, retryTrigger);

  const ICPBalance = (_ICPBalance ?? new BigNumber(0)).toString();
  const isWrap = inputCurrency.equals(ICP);

  const _inputCurrencyBalance = isWrap ? ICPBalance : String(WICPBalance ?? 0);
  const _outputCurrencyBalance = isWrap ? String(WICPBalance ?? 0) : ICPBalance;
  const inputCurrencyBalance = CurrencyAmount.fromRawAmount(inputCurrency, _inputCurrencyBalance ?? 0);
  const outputCurrencyBalance = CurrencyAmount.fromRawAmount(outputCurrency, _outputCurrencyBalance ?? 0);

  useEffect(() => {
    if (input === "icp") {
      setInputCurrency(ICP);
      setOutputCurrency(WICP);
    } else {
      setInputCurrency(WICP);
      setOutputCurrency(ICP);
    }
  }, [input]);

  const onSwitchTokens = () => {
    if (isWrap) {
      setInputCurrency(WICP);
      setOutputCurrency(ICP);
    } else {
      setInputCurrency(ICP);
      setOutputCurrency(WICP);
    }
  };

  const currencyBalances = {
    [SWAP_FIELD.INPUT]: inputCurrencyBalance,
    [SWAP_FIELD.OUTPUT]: outputCurrencyBalance,
  };

  const ICPFee = parseTokenAmount(ICP.transFee, ICP.decimals);

  const { independentField, typedValue } = values;

  const dependentField = independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT;

  const typedValueMinFee = new BigNumber(typedValue).minus(ICPFee);

  const exchangeValue = typedValue ? (typedValueMinFee.isGreaterThan(0) ? typedValueMinFee.toNumber() : 0) : null;

  const dependentAmount = exchangeValue;

  const parsedAmounts = useMemo(
    () => ({
      [SWAP_FIELD.INPUT]: independentField === SWAP_FIELD.INPUT ? typedValue : dependentAmount,
      [SWAP_FIELD.OUTPUT]: independentField === SWAP_FIELD.OUTPUT ? typedValue : dependentAmount,
    }),
    [independentField, typedValue],
  );

  // @ts-ignore
  const formattedAmounts: { [SWAP_FIELD.INPUT]: number | string; [SWAP_FIELD.OUTPUT]: number | string } = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField] ?? "",
  };

  const handleExchange = () => {
    setConfirmModalShow(true);
  };

  const handleTypeInput = useCallback(
    (value) => {
      setValues({
        independentField: SWAP_FIELD.INPUT,
        typedValue: value,
      });
    },
    [setValues],
  );

  const handleTypeOutput = useCallback(
    (value) => {
      setValues({
        independentField: SWAP_FIELD.OUTPUT,
        typedValue: value,
      });
    },
    [setValues],
  );

  const [, debouncedTypeInput] = useDebouncedChangeHandler(typedValue, handleTypeInput, 1000);
  const [, debouncedTypeOutput] = useDebouncedChangeHandler(typedValue, handleTypeOutput, 1000);

  const maxInputAmount = currencyBalances[SWAP_FIELD.INPUT];
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0));

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) handleTypeInput(maxInputAmount.toExact());
  }, [maxInputAmount, handleTypeInput]);

  const [openTip, closeTip] = useTips();

  const handleExchangeConfirm = useCallback(
    async (identity, { loading, closeLoading }) => {
      if (loading || !principal) return;

      setConfirmModalShow(false);

      debouncedTypeInput("");

      const loadingKey = openTip(
        isWrap
          ? t("wrap.wrapping", {
              fromAmount: formattedAmounts[SWAP_FIELD.INPUT],
              toAmount: formattedAmounts[SWAP_FIELD.OUTPUT],
            })
          : t("wrap.unwrapping", {
              fromAmount: formattedAmounts[SWAP_FIELD.INPUT],
              toAmount: formattedAmounts[SWAP_FIELD.OUTPUT],
            }),
        TIP_LOADING,
      );

      let result: StatusResult<boolean> | null = null;

      if (isWrap) {
        const WICPAccount = principalToAccount(WICPCanisterId);

        const { status, data, message } = await tokenTransfer({
          canisterId: ICP.address,
          to: WICPAccount,
          amount: formatTokenAmount(new BigNumber(formattedAmounts[SWAP_FIELD.INPUT]).minus(ICPFee), ICP.decimals),
          from: principal,
          decimals: ICP.decimals,
        });

        if (status === "err" || !data) {
          closeTip(loadingKey);
          openTip(message, TIP_ERROR);
          closeLoading();
          return;
        }

        result = await wrapICP(identity, {
          to: { principal: Principal.fromText(principal) },
          blockHeight: data,
        });
      } else {
        result = await unwrapICP(identity, {
          to: { principal: Principal.fromText(principal) },
          amount: BigInt(formatTokenAmount(typedValue, ICP.decimals).toString()),
        });
      }

      const { status, message } = result;

      closeTip(loadingKey);

      if (status === "ok") {
        openTip(isWrap ? t`Wrapped successfully` : t`Unwrapped Successfully`, TIP_SUCCESS);
        debouncedTypeInput("");
        setRetryTrigger(!retryTrigger);
      } else {
        openTip(getLocaleMessage(message) ?? t`Failed to unwrap`, TIP_ERROR);
      }

      closeLoading();
    },
    [formattedAmounts, principal],
  );

  const errorMessage = useMemo(() => {
    let errorMessage = "";
    if (
      inputCurrencyBalance &&
      parsedAmounts[SWAP_FIELD.INPUT] &&
      new BigNumber(parsedAmounts[SWAP_FIELD.INPUT]).isGreaterThan(inputCurrencyBalance.toExact())
    )
      errorMessage = t("common.error.insufficient.balance");
    if (
      (inputCurrency.equals(WICP) &&
        parsedAmounts[SWAP_FIELD.INPUT] &&
        !new BigNumber(parsedAmounts[SWAP_FIELD.INPUT]).isGreaterThan(0.0001)) ||
      (outputCurrency.equals(WICP) &&
        independentField === SWAP_FIELD.OUTPUT &&
        !new BigNumber(parsedAmounts[SWAP_FIELD.OUTPUT] ?? 0).isGreaterThan(0.0001))
    )
      errorMessage = t("common.error.amount.greater.than", { amount: "0.0001" });
    if (inputCurrency.equals(ICP) && !typedValueMinFee.isGreaterThan(0))
      errorMessage = t("common.error.amount.greater.than", { amount: "0.0001" });
    if (!typedValue) errorMessage = t("common.error.input.amount");

    return errorMessage;
  }, [
    typedValue,
    parsedAmounts,
    independentField,
    inputCurrency,
    typedValueMinFee,
    outputCurrency,
    inputCurrencyBalance,
  ]);

  const inputBalanceUSDValue = useMemo(() => {
    if (!formattedAmounts[SWAP_FIELD.INPUT] || !ICPPrice) return undefined;
    return new BigNumber(formattedAmounts[SWAP_FIELD.INPUT]).multipliedBy(ICPPrice).toNumber();
  }, [formattedAmounts, ICPPrice]);

  const outputBalanceUSDValue = useMemo(() => {
    if (!formattedAmounts[SWAP_FIELD.OUTPUT] || !ICPPrice) return undefined;
    return new BigNumber(formattedAmounts[SWAP_FIELD.OUTPUT]).multipliedBy(ICPPrice).toNumber();
  }, [formattedAmounts, ICPPrice]);

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Box className={classes.inputBox}>
          <Grid container>
            <Box>
              <Grid container alignItems="center">
                <Grid mr={1}>
                  <CurrencySelectorButton currency={inputCurrency} bgGray disabled />
                </Grid>
              </Grid>
            </Box>
            <Grid item xs container alignItems="center">
              <SwapInput
                value={formattedAmounts[SWAP_FIELD.INPUT]}
                token={inputCurrency}
                onUserInput={debouncedTypeInput}
              />
            </Grid>
          </Grid>

          {inputCurrencyBalance ? (
            <Grid container alignItems="center" mt="12px">
              <Typography>
                {t("common.balance.colon.amount", {
                  amount: inputCurrencyBalance ? formatCurrencyAmount(inputCurrencyBalance, 4) : "--",
                })}
              </Typography>

              {showMaxButton && (
                <Typography fontSize="12px" className={classes.maxButton} onClick={handleMaxInput}>
                  {t("common.max.upper")}
                </Typography>
              )}

              {inputBalanceUSDValue ? (
                <Grid item xs>
                  <Grid container alignItems="center" justifyContent="flex-end">
                    <Typography>~{formatDollarAmount(inputBalanceUSDValue)}</Typography>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          ) : null}
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "-17px",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "30px",
            height: "31px",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={onSwitchTokens}
        >
          <Image src="/images/icon_exchange.svg" sx={{ width: "28px", height: "28px" }} />
        </Box>
      </Box>

      <Box sx={{ marginTop: "8px" }}>
        <Box className={classes.inputBox}>
          <Grid container>
            <Box>
              <Grid container alignItems="center">
                <Grid mr={1}>
                  <CurrencySelectorButton currency={outputCurrency} bgGray disabled />
                </Grid>
              </Grid>
            </Box>
            <Grid item xs container alignItems="center">
              <SwapInput
                value={formattedAmounts[SWAP_FIELD.OUTPUT]}
                token={outputCurrency}
                onUserInput={debouncedTypeOutput}
              />
            </Grid>
          </Grid>

          {outputCurrencyBalance ? (
            <Grid container mt="12px">
              <Typography>
                {t("common.balance.colon.amount", {
                  amount: outputCurrencyBalance ? formatCurrencyAmount(outputCurrencyBalance, 4) : "--",
                })}
              </Typography>

              {outputBalanceUSDValue ? (
                <Grid item xs>
                  <Grid container alignItems="center" justifyContent="flex-end">
                    <Typography>~{formatDollarAmount(outputBalanceUSDValue)}</Typography>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          ) : null}
        </Box>
      </Box>
      <Box mt="5px">
        <Typography align="right">
          Fee: {parseTokenAmount(ICP.transFee, ICP.decimals).toFormat()} {ICP.symbol}
        </Typography>
      </Box>
      <Box mt={4}>
        <AuthButton fullWidth variant="contained" size="large" onClick={handleExchange} disabled={!!errorMessage}>
          {errorMessage || (isWrap ? t("common.wrap") : t("common.unwrap"))}
        </AuthButton>
      </Box>
      {confirmModalShow && (
        <Identity onSubmit={handleExchangeConfirm}>
          {({ submit, loading }: CallbackProps) => (
            <ConfirmModal
              inputCurrency={inputCurrency}
              outputCurrency={outputCurrency}
              formattedAmounts={formattedAmounts}
              open={confirmModalShow}
              onClose={() => {
                if (!loading) setConfirmModalShow(false);
              }}
              onConfirm={submit}
              loading={loading}
              isWrap={isWrap}
            />
          )}
        </Identity>
      )}
    </>
  );
}
