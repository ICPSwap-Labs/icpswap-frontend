import { ReactNode, useCallback, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Typography, Box, makeStyles, Theme } from "components/Mui";
import { MainCard, Wrapper, AuthButton } from "components/index";
import HeaderTab from "components/swap/Header";
import { SwapDepositAmount } from "components/swap/index";
import { FIELD, INCREASE_LIQUIDITY_REFRESH_KEY, NONE_TOKEN_SYMBOL } from "constants/index";
import { useMintState, useMintHandlers, useMintInfo, useResetMintState } from "store/swap/liquidity/hooks";
import { usePosition } from "hooks/swap/usePosition";
import { AddLiquidityConfirmModal } from "components/swap/AddLiquidityConfirmModal";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { isUndefinedOrNull, parseTokenAmount, toSignificantWithGroupSeparator, BigNumber } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { isDarkTheme } from "utils/index";
import { useAccountPrincipal } from "store/auth/hooks";
import LiquidityInfo from "components/swap/LiquidityInfo";
import { usePositionDetailsFromId } from "hooks/swap/v3Calls";
import { useIncreaseLiquidityCall } from "hooks/swap/useIncreaseLiquidity";
import StepViewButton from "components/Steps/View";
import { ExternalTipArgs } from "types/index";
import { ReclaimTips } from "components/ReclaimTips";
import { maxAmountFormat } from "utils/swap";
import { useRefreshTrigger } from "hooks/index";
import { Flex, LoadingRow } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { ReclaimTokensInPool } from "components/swap/reclaim/Reclaim";
import { ToReclaim } from "components/swap/reclaim/ToReclaim";
import { useParsedUrlPath } from "@icpswap/hooks";

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

interface PriceRangeProps {
  label: ReactNode;
  value: ReactNode;
  currencyA: Token | undefined;
  currencyB: Token | undefined;
}

