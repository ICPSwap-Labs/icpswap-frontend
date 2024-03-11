import { ReactChild, memo, useMemo, useCallback, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MainCard from "components/cards/MainCard";
import HeaderTab from "components/swap/Header";
import DepositAmount from "components/swap/SwapDepositAmount";
import { FIELD, slippageToPercent } from "constants/swap";
import { useMintState, useMintHandlers, useMintInfo, useResetMintState } from "store/swapv2/liquidity/hooks";
import { useSlippageManager, useUserTransactionsDeadline } from "store/swapv2/cache/hooks";
import {
  usePosition as usePositionRequest,
  increaseLiquidity as increaseLiquidityRequest,
} from "hooks/swap/v2/useSwapCalls";
import { usePositionInfo } from "hooks/swap/v2/usePosition";
import ConfirmAddLiquidity from "components/swap/AddLiquidityConfirmModal";
import { useErrorTip, useSuccessTip, useLoadingTip } from "hooks/useTips";
import { NONE_TOKEN_SYMBOL } from "constants/index";
import Loading from "components/Loading/Static";
import { parseTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { isDarkTheme } from "utils/index";
import { Trans, t } from "@lingui/macro";
import { useApprove } from "hooks/token/useApprove";
import { Identity as TypeIdentity } from "types/global";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { useAccountPrincipal } from "store/auth/hooks";
import { Theme } from "@mui/material/styles";
import LiquidityInfo from "components/swap/LiquidityInfo";
import { getLocaleMessage } from "locales/services";
import Button from "components/authentication/ButtonConnector";

const useStyle = makeStyles((theme: Theme) => {
  return {
    container: {
      width: "100%",
      maxWidth: "720px",
    },
    currentPrice: {
      padding: "16px 20px",
      border: theme.palette.border.gray200,
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level1 : "#fff",
      borderRadius: "12px",
      marginTop: "20px",
    },
    range: {
      width: "48%",
      padding: "16px 0",
      borderRadius: "12px",
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level2 : "#fff",
    },
    inputBox: {
      backgroundColor: theme.palette.background.level3,
      borderRadius: "12px",
      padding: "16px 24px 16px 12px",
    },
    input: {
      "& input": {
        fontSize: "20px",
        fontWeight: 700,
        // color: theme.textPrimary,
        textAlign: "right",
        height: "28px",
        padding: "0 0",
      },
      "& input::placeholder": {
        fontSize: "20px",
        fontWeight: 700,
      },
    },
  };
});

export function PriceRange({
  label,
  value,
  currencyA,
  currencyB,
}: {
  label: ReactChild;
  value: ReactChild;
  currencyA: Token | undefined;
  currencyB: Token | undefined;
}) {
  const classes = useStyle();

  return (
    <Grid item container className={classes.range} alignItems="center" flexDirection="column">
      <Typography fontSize="12px">{label}</Typography>
      <Box mt="12px">
        <Typography variant="h3" color="textPrimary">
          {value}
        </Typography>
      </Box>
      <Box mt="12px">
        <Typography fontSize="12px">
          {!!currencyB?.symbol && !!currencyA?.symbol
            ? `${currencyB?.symbol} per ${currencyA?.symbol}`
            : NONE_TOKEN_SYMBOL}
        </Typography>
      </Box>
    </Grid>
  );
}

export default memo(() => {
  const classes = useStyle();
  const history = useHistory();
  const { positionId: _positionId } = useParams<{ positionId: string }>();
  const positionId = BigInt(_positionId);
  const { result: _position, loading: positionRequestLoading } = usePositionRequest(positionId);
  const { position: existingPosition, loading: usePositionLoading } = usePositionInfo(_position);
  const [manuallyInverted] = useState(false);
  const principal = useAccountPrincipal();
  const positionLoading = usePositionLoading || positionRequestLoading;

  const currency0 = existingPosition?.pool.token0;
  const currency1 = existingPosition?.pool.token1;

  const baseCurrency = useMemo(
    () => (manuallyInverted ? currency1 : currency0),
    [manuallyInverted, currency0, currency1],
  );
  const isSorted = currency0 ? baseCurrency?.equals(currency0) : false;
  const quoteCurrency = isSorted ? currency1 : currency0;

  const { independentField, typedValue } = useMintState();
  const {
    dependentField,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    errorMessage,
    invalidRange,
    depositADisabled,
    depositBDisabled,
    atMaxAmounts,
    maxAmounts,
  } = useMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    existingPosition?.pool.fee,
    baseCurrency ?? undefined,
    existingPosition,
    manuallyInverted,
  );

  const { onFieldAInput, onFieldBInput } = useMintHandlers(noLiquidity);

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const isValid = !errorMessage && !invalidRange;

  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const handleIncreaseLiquidity = useCallback(() => {
    setConfirmModalShow(true);
  }, [setConfirmModalShow]);

  const handleCancel = useCallback(() => {
    setConfirmModalShow(false);
  }, [setConfirmModalShow]);

  const deadline = useUserTransactionsDeadline();
  const [slippageTolerance] = useSlippageManager("mint");

  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const resetMintState = useResetMintState();

  const loadLiquidityPage = useCallback(() => {
    resetMintState();
    history.push("/swap/v2/liquidity");
  }, [history, resetMintState]);

  const approve = useApprove();

  const handleConfirm = useCallback(
    async (identity: TypeIdentity, { loading }: SubmitLoadingProps) => {
      if (loading || !principal) return;

      if (position) {
        setConfirmModalShow(false);

        const minimumAmounts = position.mintAmountsWithSlippage(slippageToPercent(slippageTolerance));

        const amount0Desired = position.mintAmounts.amount0.toString();
        const amount1Desired = position.mintAmounts.amount1.toString();
        const amount0Min = minimumAmounts.amount0.toString();
        const amount1Min = minimumAmounts.amount1.toString();

        const loadingTipKey = openLoadingTip(
          t`Add ${parseTokenAmount(amount0Desired, position.pool.token0.decimals).toFormat()} ${
            position.pool.token0.symbol
          } and ${parseTokenAmount(amount1Desired, position.pool.token1.decimals).toFormat()} ${
            position.pool.token1.symbol
          }`,
        );

        const { status: approve0Status } = await approve({
          canisterId: position.pool.token0.address,
          spender: position.pool.id,
          value: amount0Desired,
          account: principal,
        });

        if (approve0Status === "err") {
          closeLoadingTip(loadingTipKey);
          openErrorTip(`Failed to approve ${position.pool.token0.symbol}`);
          return;
        }

        const { status: approve1Status } = await approve({
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

        const { status, message } = await increaseLiquidityRequest(identity, {
          tokenId: positionId,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
          deadline: BigInt(deadline),
          recipient: principal,
        });

        closeLoadingTip(loadingTipKey);

        if (status === "ok") {
          openSuccessTip(t`Add Liquidity Successfully`);
          loadLiquidityPage();
        } else {
          openErrorTip(getLocaleMessage(message) ?? t`Failed to add liquidity`);
        }
      }
    },
    [position, positionId, slippageTolerance, deadline],
  );

  return (
    <Identity onSubmit={handleConfirm}>
      {({ submit, loading }: CallbackProps) => (
        <Box sx={{ position: "relative" }}>
          <Grid container justifyContent="center">
            <Box sx={{ width: "100%", maxWidth: "720px", position: "relative" }}>
              <MainCard level={1} className={`${classes.container} lightGray200`}>
                <HeaderTab
                  title="Add Liquidity"
                  showArrow
                  showUserSetting
                  slippageType="mint"
                  onBack={loadLiquidityPage}
                />

                <Box mt="20px">
                  <LiquidityInfo position={existingPosition} positionId={positionId} version="v2" />
                </Box>

                <Box mt={3}>
                  <Typography variant="h5" color="textPrimary">
                    <Trans>Add more liquidity</Trans>
                  </Typography>
                  <Box mt="12px">
                    <DepositAmount
                      currency={baseCurrency ?? undefined}
                      onUserInput={onFieldAInput}
                      value={formattedAmounts[FIELD.CURRENCY_A]}
                      locked={depositADisabled}
                      type="addLiquidity"
                      currencyBalance={currencyBalances?.[FIELD.CURRENCY_A]}
                      showMaxButton={!atMaxAmounts[FIELD.CURRENCY_A]}
                      onMax={() => onFieldAInput(maxAmounts[FIELD.CURRENCY_A]?.toExact() ?? "")}
                    />
                    <Box mt="16px">
                      <DepositAmount
                        currency={quoteCurrency ?? undefined}
                        onUserInput={onFieldBInput}
                        value={formattedAmounts[FIELD.CURRENCY_B]}
                        locked={depositBDisabled}
                        type="addLiquidity"
                        currencyBalance={currencyBalances?.[FIELD.CURRENCY_B]}
                        showMaxButton={!atMaxAmounts[FIELD.CURRENCY_B]}
                        onMax={() => onFieldBInput(maxAmounts[FIELD.CURRENCY_B]?.toExact() ?? "")}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box mt={5}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!isValid || loading}
                    size="large"
                    onClick={handleIncreaseLiquidity}
                  >
                    {isValid ? t`Add` : errorMessage}
                  </Button>
                </Box>
              </MainCard>
              {positionLoading && (
                <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                  <Loading loading={positionLoading} mask />
                </Box>
              )}
            </Box>
          </Grid>

          {confirmModalShow && !!position && (
            <ConfirmAddLiquidity
              onConfirm={submit}
              onCancel={handleCancel}
              open={confirmModalShow}
              position={position}
            />
          )}
        </Box>
      )}
    </Identity>
  );
});
