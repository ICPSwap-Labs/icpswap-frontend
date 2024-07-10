/* eslint-disable prefer-const */
import { useState, useCallback, useMemo, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import BackIcon from "assets/images/swap/back";
import FeeSelector from "components/swap/SwapFeeSelector";
import CurrencySelector from "components/CurrencySelector";
import DepositAmount from "components/swap/SwapDepositAmount";
import SwapWrapper from "components/swap/SwapUIWrapper";
import {
  useMintState,
  useMintHandlers,
  useMintInfo,
  useRangeCallbacks,
  useResetMintState,
} from "store/swap/liquidity/hooks";
import { UseCurrencyState, useToken } from "hooks/useCurrency";
import { Bound, DEFAULT_FEE, DEFAULT_SWAP_INPUT_ID, FIELD } from "constants/swap";
import ConfirmAddLiquidity from "components/swap/AddLiquidityConfirmModal";
import { useErrorTip, useLoadingTip } from "hooks/useTips";
import BigNumber from "bignumber.js";
import { isDarkTheme } from "utils/index";
import { maxAmountFormat } from "utils/swap";
import { Trans, t } from "@lingui/macro";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Identity as TypeIdentity } from "types/global";
import { useAccountPrincipal } from "store/auth/hooks";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { useAddLiquidityCall } from "hooks/swap/useAddLiquidity";
import StepViewButton from "components/Steps/View";
import AddLiquidityButton from "components/swap/AddLiquidityButton";
import { ExternalTipArgs } from "types/index";
import { ReclaimTips } from "components/ReclaimTips";
import { usePCMMetadata, useParsedQueryString, useUserPCMBalance } from "@icpswap/hooks";
import SetPriceRange from "./SetPriceRange";

const DISABLED_STYLE = {
  opacity: 0.2,
  pointerEvents: "none",
};

