import { useState, useCallback, useMemo, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SwitchIcon from "assets/images/swap/switch";
import CurrencySelector from "components/CurrencySelector";
import SwapInput from "./SwapInput";
import ConfirmModal from "./ConfirmModal";
import { useSwapState, useSwapHandlers, useSwapInfo, useCleanSwapState } from "store/swap/hooks";
import BigNumber from "bignumber.js";
import { formatDollarAmount, toSignificant, isNullArgs } from "@icpswap/utils";
import { SWAP_FIELD } from "constants/swap";
import { useExpertModeManager } from "store/swap/cache/hooks";
import { TradeState } from "hooks/swap/useTrade";
import { formatCurrencyAmount } from "utils/swap/formatCurrencyAmount";
import { maxAmountFormat } from "utils/swap/index";
import { useSwapCallback } from "hooks/swap/useSwapCallback";
import { ExternalTipArgs } from "types/index";
import { useSuccessTip, useLoadingTip, useErrorTip } from "hooks/useTips";
import { warningSeverity } from "utils/swap/prices";
import { useUSDPrice } from "hooks/useUSDPrice";
import TradePrice from "components/swap/TradePrice";
import { UseCurrencyState } from "hooks/useCurrency";
import { Trans, t } from "@lingui/macro";
import { ICP } from "constants/index";
import Identity, { CallbackProps } from "components/Identity";
import { Theme } from "@mui/material/styles";
import Button from "components/authentication/ButtonConnector";
import { useLoadDefaultParams } from "store/swap/hooks";
import { MainCard } from "components/index";
import { toFormat } from "utils/index";
import StepViewButton from "components/Steps/View";
import { TokenInfo } from "types/token";
import { ReclaimTips } from "components/ReclaimTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import { useUserUnusedBalance, useTokenBalance } from "@icpswap/hooks";
import { useMaxAmountSpend } from "hooks/swap/useMaxAmountSpend";

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
      border: `1px solid ${theme.palette.background.level4}`,
      borderRadius: "16px",
      padding: "16px",
      [theme.breakpoints.down("sm")]: {
        padding: "16px 12px",
      },
    },
  };
});

