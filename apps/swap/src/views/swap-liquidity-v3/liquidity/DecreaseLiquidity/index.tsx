import { useCallback, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Box, Typography, makeStyles } from "components/Mui";
import { CurrencyAmount } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import PercentageSlider from "components/PercentageSlider";
import HeaderTab from "components/swap/Header";
import { useDebouncedChangeHandler } from "@icpswap/hooks";
import { useBurnHandlers, useBurnInfo, useBurnState, useResetBurnState } from "store/swap/burn/hooks";
import { BURN_FIELD } from "constants/swap";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import { useSuccessTip, useLoadingTip, useErrorTip } from "hooks/useTips";
import { CurrencyAmountFormatDecimals } from "constants/index";
import { t, Trans } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import LiquidityInfo from "components/swap/LiquidityInfo";
import { PoolState } from "hooks/swap/usePools";
import Button from "components/authentication/ButtonConnector";
import { usePositionFees } from "hooks/swap/usePositionFees";
import StepViewButton from "components/Steps/View";
import { useDecreaseLiquidityCallback } from "hooks/swap/liquidity";
import { ExternalTipArgs } from "types/index";
import { ReclaimTips, LoadingRow, MainCard, Wrapper } from "components/index";

import Unclaimed from "./Unclaimed";
import DecreaseLiquidityInput from "./Input";
import ConfirmRemoveLiquidityModal from "./Confirm";

const useStyle = makeStyles(() => {
  return {
    container: {
      width: "100%",
      maxWidth: "612px",
    },
  };
});