const useStyle = makeStyles((theme: Theme) => {
  return {
    container: {
      width: "920px",
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level1 : theme.colors.lightGray50,
      borderRadius: theme.radius,
      padding: "24px",
      "@media(max-width: 960px)": {
        width: "460px",
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
      "@media(max-width: 960px)": {
        gridTemplateColumns: "1fr",
      },
    },
    priceRange: {
      gridArea: "1 / 2 / 3 / auto",
      height: "fit-content",
      "@media(max-width: 960px)": {
        gridArea: "2 / 1 / 3 / auto",
      },
    },
  };
});

interface URLParams {
  currencyIdA: string;
  currencyIdB: string;
  feeAmount: string;
}

export default function AddLiquidity() {
  const classes = useStyle();
  const history = useHistory();
  const principal = useAccountPrincipal();

  let { currencyIdA, currencyIdB, feeAmount: feeAmountFromUrl } = useParams<URLParams>();
  const { path: backPath } = useParsedQueryString() as { path: string };

  if (!currencyIdA) currencyIdA = DEFAULT_SWAP_INPUT_ID;

  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const feeAmount = feeAmountFromUrl ? Number(feeAmountFromUrl) : DEFAULT_FEE;

  const [useCurrencyALoading, baseCurrency] = useToken(currencyIdA);
  const [useCurrencyBLoading, currencyB] = useToken(currencyIdB);
  const quoteCurrency = baseCurrency && currencyB && baseCurrency.equals(currencyB) ? undefined : currencyB;

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

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useMintHandlers();

  const resetMintState = useResetMintState();

  const handleBack = useCallback(() => {
    resetMintState();

    if (backPath) {
      try {
        const path = window.atob(backPath);
        history.push(path);
      } catch (error) {
        console.warn(error);
      }
    } else {
      history.push("/liquidity");
    }
  }, [history, resetMintState, backPath]);

  const handleUrlChange = useCallback(
    (path: string) => {
      if (backPath) {
        history.push(`${path}?path=${backPath}`);
        return;
      }
      history.push(path);
    },
    [backPath],
  );

  const onTokenAChange = (token: TokenInfo) => {
    const tokenId = token.canisterId.toString();
    let path = "";

    if (tokenId === currencyIdB || !currencyIdB) {
      path = `/liquidity/add/${tokenId}`;
    } else {
      path = `/liquidity/add/${tokenId}/${currencyIdB}`;
    }

    handleUrlChange(path);
  };

  const onTokenBChange = (token: TokenInfo) => {
    const tokenId = token.canisterId.toString();
    let path = "";

    if (tokenId === currencyIdA || !currencyIdA) {
      path = `/liquidity/add/${tokenId}`;
    } else {
      path = `/liquidity/add/${currencyIdA}/${tokenId}`;
    }

    handleUrlChange(path);
  };

  const handleFeeChange = useCallback(
    (feeValue) => {
      if (currencyIdA && currencyIdB) {
        handleUrlChange(`/liquidity/add/${currencyIdA}/${currencyIdB}/${feeValue}`);
      }
    },
    [currencyIdA, currencyIdB],
  );

  const clearAll = useCallback(() => {
    onFieldAInput("");
    onFieldBInput("");
    onLeftRangeInput("");
    onRightRangeInput("");
    handleUrlChange("/liquidity/add");
  }, [history, onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput]);

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool);

  const isValidPair = currencyIdA && currencyIdB && currencyIdA !== currencyIdB;

  const handleOnAdd = useCallback(() => {
    setConfirmModalShow(true);
  }, []);

  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  const { result: pcmMetadata } = usePCMMetadata();
  const { result: userPCMBalance } = useUserPCMBalance(principal);

  const [, pcmToken] = useToken(pcmMetadata?.tokenCid.toString());
  const getAddLiquidityCall = useAddLiquidityCall();

  const handleOnConfirm = async (identity: TypeIdentity, { loading }: SubmitLoadingProps) => {
    if (
      !identity ||
      loading ||
      !position ||
      !principal ||
      !pcmMetadata ||
      !pcmToken ||
      userPCMBalance === undefined ||
      userPCMBalance === null
    )
      return;

    const needPayForPCM = userPCMBalance < pcmMetadata.passcodePrice;

    const { call, key } = await getAddLiquidityCall({
      noLiquidity,
      position,
      pcmMetadata,
      needPayForPCM,
      pcmToken,
      principal: principal.toString(),
      openExternalTip: ({ message, tipKey, tokenId, poolId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} tokenId={tokenId} poolId={poolId} />);
      },
    });

    const loadingTipKey = openLoadingTip(t`Add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`, {
      extraContent: <StepViewButton step={key} />,
    });

    setConfirmModalShow(false);

    const result = await call();

    if (!result) {
      closeLoadingTip(loadingTipKey);
      return;
    }

    closeLoadingTip(loadingTipKey);

    handleBack();
  };

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

    handleUrlChange(`/liquidity/add/${currencyIdB}/${currencyIdA}${feeAmount ? `/${feeAmount}` : ""}`);
  };

  const handleCurrencyAMax = () => {
    const currencyAAmount = maxAmounts[FIELD.CURRENCY_A];

    if (!baseCurrency || !currencyAAmount) return;

    onFieldAInput(maxAmountFormat(currencyAAmount.toExact(), currencyAAmount.currency.decimals));
  };

  const handleCurrencyBMax = () => {
    const currencyBAmount = maxAmounts[FIELD.CURRENCY_B];

    if (!currencyB || !currencyBAmount) return;

    onFieldBInput(maxAmountFormat(currencyBAmount.toExact(), currencyBAmount.currency.decimals));
  };

  useEffect(() => {
    return () => {
      resetMintState();
    };
  }, []);

  return (
    <Identity onSubmit={handleOnConfirm}>
      {({ submit, loading }: CallbackProps) => (
        <>
          <SwapWrapper>
            <Grid container justifyContent="center">
              <Grid item className={classes.container}>
                <Grid container className={classes.topHeader}>
                  <Grid item xs={3} container alignItems="center">
                    <BackIcon
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={handleBack}
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
                        <Typography sx={{ cursor: "pointer" }} color="secondary" component="span" onClick={clearAll}>
                          <Trans>clear all</Trans>
                        </Typography>
                      </Grid>
                    </Grid>
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
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CurrencySelector
                          currencyId={currencyIdB}
                          onChange={onTokenBChange}
                          loading={useCurrencyBLoading === UseCurrencyState.LOADING}
                          disabledCurrency={[...(quoteCurrency ? [quoteCurrency] : [])]}
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
                          showMaxButton={
                            !atMaxAmounts[FIELD.CURRENCY_A] &&
                            new BigNumber(maxAmounts[FIELD.CURRENCY_A]?.toExact() ?? 0).isGreaterThan(0)
                          }
                          onMax={handleCurrencyAMax}
                        />
                      </Box>
                      <Box mt={2}>
                        <DepositAmount
                          currency={quoteCurrency}
                          value={formattedAmounts[FIELD.CURRENCY_B]}
                          onUserInput={onFieldBInput}
                          locked={depositBDisabled}
                          currencyBalance={currencyBalances?.[FIELD.CURRENCY_B]}
                          showMaxButton={
                            !atMaxAmounts[FIELD.CURRENCY_B] &&
                            new BigNumber(maxAmounts[FIELD.CURRENCY_B]?.toExact() ?? 0).isGreaterThan(0)
                          }
                          onMax={handleCurrencyBMax}
                        />
                      </Box>
                    </Box>
                    <Box
                      mt={2}
                      sx={{
                        "@media(max-width: 959px)": {
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
                        "@media(max-width:960px)": {
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
          </SwapWrapper>

          {confirmModalShow && !!position && (
            <ConfirmAddLiquidity
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
}