export default function Swap() {
  const classes = useStyles();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [refreshBalance, setRefreshBalance] = useState(false);

  const [isExpertMode] = useExpertModeManager();
  const principal = useAccountPrincipal();

  useLoadDefaultParams();

  const {
    [SWAP_FIELD.INPUT]: currencyA,
    [SWAP_FIELD.OUTPUT]: currencyB,
    independentField,
    typedValue,
  } = useSwapState();

  const { onCurrencySelection, onSwitchTokens, onUserInput } = useSwapHandlers();
  const handleClearSwapState = useCleanSwapState();

  const {
    inputError: swapInputError,
    parsedAmount,
    trade,
    tradePoolId,
    state: swapState,
    currencyBalances,
    userSlippageTolerance,
    inputCurrency,
    outputCurrency,
    inputCurrencyState,
    outputCurrencyState,
  } = useSwapInfo({ refreshBalance });

  const dependentField = independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT;

  const parsedAmounts = useMemo(
    () => ({
      [SWAP_FIELD.INPUT]: independentField === SWAP_FIELD.INPUT ? parsedAmount : trade?.inputAmount,
      [SWAP_FIELD.OUTPUT]: independentField === SWAP_FIELD.OUTPUT ? parsedAmount : trade?.outputAmount,
    }),
    [independentField, parsedAmount],
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const handleSwap = () => {
    setConfirmModalShow(true);
  };

  const handleTokenAChange = useCallback(
    (token: TokenInfo) => {
      if (token.canisterId === currencyB.currencyId) {
        onCurrencySelection(SWAP_FIELD.INPUT, token.canisterId);
        onCurrencySelection(SWAP_FIELD.OUTPUT, undefined);
      } else {
        onCurrencySelection(SWAP_FIELD.INPUT, token.canisterId);
      }
    },
    [onCurrencySelection, currencyB],
  );

  const handleTokenBChange = useCallback(
    (token: TokenInfo) => {
      if (token.canisterId === currencyA.currencyId) {
        onCurrencySelection(SWAP_FIELD.INPUT, undefined);
        onCurrencySelection(SWAP_FIELD.OUTPUT, token.canisterId);
      } else {
        onCurrencySelection(SWAP_FIELD.OUTPUT, token.canisterId);
      }
    },
    [onCurrencySelection, currencyB],
  );

  const handleTypeInput = useCallback(
    (value) => {
      onUserInput(SWAP_FIELD.INPUT, value);
    },
    [onUserInput],
  );

  const handleTypeOutput = useCallback(
    (value) => {
      onUserInput(SWAP_FIELD.OUTPUT, value);
    },
    [onUserInput],
  );

  const isLoadingRoute = swapState === TradeState.LOADING;
  const isNoRouteFound = swapState === TradeState.NO_ROUTE_FOUND;
  const isValid = !swapInputError && !isLoadingRoute && !isNoRouteFound;
  const isPoolNotChecked = swapState === TradeState.NOT_CHECK;

  const swapCallback = useSwapCallback();

  const [swapLoading, setSwapLoading] = useState(false);
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const inputTokenAddress = inputCurrency?.address;
  const tradePool = trade?.route.pools[0];
  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const { result: subAccountTokenBalance } = useTokenBalance({
    canisterId: inputTokenAddress,
    address: tradePoolId,
    sub,
  });
  const { result: unusedBalance } = useUserUnusedBalance(tradePoolId, principal);
  const swapTokenUnusedBalance = useMemo(() => {
    if (!tradePool || !unusedBalance || !inputCurrency) return undefined;
    return tradePool.token0.address === inputCurrency.address ? unusedBalance.balance0 : unusedBalance.balance1;
  }, [tradePool, inputCurrency, unusedBalance]);

  const handleSwapConfirm = useCallback(async () => {
    if (swapLoading || !trade || isNullArgs(subAccountTokenBalance) || isNullArgs(swapTokenUnusedBalance)) return;

    const { call, key } = swapCallback({
      trade,
      subAccountTokenBalance: subAccountTokenBalance as BigNumber,
      swapInTokenUnusedBalance: swapTokenUnusedBalance as bigint,
      openExternalTip: ({ message, tipKey }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} />);
      },
    });

    setSwapLoading(true);

    const amount0 = trade.inputAmount.toSignificant(12, { groupSeparator: "," });
    const amount1 = trade.outputAmount.toSignificant(12, { groupSeparator: "," });

    const loadingKey = openLoadingTip(
      t`Swap ${amount0} ${inputCurrency?.symbol} to ${amount1} ${outputCurrency?.symbol}`,
      {
        extraContent: <StepViewButton step={key} />,
      },
    );

    setConfirmModalShow(false);
    setSwapLoading(false);

    handleTypeInput("");
    handleTypeOutput("");

    const result = await call();

    closeLoadingTip(loadingKey);

    if (result) {
      openSuccessTip(t`Swapped Successfully`);
      setRefreshBalance(true);
      setTimeout(() => {
        setRefreshBalance(false);
      }, 1000);
    }
  }, [swapCallback, swapLoading, setSwapLoading, trade, subAccountTokenBalance, swapTokenUnusedBalance]);

  const maxInputAmount = useMaxAmountSpend({
    currencyAmount: currencyBalances[SWAP_FIELD.INPUT],
    poolId: tradePoolId,
  });

  const showMaxButton = Boolean(
    maxInputAmount?.greaterThan(0) && !parsedAmounts[SWAP_FIELD.INPUT]?.equalTo(maxInputAmount),
  );

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(SWAP_FIELD.INPUT, maxAmountFormat(maxInputAmount.toExact(), maxInputAmount.currency.decimals));
    }
  }, [maxInputAmount, onUserInput]);

  // const fiatValueInput = useUSDValue(parsedAmounts[SWAP_FIELD.INPUT]);
  // const fiatValueOutput = useUSDValue(parsedAmounts[SWAP_FIELD.OUTPUT]);
  // const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);
  const priceImpact = undefined;

  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;

    return warningSeverity(
      executionPriceImpact && !!priceImpact
        ? executionPriceImpact.greaterThan(priceImpact!)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact,
    );
  }, [priceImpact, trade]);

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;
  // const priceImpactTooHigh = priceImpactSeverity > 3;

  useEffect(() => {
    return () => {
      handleClearSwapState();
    };
  }, []);

  const inputCurrencyInterfacePrice = useUSDPrice(inputCurrency);
  const outputCurrencyInterfacePrice = useUSDPrice(outputCurrency);

  const inputBalanceUSDValue = useMemo(() => {
    const amount = formattedAmounts[SWAP_FIELD.INPUT];
    if (!inputCurrencyInterfacePrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(inputCurrencyInterfacePrice).toNumber();
  }, [inputCurrencyInterfacePrice, formattedAmounts]);

  const outputBalanceUSDValue = useMemo(() => {
    const amount = formattedAmounts[SWAP_FIELD.OUTPUT];
    if (!outputCurrencyInterfacePrice || !amount) return undefined;
    return new BigNumber(amount).multipliedBy(outputCurrencyInterfacePrice).toNumber();
  }, [outputCurrencyInterfacePrice, formattedAmounts]);

  const USDChange =
    !!outputBalanceUSDValue && !!inputBalanceUSDValue
      ? new BigNumber(outputBalanceUSDValue)
          .minus(inputBalanceUSDValue)
          .dividedBy(inputBalanceUSDValue)
          .multipliedBy(100)
          .toFixed(2)
      : null;

  const USDChangeColor = !new BigNumber(USDChange ?? 0).isLessThan(0) ? "#54C081" : "#D3625B";

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <Box className={classes.inputBox}>
          <Grid container>
            <Box>
              <Grid container alignItems="center">
                <Grid mr={1}>
                  <CurrencySelector
                    currencyId={currencyA?.currencyId}
                    onChange={handleTokenAChange}
                    disabledCurrency={inputCurrency ? [inputCurrency] : []}
                    bgGray
                    loading={inputCurrencyState === UseCurrencyState.LOADING}
                  />
                </Grid>
              </Grid>
            </Box>
            <Grid item xs container alignItems="center">
              <SwapInput
                value={formattedAmounts[SWAP_FIELD.INPUT]}
                currency={inputCurrency}
                onUserInput={handleTypeInput}
              />
            </Grid>
          </Grid>
          {inputCurrency ? (
            <Grid container alignItems="center" mt={"12px"}>
              <Typography>
                <Trans>
                  Balance:{" "}
                  {!!currencyBalances[SWAP_FIELD.INPUT]
                    ? formatCurrencyAmount(currencyBalances[SWAP_FIELD.INPUT], inputCurrency?.decimals)
                    : "--"}
                </Trans>
              </Typography>

              {showMaxButton && (
                <Typography fontSize="12px" className={classes.maxButton} onClick={handleMaxInput}>
                  <Trans>MAX</Trans>
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
          <SwitchIcon />
        </Box>
      </Box>

      <Box sx={{ marginTop: "8px" }}>
        <Box className={classes.inputBox}>
          <Grid container>
            <Box>
              <Grid container alignItems="center">
                <Grid mr={1}>
                  <CurrencySelector
                    currencyId={currencyB?.currencyId}
                    onChange={handleTokenBChange}
                    disabledCurrency={
                      outputCurrency
                        ? [outputCurrency, ...(!currencyA.currencyId ? [ICP] : [])]
                        : [...(!currencyA.currencyId ? [ICP] : [])]
                    }
                    bgGray
                    loading={outputCurrencyState === UseCurrencyState.LOADING}
                  />
                </Grid>
              </Grid>
            </Box>
            <Grid item xs container alignItems="center">
              <SwapInput
                value={formattedAmounts[SWAP_FIELD.OUTPUT]}
                currency={outputCurrency}
                onUserInput={handleTypeOutput}
                disabled
              />
            </Grid>
          </Grid>
          {!!currencyBalances[SWAP_FIELD.OUTPUT] ? (
            <Grid container mt="12px">
              <Typography>
                <Trans>
                  Balance: {formatCurrencyAmount(currencyBalances[SWAP_FIELD.OUTPUT], outputCurrency?.decimals)}
                </Trans>
              </Typography>

              {outputBalanceUSDValue ? (
                <Grid item xs>
                  <Grid container alignItems="center" justifyContent="flex-end">
                    <Typography>
                      ~{formatDollarAmount(outputBalanceUSDValue)}
                      {USDChange ? (
                        <Typography component="span" sx={{ color: USDChangeColor }}>
                          ({USDChange}%)
                        </Typography>
                      ) : null}
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          ) : null}
        </Box>
      </Box>

      {isLoadingRoute || (!isLoadingRoute && !!trade) ? (
        <Box mt="22px">
          <MainCard contentSX={{ padding: "18px 16px", paddingBottom: "18px!important" }} border="level4">
            <Box sx={{ display: "grid", gap: "20px 0", gridTemplateColumns: "1fr" }}>
              {isLoadingRoute ? (
                <Grid mt={1} container justifyContent="flex-start" alignItems="center">
                  <CircularProgress size={14} color="inherit" />
                  <Typography sx={{ margin: "0 0 0 4px" }}>Fetching price...</Typography>
                </Grid>
              ) : !!trade ? (
                <Box>
                  <TradePrice
                    poolId={trade.swaps[0].route.pools[0].id}
                    price={trade.executionPrice}
                    token0={inputCurrency}
                    token1={outputCurrency}
                    token0PriceUSDValue={toSignificant(inputCurrencyInterfacePrice ?? 0, 18)}
                    token1PriceUSDValue={toSignificant(outputCurrencyInterfacePrice ?? 0, 18)}
                  />
                </Box>
              ) : null}
            </Box>
          </MainCard>
        </Box>
      ) : null}

      <Box mt={4}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSwap}
          disabled={!isValid || priceImpactTooHigh || isPoolNotChecked}
        >
          {swapInputError ? (
            swapInputError
          ) : isLoadingRoute ? (
            <Trans>Swap</Trans>
          ) : isNoRouteFound ? (
            <Trans>Insufficient liquidity for this trade.</Trans>
          ) : isPoolNotChecked ? (
            <Trans>Waiting for verifying the pool...</Trans>
          ) : priceImpactTooHigh ? (
            <Trans>High Price Impact</Trans>
          ) : priceImpactSeverity > 2 ? (
            <Trans>Swap Anyway</Trans>
          ) : (
            <Trans>Swap</Trans>
          )}
        </Button>
      </Box>

      {confirmModalShow && trade && (
        <Identity onSubmit={handleSwapConfirm}>
          {({ submit }: CallbackProps) => (
            <ConfirmModal
              trade={trade}
              open={confirmModalShow}
              onClose={() => setConfirmModalShow(false)}
              onConfirm={submit}
              slippageTolerance={userSlippageTolerance}
              loading={swapLoading}
            />
          )}
        </Identity>
      )}
    </Box>
  );
}
