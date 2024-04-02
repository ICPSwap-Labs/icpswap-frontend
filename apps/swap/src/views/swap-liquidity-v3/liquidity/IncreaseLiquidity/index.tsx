import { ReactChild, useMemo, useCallback, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MainCard } from "components/index";
import HeaderTab from "components/swap/Header";
import DepositAmount from "components/swap/SwapDepositAmount";
import { FIELD } from "constants/swap";
import { useMintState, useMintHandlers, useMintInfo, useResetMintState } from "store/swap/liquidity/hooks";
import { usePosition } from "hooks/swap/usePosition";
import ConfirmAddLiquidity from "components/swap/AddLiquidityConfirmModal";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { NONE_TOKEN_SYMBOL } from "constants/index";
import Loading from "components/Loading/Static";
import { parseTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { Token } from "@icpswap/swap-sdk";
import { isDarkTheme, toSignificantFormatted } from "utils/index";
import { Trans, t } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import { useAccountPrincipal } from "store/auth/hooks";
import { Theme } from "@mui/material/styles";
import LiquidityInfo from "components/swap/LiquidityInfo";
import Button from "components/authentication/ButtonConnector";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import { actualAmountToPool } from "utils/token/index";
import { useIncreaseLiquidityCall } from "hooks/swap/useIncreaseLiquidity";
import StepViewButton from "components/Steps/View";
import { ExternalTipArgs } from "types/index";
import { ReclaimTips } from "components/ReclaimTips";
import { maxAmountFormat } from "utils/swap";

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

export default function IncreaseLiquidity() {
  const classes = useStyle();
  const history = useHistory();
  const { positionId: _positionId, pool: poolId } = useParams<{ positionId: string; pool: string }>();
  const positionId = BigInt(_positionId);
  const { result: _position, loading: positionRequestLoading } = usePositionDetailsFromId(poolId, _positionId);
  const { position: existingPosition, loading: usePositionLoading } = usePosition({
    poolId,
    tickLower: _position?.tickLower,
    tickUpper: _position?.tickUpper,
    liquidity: _position?.liquidity,
  });

  const principal = useAccountPrincipal();
  const positionLoading = usePositionLoading || positionRequestLoading;

  const currency0 = existingPosition?.pool.token0;
  const currency1 = existingPosition?.pool.token1;

  const baseCurrency = useMemo(() => currency0, [currency0]);
  const isSorted = currency0 ? baseCurrency?.equals(currency0) : false;
  const quoteCurrency = isSorted ? currency1 : currency0;

  const { independentField, typedValue } = useMintState();
  const {
    dependentField,
    parsedAmounts,
    currencyBalances,
    position,
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
  );

  const { onFieldAInput, onFieldBInput } = useMintHandlers();

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

  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  const resetMintState = useResetMintState();

  const loadLiquidityPage = useCallback(() => {
    resetMintState();
    history.push("/swap/liquidity");
  }, [history, resetMintState]);

  const increaseLiquidityCall = useIncreaseLiquidityCall();

  const handleConfirm = useCallback(async () => {
    if (!principal) return;

    if (position) {
      const { call, key } = increaseLiquidityCall({
        poolId,
        position,
        positionId,
        openExternalTip: ({ message, tipKey }: ExternalTipArgs) => {
          openErrorTip(<ReclaimTips message={message} tipKey={tipKey} />);
        },
      });

      setConfirmModalShow(false);

      const { token0 } = position.pool;
      const { token1 } = position.pool;

      const amount0Desired = actualAmountToPool(token0, position.mintAmounts.amount0.toString());
      const amount1Desired = actualAmountToPool(token1, position.mintAmounts.amount1.toString());

      const loadingTipKey = openLoadingTip(
        t`Add ${toSignificantFormatted(
          parseTokenAmount(amount0Desired, position.pool.token0.decimals).toString(),
          8,
        )} ${position.pool.token0.symbol} and ${toSignificantFormatted(
          parseTokenAmount(amount1Desired, position.pool.token1.decimals).toString(),
          8,
        )} ${position.pool.token1.symbol}`,
        {
          extraContent: <StepViewButton step={key} />,
        },
      );

      const result = await call();

      if (result) {
        loadLiquidityPage();
      }

      closeLoadingTip(loadingTipKey);
    }
  }, [position, poolId, positionId]);

  const handleCurrencyAMax = () => {
    const currencyAAmount = maxAmounts[FIELD.CURRENCY_A];
    if (!currencyAAmount) return;
    onFieldAInput(maxAmountFormat(currencyAAmount.toExact(), currencyAAmount.currency.decimals));
  };

  const handleCurrencyBMax = () => {
    const currencyAmount = maxAmounts[FIELD.CURRENCY_B];
    if (!currencyAmount) return;
    onFieldBInput(maxAmountFormat(currencyAmount.toExact(), currencyAmount.currency.decimals));
  };

  return (
    <Identity onSubmit={handleConfirm}>
      {({ submit, loading }: CallbackProps) => (
        <Box sx={{ position: "relative" }}>
          <Grid container justifyContent="center">
            <Box sx={{ width: "100%", maxWidth: "612px", position: "relative" }}>
              <MainCard level={1} className={`${classes.container} lightGray200`}>
                <HeaderTab
                  title="Add Liquidity"
                  showArrow
                  showUserSetting
                  slippageType="mint"
                  onBack={loadLiquidityPage}
                />

                <Box mt="20px">
                  <LiquidityInfo position={existingPosition} positionId={positionId} />
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
                      showMaxButton={
                        !atMaxAmounts[FIELD.CURRENCY_A] &&
                        new BigNumber(maxAmounts[FIELD.CURRENCY_A]?.toExact() ?? 0).isGreaterThan(0)
                      }
                      onMax={handleCurrencyAMax}
                    />
                    <Box mt="16px">
                      <DepositAmount
                        currency={quoteCurrency ?? undefined}
                        onUserInput={onFieldBInput}
                        value={formattedAmounts[FIELD.CURRENCY_B]}
                        locked={depositBDisabled}
                        type="addLiquidity"
                        currencyBalance={currencyBalances?.[FIELD.CURRENCY_B]}
                        showMaxButton={
                          !atMaxAmounts[FIELD.CURRENCY_B] &&
                          new BigNumber(maxAmounts[FIELD.CURRENCY_B]?.toExact() ?? 0).isGreaterThan(0)
                        }
                        onMax={handleCurrencyBMax}
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
}