export function PriceRange({ label, value, currencyA, currencyB }: PriceRangeProps) {
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
  const { t } = useTranslation();
  const classes = useStyle();
  const history = useHistory();

  const refreshTrigger = useRefreshTrigger(INCREASE_LIQUIDITY_REFRESH_KEY);

  const { positionId, pool: poolId } = useParams<{ positionId: string; pool: string }>();
  const { path } = useParsedUrlPath();

  const { result: _position, loading: positionRequestLoading } = usePositionDetailsFromId(poolId, positionId);
  const { position: existingPosition, loading: usePositionLoading } = usePosition({
    poolId,
    tickLower: _position?.tickLower,
    tickUpper: _position?.tickUpper,
    liquidity: _position?.liquidity,
  });

  const principal = useAccountPrincipal();
  const positionLoading = usePositionLoading || positionRequestLoading;

  const token0 = existingPosition?.pool.token0;
  const token1 = existingPosition?.pool.token1;

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
    pool,
    token0Balance,
    token1Balance,
    token0SubAccountBalance,
    token1SubAccountBalance,
    unusedBalance,
  } = useMintInfo(token0, token1, existingPosition?.pool.fee, token0, existingPosition, undefined, refreshTrigger);

  const { onFieldAInput, onFieldBInput } = useMintHandlers();

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const isValid = !errorMessage && !invalidRange;

  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const handleCancel = useCallback(() => {
    setConfirmModalShow(false);
  }, [setConfirmModalShow]);

  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  const resetMintState = useResetMintState();

  const loadLiquidityPage = useCallback(() => {
    resetMintState();

    if (path) {
      history.push(path);
    } else {
      history.goBack();
    }
  }, [history, resetMintState, path]);

  const increaseLiquidityCall = useIncreaseLiquidityCall();

  const handleIncreaseLiquidity = useCallback(async () => {
    if (
      isUndefinedOrNull(position) ||
      isUndefinedOrNull(principal) ||
      isUndefinedOrNull(unusedBalance) ||
      isUndefinedOrNull(token0SubAccountBalance) ||
      isUndefinedOrNull(token1SubAccountBalance) ||
      isUndefinedOrNull(token0Balance) ||
      isUndefinedOrNull(token1Balance)
    )
      return;

    const { call, key } = increaseLiquidityCall({
      poolId,
      position,
      positionId,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      unusedBalance,
      openExternalTip: ({ message, tipKey, poolId, tokenId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} tokenId={tokenId} poolId={poolId} />);
      },
    });

    setConfirmModalShow(false);

    const { token0, token1 } = position.pool;

    const amount0Desired = position.mintAmounts.amount0.toString();
    const amount1Desired = position.mintAmounts.amount1.toString();

    const loadingTipKey = openLoadingTip(
      t("liquidity.add.tokens", {
        token0: `${toSignificantWithGroupSeparator(parseTokenAmount(amount0Desired, token0.decimals).toString(), 8)} ${
          token0.symbol
        }`,
        token1: `${toSignificantWithGroupSeparator(parseTokenAmount(amount1Desired, token1.decimals).toString(), 8)} ${
          token1.symbol
        }`,
      }),
      {
        extraContent: <StepViewButton step={key} />,
      },
    );

    const result = await call();

    if (result) {
      loadLiquidityPage();
    }

    closeLoadingTip(loadingTipKey);
  }, [position, poolId, positionId, token0SubAccountBalance, token1SubAccountBalance, unusedBalance]);

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
    <Wrapper>
      <Box sx={{ position: "relative" }}>
        <Grid container justifyContent="center">
          <Box sx={{ width: "100%", maxWidth: "612px", position: "relative" }}>
            <MainCard level={1} className={`${classes.container} lightGray200`}>
              {positionLoading === false ? (
                <>
                  <HeaderTab
                    title={t("common.increase.liquidity")}
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
                      {t("liquidity.increase.more")}
                    </Typography>

                    <Box mt="12px">
                      <SwapDepositAmount
                        noLiquidity={false}
                        currency={token0}
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
                        unusedBalance={
                          token0 && pool
                            ? token0.address === pool.token0.address
                              ? unusedBalance.balance0
                              : unusedBalance.balance1
                            : undefined
                        }
                        subAccountBalance={
                          token0 && pool
                            ? token0.address === pool.token0.address
                              ? token0SubAccountBalance
                              : token1SubAccountBalance
                            : undefined
                        }
                        maxSpentAmount={maxAmounts[FIELD.CURRENCY_A]?.toExact()}
                        poolId={pool?.id}
                      />
                      <Box mt="16px">
                        <SwapDepositAmount
                          noLiquidity={false}
                          currency={token1}
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
                          unusedBalance={
                            token1 && pool
                              ? token1.address === pool.token0.address
                                ? unusedBalance.balance0
                                : unusedBalance.balance1
                              : undefined
                          }
                          subAccountBalance={
                            token1 && pool
                              ? token1.address === pool.token0.address
                                ? token0SubAccountBalance
                                : token1SubAccountBalance
                              : undefined
                          }
                          maxSpentAmount={maxAmounts[FIELD.CURRENCY_B]?.toExact()}
                          poolId={pool?.id}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {pool ? (
                    <Flex vertical gap="12px 0" sx={{ margin: "12px 0 0 0" }}>
                      <ReclaimTokensInPool
                        pool={pool}
                        refreshKey={INCREASE_LIQUIDITY_REFRESH_KEY}
                        background="level3"
                        borderRadius="12px"
                      />

                      <ToReclaim poolId={pool.id} background={3} borderRadius="12px" />
                    </Flex>
                  ) : null}

                  <Box sx={{ margin: "20px 0 0 0" }}>
                    <AuthButton
                      fullWidth
                      variant="contained"
                      disabled={!isValid}
                      size="large"
                      onClick={() => setConfirmModalShow(true)}
                    >
                      {isValid ? t("common.add") : errorMessage}
                    </AuthButton>
                  </Box>
                </>
              ) : null}

              {positionLoading && (
                <Box sx={{ width: "100%", height: "100%", minHeight: "570px" }}>
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
                    <div />
                    <div />
                  </LoadingRow>
                </Box>
              )}
            </MainCard>
          </Box>
        </Grid>

        {confirmModalShow && !!position && (
          <AddLiquidityConfirmModal
            onConfirm={handleIncreaseLiquidity}
            onCancel={handleCancel}
            open={confirmModalShow}
            position={position}
            loading={false}
          />
        )}
      </Box>
    </Wrapper>
  );
}
