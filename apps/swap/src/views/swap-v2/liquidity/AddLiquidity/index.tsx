/* eslint-disable prefer-const */
import { memo, useState, useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import BackIcon from "assets/images/swap/back";
import FeeSelector from "components/swap/SwapFeeSelector";
import CurrencySelector from "components/CurrencySelector";
import DepositAmount from "components/swap/SwapDepositAmount";
import { SwapV2Wrapper } from "components/swap/SwapUIWrapper";
import SetPriceRange from "views/swap-liquidity-v3/liquidity/AddLiquidity/SetPriceRange";
import {
  useMintState,
  useMintHandlers,
  useMintInfo,
  useRangeCallbacks,
  useResetMintState,
} from "store/swapv2/liquidity/hooks";
import { useUserTransactionsDeadline, useSlippageManager } from "store/swapv2/cache/hooks";
import { useToken, UseCurrencyState } from "hooks/useToken";
import { Bound, DEFAULT_FEE, FIELD } from "constants/swap";
import AddLiquidityConfirmModal from "components/swap/AddLiquidityConfirmModal";
import { mint as mintRequest } from "hooks/swap/v2/useSwapCalls";
import { useAccount } from "store/global/hooks";
import { useSuccessTip, useErrorTip, useLoadingTip } from "hooks/useTips";
import { isDarkTheme } from "utils/index";
import { Trans, t } from "@lingui/macro";
import { WICPCanisterId } from "constants/index";
import { useApprove } from "hooks/token/useApprove";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Identity as TypeIdentity } from "types/global";
import { useAccountPrincipal } from "store/auth/hooks";
import { Theme } from "@mui/material/styles";
import { getLocaleMessage } from "locales/services";
import { TokenInfo } from "types/token";
import AddLiquidityButton from "components/swap/AddLiquidityButton";

const DISABLED_STYLE = {
  opacity: 0.2,
  pointerEvents: "none",
};

const media960 = "@media(max-width: 959px)";

const useStyle = makeStyles((theme: Theme) => {
  return {
    container: {
      width: "920px",
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level1 : theme.colors.lightGray50,
      borderRadius: theme.radius,
      padding: "24px",
      [media960]: {
        width: "460px",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "12px",
      },
    },
    topHeader: {
      paddingBottom: "12px",
      borderBottom: isDarkTheme(theme) ? "1px solid #212946" : `1px solid ${theme.colors.lightGray200BorderColor}`,
    },
    outerBox: {
      paddingTop: "24px",
      display: "grid",
      gap: "24px 48px",
      gridTemplateRows: "max-content",
      gridTemplateColumns: "1fr 1fr",
      gridAutoFlow: "row",
      [media960]: {
        gridTemplateColumns: "1fr",
      },
    },
    priceRange: {
      gridArea: "1 / 2 / 3 / auto",
      height: "fit-content",
      [media960]: {
        gridArea: "2 / 1 / 3 / auto",
      },
    },
  };
});

