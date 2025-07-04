import { useCallback, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Box, Typography } from "components/Mui";
import { CurrencyAmount } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import PercentageSlider from "components/PercentageSlider";
import HeaderTab from "components/swap/Header";
import { useDebouncedChangeHandler } from "@icpswap/hooks";
import { useBurnHandlers, useBurnInfo, useBurnState, useResetBurnState } from "store/swap/burn/hooks";
import { BURN_FIELD } from "constants/swap";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import { useSuccessTip, useLoadingTip } from "hooks/useTips";
import { CurrencyAmountFormatDecimals } from "constants/index";
import { useAccountPrincipal } from "store/auth/hooks";
import LiquidityInfo from "components/swap/LiquidityInfo";
import { PoolState } from "hooks/swap/usePools";
import { usePositionFees } from "hooks/swap/usePositionFees";
import StepViewButton from "components/Steps/View";
import { useDecreaseLiquidityCallback } from "hooks/swap/liquidity";
import { LoadingRow, MainCard, Wrapper, AuthButton } from "components/index";
import { useTranslation } from "react-i18next";
import { DecreaseLiquidityConfirm } from "components/liquidity/Decrease/Confirm";
import { Unclaimed } from "components/liquidity/Decrease/Unclaimed";
import { DecreaseLiquidityInput } from "components/liquidity/Decrease/Input";

export default function DecreaseLiquidity() {
  const { t } = useTranslation();
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
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const handleBack = useCallback(() => {
    resetBurnState();
    history.goBack();
  }, [history, resetBurnState]);

  const handleDecreaseSuccess = () => {
    resetBurnState();

    if (liquidityToRemove.equalTo(1)) {
      history.push("/liquidity?tab=Positions");
    } else {
      history.goBack();
    }
  };

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(positionSDK?.pool.id, BigInt(positionId));

  const getDecreaseLiquidityCall = useDecreaseLiquidityCallback({
    position: positionSDK,
    poolId,
    positionId: BigInt(positionId),
    liquidityToRemove,
    currencyA,
    currencyB,
    formattedAmounts,
  });

  const handleConfirm = useCallback(async () => {
    if (!positionSDK || !liquidityToRemove || loading || !principal) {
      return;
    }

    setLoading(true);

    const { key, call } = getDecreaseLiquidityCall();

    const loadingTipKey = openLoadingTip(`Remove ${currencyA?.symbol}/${currencyB?.symbol} liquidity`, {
      extraContent: <StepViewButton step={key} />,
    });

    setConfirmModalShow(false);

    const result = await call();

    closeLoadingTip(loadingTipKey);

    if (result === true) {
      openSuccessTip(t("swap.decrease.liquidity.success"));
      handleDecreaseSuccess();
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
      <Flex fullWidth justify="center">
        <MainCard
          level={1}
          sx={{
            width: "100%",
            maxWidth: "612px",
          }}
        >
          <HeaderTab title={t`Remove Liquidity`} showArrow showUserSetting slippageType="burn" onBack={handleBack} />

          {!positionLoading ? (
            <>
              <Box mt="22px">
                <LiquidityInfo position={positionSDK} positionId={positionId} />
              </Box>
              <Box mt="22px">
                <Typography variant="h5" color="textPrimary">
                  {t("common.amount")}
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
                mt="40px"
                sx={{
                  paddingRight: "12px",
                }}
              >
                <PercentageSlider
                  value={new BigNumber(liquidityPercentage?.toString() ?? 0).toNumber()}
                  onChange={(event, value) => setLiquidityPercentage(value)}
                />
              </Box>

              <Box mt="24px">
                <Unclaimed position={positionSDK} feeAmount0={feeAmount0} feeAmount1={feeAmount1} />
              </Box>

              <Box mt="24px">
                <AuthButton
                  variant="contained"
                  fullWidth
                  disabled={!isValid || loading}
                  size="large"
                  onClick={handleDecreaseLiquidity}
                >
                  {isValid ? t("common.remove") : error}
                </AuthButton>
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
      </Flex>

      {confirmModalShow && (
        <DecreaseLiquidityConfirm
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
