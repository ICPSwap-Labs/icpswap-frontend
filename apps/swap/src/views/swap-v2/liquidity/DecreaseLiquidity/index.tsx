import { memo, useCallback, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CurrencyAmount, Position } from "@icpswap/swap-sdk";
import MainCard from "components/cards/MainCard";
import PercentageSlider from "components/PercentageSlider";
import HeaderTab from "components/swap/Header";
import useDebouncedChangeHandler from "hooks/useDebouncedChangeHandler";
import { useBurnHandlers, useBurnInfo, useBurnState, useResetBurnState } from "store/swapv2/burn/hooks";
import { useSlippageManager, useUserTransactionsDeadline } from "store/swapv2/cache/hooks";
import { BURN_FIELD, slippageToPercent } from "constants/swap";
import {
  usePosition as usePositionRequest,
  decreaseLiquidity as decreaseLiquidityRequest,
  decreaseInvalidLiquidity,
} from "hooks/swap/v2/useSwapCalls";
import BigNumber from "bignumber.js";
import ConfirmRemoveLiquidityModal from "./Confirm";
import { useErrorTip, useSuccessTip, useLoadingTip } from "hooks/useTips";
import { useAccount } from "store/global/hooks";
import DecreaseLiquidityInput from "./Input";
import { CurrencyAmountFormatDecimals } from "constants/index";
import { t, Trans } from "@lingui/macro";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { useAccountPrincipal } from "store/auth/hooks";
import { type StatusResult, type ActorIdentity } from "@icpswap/types";
import LiquidityInfo from "components/swap/LiquidityInfo";
import Unclaimed from "./Unclaimed";
import Loading from "components/Loading/Static";
import { PoolState } from "hooks/swap/v2/usePools";
import { getLocaleMessage } from "locales/services";
import Button from "components/authentication/ButtonConnector";

const useStyle = makeStyles(() => {
  return {
    container: {
      width: "100%",
      maxWidth: "720px",
    },
  };
});

export default memo(() => {
  const classes = useStyle();
  const history = useHistory();

  const isInvalid = history.location.search?.includes("invalid");
  const principal = useAccountPrincipal();
  const { positionId: _positionId } = useParams<{ positionId: string }>();
  const positionId = BigInt(_positionId);

  const { result: _position, loading: positionRequestLoading } = usePositionRequest(positionId, isInvalid);
  const { independentField, typedValue } = useBurnState();
  const {
    position: positionSDK,
    parsedAmounts,
    error,
    currencyA,
    currencyB,
    liquidityToRemove,
    poolState,
  } = useBurnInfo(_position);

  const positionLoading = PoolState.LOADING === poolState || positionRequestLoading;

  const { onUserInput } = useBurnHandlers();

  const isValid = !error;

  const formattedAmounts = {
    // [BURN_FIELD.LIQUIDITY_PERCENT]: parsedAmounts[BURN_FIELD.LIQUIDITY_PERCENT].equalTo("0")
    //   ? "0"
    //   : parsedAmounts[BURN_FIELD.LIQUIDITY_PERCENT].lessThan(new Percent("1", "100"))
    //   ? "<1"
    //   : parsedAmounts[BURN_FIELD.LIQUIDITY_PERCENT].toFixed(0),
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

  const [slippageTolerance] = useSlippageManager("burn");
  const account = useAccount();
  const transactionsDeadline = useUserTransactionsDeadline();

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const handleBack = useCallback(() => {
    resetBurnState();
    history.push("/swap/v2/liquidity");
  }, [history, resetBurnState]);

  const handleConfirm = useCallback(
    async (identity: ActorIdentity, { loading }: SubmitLoadingProps) => {
      if (!positionSDK || !liquidityToRemove || loading || !principal) {
        return;
      }

      const loadingTipKey = openLoadingTip(`Remove ${currencyA?.symbol}/${currencyB?.symbol} liquidity`);
      setConfirmModalShow(false);

      const partialPosition = new Position({
        pool: positionSDK.pool,
        liquidity: liquidityToRemove.multiply(positionSDK.liquidity).quotient,
        tickLower: positionSDK.tickLower,
        tickUpper: positionSDK.tickUpper,
      });

      const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
        slippageToPercent(slippageTolerance),
      );

      let result:
        | undefined
        | StatusResult<{
            amount0: bigint;
            amount1: bigint;
          }> = undefined;

      if (isInvalid) {
        result = await decreaseInvalidLiquidity(identity, {
          tokenId: positionId,
          liquidity: partialPosition.liquidity.toString(),
          amount0Min: amount0Min.toString(),
          amount1Min: amount1Min.toString(),
          deadline: BigInt(transactionsDeadline),
          recipient: principal,
        });
      } else {
        result = await decreaseLiquidityRequest(identity, {
          tokenId: positionId,
          liquidity: partialPosition.liquidity.toString(),
          amount0Min: amount0Min.toString(),
          amount1Min: amount1Min.toString(),
          deadline: BigInt(transactionsDeadline),
          recipient: principal,
        });
      }

      const { status, message } = result;

      closeLoadingTip(loadingTipKey);

      if (status === "ok") {
        openSuccessTip(t`Removed liquidity successfully`);
        handleBack();
      } else {
        openErrorTip(getLocaleMessage(message) ?? t`Failed to remove liquidity`);
      }
    },
    [positionSDK, liquidityToRemove, slippageTolerance, positionId, transactionsDeadline, account],
  );

  const handleDecreaseLiquidity = useCallback(() => {
    setConfirmModalShow(true);
  }, [setConfirmModalShow]);

  const handleCancel = useCallback(() => {
    setConfirmModalShow(false);
  }, [setConfirmModalShow]);

  return (
    <Identity onSubmit={handleConfirm}>
      {({ submit, loading }: CallbackProps) => (
        <>
          <Grid container justifyContent="center">
            <MainCard level={1} className={`${classes.container} lightGray200`}>
              <HeaderTab
                title={t`Remove Liquidity`}
                showArrow
                showUserSetting
                slippageType="burn"
                onBack={handleBack}
              />
              <Box mt="22px">
                <LiquidityInfo position={positionSDK} positionId={positionId} version="v2" />
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
                <Unclaimed position={positionSDK} positionId={positionId} invalid={isInvalid} />
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
            </MainCard>

            {positionLoading && (
              <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                <Loading loading={positionLoading} mask />
              </Box>
            )}
          </Grid>
          {confirmModalShow && (
            <ConfirmRemoveLiquidityModal
              open={confirmModalShow}
              onConfirm={submit}
              onCancel={handleCancel}
              currencyA={currencyA}
              currencyB={currencyB}
              formattedAmounts={formattedAmounts}
            />
          )}
        </>
      )}
    </Identity>
  );
});