export default memo(() => {
  const classes = useStyle();
  const history = useHistory();
  const principal = useAccountPrincipal();

  let {
    currencyIdA,
    currencyIdB,
    feeAmount: feeAmountFromUrl,
  } = useParams<{ currencyIdA: string; currencyIdB: string; feeAmount: string }>();

  if (!currencyIdA) currencyIdA = WICPCanisterId;

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const transactionsDeadline = useUserTransactionsDeadline();
  const [slippageTolerance] = useSlippageManager("mint");

  const feeAmount = feeAmountFromUrl ? Number(feeAmountFromUrl) : DEFAULT_FEE;

  const [useCurrencyALoading, baseCurrency] = useToken(currencyIdA);
  const [useCurrencyBLoading, currencyB] = useToken(currencyIdB);
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB;

  const { independentField, typedValue, startPrice } = useMintState();

  const {
    ticks,
    pricesAtTicks,
    invalidRange,
    dependentField,
    parsedAmounts,
    depositADisabled,
    depositBDisabled,
    ticksAtLimit,
    errorMessage,
    position,
    invertPrice,
    price,
    pool,
    noLiquidity,
    currencyBalances,
    atMaxAmounts,
    maxAmounts,
    poolLoading,
  } = useMintInfo(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, baseCurrency ?? undefined);

  const isValid = !errorMessage && !invalidRange;

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks;

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toExact() ?? "",
  };

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useMintHandlers(noLiquidity);

  const resetMintState = useResetMintState();

  const handleBackToPosition = useCallback(() => {
    resetMintState();
    history.push("/swap/v2/liquidity");
  }, [history, resetMintState]);

  const onTokenAChange = (token: TokenInfo) => {
    const tokenId = token.canisterId.toString();

    if (currencyIdB) {
      if (currencyIdB === WICPCanisterId) {
        if (currencyIdB !== tokenId) {
          history.push(`/swap/v2/liquidity/add/${tokenId}/${currencyIdB}`);
        } else {
          history.push(`/swap/v2/liquidity/add/${tokenId}`);
        }
      } else if (tokenId !== WICPCanisterId) {
        history.push(`/swap/v2/liquidity/add/${tokenId}/${WICPCanisterId}`);
      } else {
        history.push(`/swap/v2/liquidity/add/${WICPCanisterId}/${tokenId}`);
      }
    } else if (tokenId === WICPCanisterId) {
      history.push(`/swap/v2/liquidity/add/${tokenId}`);
    } else {
      history.push(`/swap/v2/liquidity/add/${WICPCanisterId}/${tokenId}`);
    }
  };

  const onTokenBChange = (token: TokenInfo) => {
    const tokenId = token.canisterId.toString();

    if (currencyIdA) {
      if (currencyIdA === WICPCanisterId) {
        if (currencyIdA !== tokenId) {
          history.push(`/swap/v2/liquidity/add/${currencyIdA}/${tokenId}`);
        } else {
          history.push(`/swap/v2/liquidity/add/${tokenId}`);
        }
      } else if (currencyIdA !== tokenId && tokenId !== WICPCanisterId) {
        history.push(`/swap/v2/liquidity/add/${WICPCanisterId}/${tokenId}`);
      } else {
        history.push(`/swap/v2/liquidity/add/${tokenId}/${WICPCanisterId}`);
      }
    } else if (tokenId === WICPCanisterId) {
      history.push(`/swap/v2/liquidity/add/${tokenId}`);
    } else {
      history.push(`/swap/v2/liquidity/add/${tokenId}/${WICPCanisterId}`);
    }
  };

  const handleFeeChange = useCallback(
    (feeValue) => {
      if (currencyIdA && currencyIdB) {
        history.push(`/swap/v2/liquidity/add/${currencyIdA}/${currencyIdB}/${feeValue}`);
      }
    },
    [currencyIdA, currencyIdB],
  );

  const clearAll = useCallback(() => {
    onFieldAInput("");
    onFieldBInput("");
    onLeftRangeInput("");
    onRightRangeInput("");
    history.push(`/swap/v2/liquidity/add`);
  }, [history, onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput]);

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool);

  const isValidPair = currencyIdA && currencyIdB && currencyIdA !== currencyIdB;

  const handleOnAdd = useCallback(() => {
    setConfirmModalShow(true);
  }, []);

  const account = useAccount();

  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const approveCall = useApprove();

  // request submit
  const handleOnConfirm = useCallback(
    async (identity: TypeIdentity, { loading }: SubmitLoadingProps) => {
      if (!identity || loading || !position || !principal) return;

      const loadingTipKey = openLoadingTip(t`Add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`);
      setConfirmModalShow(false);

      // const minimumAmounts = position.mintAmountsWithSlippage(
      //   slippageToPercent(slippageTolerance)
      // );

      const amount0Desired = position.mintAmounts.amount0.toString();
      const amount1Desired = position.mintAmounts.amount1.toString();

      // const amount0Min = minimumAmounts.amount0.toString();
      // const amount1Min = minimumAmounts.amount1.toString();
      const amount0Min = "0";
      const amount1Min = "0";

      if (amount0Desired !== "0") {
        const { status: approve0Status } = await approveCall({
          canisterId: position.pool.token0.address,
          spender: position.pool.id,
          value: amount0Desired,
          account: principal,
        });

        if (approve0Status === "err") {
          openErrorTip(`Failed to approve ${position.pool.token0.symbol}`);
          closeLoadingTip(loadingTipKey);
          return;
        }
      }

      if (amount1Desired !== "0") {
        const { status: approve1Status } = await approveCall({
          canisterId: position.pool.token1.address,
          spender: position.pool.id,
          value: amount1Desired,
          account: principal,
        });

        if (approve1Status === "err") {
          closeLoadingTip(loadingTipKey);
          openErrorTip(`Failed to approve ${position.pool.token1.symbol}`);
          return;
        }
      }

      const { status, message } = await mintRequest(
        identity,
        position.pool.token0.address,
        position.pool.token1.address,
        BigInt(position.pool.fee),
        BigInt(position.tickLower),
        BigInt(position.tickUpper),
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min,
        principal,
        BigInt(transactionsDeadline),
      );

      closeLoadingTip(loadingTipKey);

      if (status === "ok") {
        openSuccessTip(t`Add Liquidity Successfully`);

        handleBackToPosition();
      } else if (status === "err") {
        openErrorTip(getLocaleMessage(message) ?? t`Failed to add liquidity `);
      }
    },
    [position, transactionsDeadline, slippageTolerance, account],
  );

  const handleOnCancel = useCallback(() => {
    setConfirmModalShow(false);
  }, []);

  const isDepositAmountDisabled = useMemo(
    () =>
      invalidRange || tickLower === undefined || tickUpper === undefined || (noLiquidity && !startPrice) || poolLoading,
    [invalidRange, tickLower, tickUpper, startPrice, noLiquidity, poolLoading],
  );

  const handleTokenToggle = () => {
    if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
      onLeftRangeInput((invertPrice ? priceLower : priceUpper?.invert())?.toSignificant(6) ?? "");
      onRightRangeInput((invertPrice ? priceUpper : priceLower?.invert())?.toSignificant(6) ?? "");
      onFieldAInput(formattedAmounts[FIELD.CURRENCY_B] ?? "");
    }

    history.push(`/swap/v2/liquidity/add/${currencyIdB}/${currencyIdA}${feeAmount ? `/${feeAmount}` : ""}`);
  };

  return (
    <Identity onSubmit={handleOnConfirm}>
      {({ submit, loading }: CallbackProps) => (
        <>
          <SwapV2Wrapper>
            <Grid container justifyContent="center">
              <Grid item className={classes.container}>
                <Grid container className={classes.topHeader}>
                  <Grid item xs={3} container alignItems="center">
                    <BackIcon
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={handleBackToPosition}
                    />
                  </Grid>
                  <Grid item xs={6} container justifyContent="center" alignItems="center">
                    <Typography variant="h3" color="textPrimary" align="center">
                      <Trans>Add Liquidity</Trans>
                    </Typography>
                  </Grid>
                  <Grid item container alignItems="center" xs={3} sx={{ position: "relative" }}>
                    <Grid item xs>
                      <Grid container justifyContent="flex-end">
                        <Typography
                          // sx={{ paddingRight: "60px", cursor: "pointer" }}
                          sx={{ cursor: "pointer" }}
                          color="secondary"
                          component="span"
                          onClick={clearAll}
                        >
                          <Trans>clear all</Trans>
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* <SwapSettingIcon type="mint" /> */}
                  </Grid>
                </Grid>
                <Box className={classes.outerBox}>
                  <Box>
                    <Typography variant="h4" color="textPrimary">
                      <Trans>Select Pair</Trans>
                    </Typography>
                    <Grid container mt={2} spacing="12px">
                      <Grid item xs={6}>
                        <CurrencySelector
                          currencyId={currencyIdA}
                          onChange={onTokenAChange}
                          loading={useCurrencyALoading === UseCurrencyState.LOADING}
                          disabledCurrency={[...(baseCurrency ? [baseCurrency] : [])]}
                          version="v2"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CurrencySelector
                          currencyId={currencyIdB}
                          onChange={onTokenBChange}
                          loading={useCurrencyBLoading === UseCurrencyState.LOADING}
                          disabledCurrency={[...(quoteCurrency ? [quoteCurrency] : [])]}
                          version="v2"
                        />
                      </Grid>
                    </Grid>
                    <Box mt={2} sx={!isValidPair ? DISABLED_STYLE : {}}>
                      <FeeSelector
                        defaultActiveFee={feeAmount}
                        onSelect={handleFeeChange}
                        currencyA={baseCurrency}
                        currencyB={quoteCurrency}
                      />
                    </Box>
                  </Box>
                  <Box sx={isDepositAmountDisabled ? DISABLED_STYLE : {}}>
                    <Typography variant="h4" color="textPrimary">
                      <Trans>Deposit Amounts</Trans>
                    </Typography>
                    <Box mt={2}>
                      <Box>
                        <DepositAmount
                          currency={baseCurrency}
                          value={formattedAmounts[FIELD.CURRENCY_A]}
                          onUserInput={onFieldAInput}
                          locked={depositADisabled}
                          currencyBalance={currencyBalances?.[FIELD.CURRENCY_A]}
                          showMaxButton={!atMaxAmounts[FIELD.CURRENCY_A]}
                          onMax={() => onFieldAInput(maxAmounts[FIELD.CURRENCY_A]?.toExact() ?? "")}
                        />
                      </Box>
                      <Box mt={2}>
                        <DepositAmount
                          currency={quoteCurrency}
                          value={formattedAmounts[FIELD.CURRENCY_B]}
                          onUserInput={onFieldBInput}
                          locked={depositBDisabled}
                          currencyBalance={currencyBalances?.[FIELD.CURRENCY_B]}
                          showMaxButton={!atMaxAmounts[FIELD.CURRENCY_B]}
                          onMax={() => onFieldBInput(maxAmounts[FIELD.CURRENCY_B]?.toExact() ?? "")}
                        />
                      </Box>
                    </Box>
                    <Box
                      mt={2}
                      sx={{
                        [media960]: {
                          display: "block",
                        },
                        "@media(min-width: 960px)": {
                          display: "none",
                        },
                      }}
                    >
                      <AddLiquidityButton size="large" disabled={!isValid} error={errorMessage} onClick={handleOnAdd} />
                    </Box>
                  </Box>
                  <Box className={classes.priceRange} sx={!isValidPair ? DISABLED_STYLE : {}}>
                    <SetPriceRange
                      poolLoading={poolLoading}
                      startPrice={startPrice}
                      noLiquidity={noLiquidity}
                      onStartPriceInput={onStartPriceInput}
                      onLeftRangeInput={onLeftRangeInput}
                      onRightRangeInput={onRightRangeInput}
                      getDecrementLower={getDecrementLower}
                      getIncrementLower={getIncrementLower}
                      getDecrementUpper={getDecrementUpper}
                      getIncrementUpper={getIncrementUpper}
                      getSetFullRange={getSetFullRange}
                      handleTokenToggle={handleTokenToggle}
                      baseCurrency={baseCurrency}
                      quoteCurrency={quoteCurrency}
                      ticksAtLimit={ticksAtLimit}
                      feeAmount={feeAmount}
                      priceLower={priceLower}
                      priceUpper={priceUpper}
                      price={price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined}
                    />
                    <Box
                      mt={2}
                      sx={{
                        [media960]: {
                          display: "none",
                        },
                      }}
                    >
                      <AddLiquidityButton
                        size="large"
                        disabled={!isValid || loading}
                        error={errorMessage}
                        onClick={handleOnAdd}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </SwapV2Wrapper>

          {confirmModalShow && !!position && (
            <AddLiquidityConfirmModal
              onConfirm={submit}
              onCancel={handleOnCancel}
              open={confirmModalShow}
              position={position}
            />
          )}
        </>
      )}
    </Identity>
  );
});