export default function DecreaseLiquidity() {
  const classes = useStyle();
  const history = useHistory();

  const principal = useAccountPrincipal();
  const { positionId, pool: poolId } = useParams<{ positionId: string; pool: string }>();

  const { result: position, loading: positionRequestLoading } = usePositionDetailsFromId(poolId, positionId);

  const { independentField, typedValue } = useBurnState();
  const {
    position: positionSDK,
    parsedAmounts,
    error,
    currencyA,
    currencyB,
    liquidityToRemove,
    poolState,
  } = useBurnInfo(position);

  const positionLoading = useMemo(() => {
    if (poolState === PoolState.EXISTS && positionRequestLoading === false) return false;
    return true;
  }, [poolState, positionRequestLoading]);

  const { onUserInput } = useBurnHandlers();

  const isValid = !error;

  const formattedAmounts = {
    [BURN_FIELD.LIQUIDITY_PERCENT]: parsedAmounts[BURN_FIELD.LIQUIDITY_PERCENT].equalTo("0")
      ? "0"
      : parsedAmounts[BURN_FIELD.LIQUIDITY_PERCENT].toFixed(2),
    [BURN_FIELD.CURRENCY_A]:
      independentField === BURN_FIELD.CURRENCY_A
        ? typedValue
        : parsedAmounts[BURN_FIELD.CURRENCY_A]?.toFixed(
            CurrencyAmountFormatDecimals(parsedAmounts[BURN_FIELD.CURRENCY_A]?.currency.decimals),
          ) ?? "",
    [BURN_FIELD.CURRENCY_B]:
      independentField === BURN_FIELD.CURRENCY_B
        ? typedValue
        : parsedAmounts[BURN_FIELD.CURRENCY_B]?.toFixed(
            CurrencyAmountFormatDecimals(parsedAmounts[BURN_FIELD.CURRENCY_B]?.currency.decimals),
          ) ?? "",
  };

  const totalAmount = useMemo(() => {
    if (!positionSDK || !currencyA || !currencyB)
      return {
        [BURN_FIELD.CURRENCY_A]: 0,
        [BURN_FIELD.CURRENCY_B]: 0,
      };

    return {
      [BURN_FIELD.CURRENCY_A]: CurrencyAmount.fromRawAmount(currencyA, positionSDK.amount0.quotient).toFixed(
        CurrencyAmountFormatDecimals(currencyA.decimals),
      ),
      [BURN_FIELD.CURRENCY_B]: CurrencyAmount.fromRawAmount(currencyB, positionSDK.amount1.quotient).toFixed(
        CurrencyAmountFormatDecimals(currencyB.decimals),
      ),
    };
  }, [positionSDK]);

  const liquidityPercentChangeCallback = useCallback(
    (value: number | number[]) => {
      onUserInput(BURN_FIELD.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput],
  );

  const onCurrencyAInput = useCallback(
    (typedValue: string) => {
      onUserInput(BURN_FIELD.CURRENCY_A, typedValue);
    },
    [onUserInput],
  );

  const onCurrencyBInput = useCallback(
    (typedValue: string) => {
      onUserInput(BURN_FIELD.CURRENCY_B, typedValue);
    },
    [onUserInput],
  );

  const [liquidityPercentage, setLiquidityPercentage] = useDebouncedChangeHandler<number | number[]>(
    Number(formattedAmounts[BURN_FIELD.LIQUIDITY_PERCENT]),
    liquidityPercentChangeCallback,
  );

  const resetBurnState = useResetBurnState();

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const handleBack = useCallback(() => {
    resetBurnState();
    history.goBack();
  }, [history, resetBurnState]);

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(positionSDK?.pool.id, BigInt(positionId));

  const getDecreaseLiquidityCall = useDecreaseLiquidityCallback({
    position: positionSDK,
    poolId,
    positionId: BigInt(positionId),
    liquidityToRemove,
    currencyA,
    currencyB,
    formattedAmounts,
    feeAmount0,
    feeAmount1,
  });

  const handleConfirm = useCallback(async () => {
    if (!positionSDK || !liquidityToRemove || loading || !principal) {
      return;
    }

    setLoading(true);

    const { key, call } = getDecreaseLiquidityCall({
      openExternalTip: ({ message, tipKey, tokenId, poolId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} poolId={poolId} tokenId={tokenId} />);
      },
    });

    const loadingTipKey = openLoadingTip(`Remove ${currencyA?.symbol}/${currencyB?.symbol} liquidity`, {
      extraContent: <StepViewButton step={key} />,
    });

    setConfirmModalShow(false);

    const result = await call();

    closeLoadingTip(loadingTipKey);

    if (result === true) {
      openSuccessTip(t`Removed liquidity successfully`);
      handleBack();
    }

    setLoading(false);
  }, [positionSDK, liquidityToRemove, loading]);

  const handleDecreaseLiquidity = useCallback(() => {
    setConfirmModalShow(true);
  }, [setConfirmModalShow]);

  const handleCancel = useCallback(() => {
    setConfirmModalShow(false);
  }, [setConfirmModalShow]);

  return (
    <Wrapper>
      <Grid container justifyContent="center">
        <MainCard level={1} className={`${classes.container} lightGray200`}>
          <HeaderTab title={t`Remove Liquidity`} showArrow showUserSetting slippageType="burn" onBack={handleBack} />

          {!positionLoading ? (
            <>
              <Box mt="22px">
                <LiquidityInfo position={positionSDK} positionId={positionId} />
              </Box>
              <Box mt="22px">
                <Typography variant="h5" color="textPrimary">
                  <Trans>Amount</Trans>
                </Typography>
                <Box mt="12px">
                  <DecreaseLiquidityInput
                    totalAmount={totalAmount[BURN_FIELD.CURRENCY_A]}
                    currency={currencyA}
                    onUserInput={onCurrencyAInput}
                    value={formattedAmounts[BURN_FIELD.CURRENCY_A] ?? 0}
                  />
                </Box>
                <Box mt={2}>
                  <DecreaseLiquidityInput
                    totalAmount={totalAmount[BURN_FIELD.CURRENCY_B]}
                    currency={currencyB}
                    onUserInput={onCurrencyBInput}
                    value={formattedAmounts[BURN_FIELD.CURRENCY_B] ?? 0}
                  />
                </Box>
              </Box>
              <Box
                mt={5}
                sx={{
                  paddingRight: "12px",
                }}
              >
                <PercentageSlider
                  value={new BigNumber(liquidityPercentage?.toString() ?? 0).toNumber()}
                  onChange={(event, value) => setLiquidityPercentage(value)}
                />
              </Box>

              <Box mt="30px">
                <Unclaimed position={positionSDK} feeAmount0={feeAmount0} feeAmount1={feeAmount1} />
              </Box>

              <Box mt={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!isValid || loading}
                  size="large"
                  onClick={handleDecreaseLiquidity}
                >
                  {isValid ? t`Remove` : error}
                </Button>
              </Box>
            </>
          ) : null}

          {positionLoading ? (
            <Box sx={{ margin: "40px 0 0 0", minHeight: "650px" }}>
              <LoadingRow>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </LoadingRow>
            </Box>
          ) : null}
        </MainCard>
      </Grid>

      {confirmModalShow && (
        <ConfirmRemoveLiquidityModal
          open={confirmModalShow}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          currencyA={currencyA}
          currencyB={currencyB}
          formattedAmounts={formattedAmounts}
        />
      )}
    </Wrapper>
  );
}
