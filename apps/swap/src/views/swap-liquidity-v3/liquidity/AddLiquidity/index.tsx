/* eslint-disable prefer-const */
import { useState, useCallback, useMemo, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Box, Typography, makeStyles, Theme, useTheme, Button } from "components/Mui";
import { FeeSelector, CurrencySelector, SwapDepositAmount, Reclaim, AddLiquidityButton } from "components/swap/index";
import {
  useMintState,
  useMintHandlers,
  useMintInfo,
  useRangeCallbacks,
  useResetMintState,
} from "store/swap/liquidity/hooks";
import { UseCurrencyState, useToken } from "hooks/useCurrency";
import { Bound, DEFAULT_FEE, DEFAULT_SWAP_INPUT_ID, DEFAULT_SWAP_OUTPUT_ID, FIELD } from "constants/swap";
import ConfirmAddLiquidity from "components/swap/AddLiquidityConfirmModal";
import { useErrorTip, useLoadingTip } from "hooks/useTips";
import { isDarkTheme } from "utils/index";
import { maxAmountFormat } from "utils/swap";
import { BigNumber, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import { TokenInfo } from "types/token";
import { useAddLiquidityCall } from "hooks/swap/useAddLiquidity";
import StepViewButton from "components/Steps/View";
import { ExternalTipArgs } from "types/index";
import { ReclaimTips } from "components/ReclaimTips";
import { usePCMMetadata, useParsedQueryString, useUserPCMBalance } from "@icpswap/hooks";
import { InfoPool, PriceRange } from "components/liquidity/index";
import { Flex } from "@icpswap/ui";
import { ICP, ICS } from "@icpswap/tokens";
import { ADD_LIQUIDITY_REFRESH_KEY } from "constants/index";
import { useRefreshTrigger } from "hooks/index";
import { Wrapper } from "components/index";
import { ArrowLeft } from "react-feather";

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
  const theme = useTheme();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openErrorTip] = useErrorTip();

  let { currencyIdA, currencyIdB, feeAmount: feeAmountFromUrl } = useParams<URLParams>();
  const { path: backPath } = useParsedQueryString() as { path: string };

  if (!currencyIdA) currencyIdA = DEFAULT_SWAP_INPUT_ID;
  if (!currencyIdB) currencyIdB = DEFAULT_SWAP_OUTPUT_ID;

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const refreshTrigger = useRefreshTrigger(ADD_LIQUIDITY_REFRESH_KEY);

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
    token0SubAccountBalance,
    token1SubAccountBalance,
    unusedBalance,
    token0Balance,
    token1Balance,
  } = useMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    undefined,
    undefined,
    refreshTrigger,
  );

  const isValid = !errorMessage && !invalidRange;

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks;

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toExact() ?? "",
  };

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useMintHandlers();

  const resetMintState = useResetMintState();

  const loadToPage = useCallback(() => {
    resetMintState();

    if (backPath) {
      try {
        const path = window.atob(backPath);
        history.push(path);
      } catch (error) {
        console.warn(error);
      }
    } else {
      history.goBack();
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

  const handleTokenChange = useCallback(
    (token: TokenInfo, isTokenA: boolean) => {
      const tokenId = token.canisterId.toString();
      let path = "";

      if (isTokenA) {
        if (tokenId === currencyIdB || !currencyIdB) {
          path = `/liquidity/add/${tokenId}`;
        } else {
          path = `/liquidity/add/${tokenId}/${currencyIdB}`;
        }

        handleUrlChange(path);
        return;
      }

      if (tokenId === currencyIdA || !currencyIdA) {
        path = `/liquidity/add/${tokenId}`;
      } else {
        path = `/liquidity/add/${currencyIdA}/${tokenId}`;
      }

      handleUrlChange(path);
    },
    [handleUrlChange],
  );

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

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
    getRangeByPercent,
  } = useRangeCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool);

  const isValidPair = currencyIdA && currencyIdB && currencyIdA !== currencyIdB;

  const handleOnAdd = useCallback(() => {
    setConfirmModalShow(true);
  }, []);

  const { result: pcmMetadata } = usePCMMetadata();
  const { result: userPCMBalance } = useUserPCMBalance(principal);

  const [, pcmToken] = useToken(pcmMetadata?.tokenCid.toString());
  const getAddLiquidityCall = useAddLiquidityCall();

  const handleOnConfirm = useCallback(async () => {
    // token0SubAccountBalance, token1SubAccountBalance, unusedBalance is undefined when pool is not created
    // So set the value is 0 by default
    // TODO: Fix this?
    if (
      isNullArgs(position) ||
      isNullArgs(principal) ||
      isNullArgs(pcmMetadata) ||
      isNullArgs(pcmToken) ||
      isNullArgs(userPCMBalance) ||
      isNullArgs(token0Balance) ||
      isNullArgs(token1Balance) ||
      isNullArgs(token0SubAccountBalance) ||
      isNullArgs(token1SubAccountBalance) ||
      isNullArgs(unusedBalance)
    )
      return;

    const needPayForPCM = userPCMBalance < pcmMetadata.passcodePrice;

    const { call, key } = await getAddLiquidityCall({
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      unusedBalance,
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

    resetMintState();
    history.push(`/liquidity?tab=Positions`);
  }, [
    position,
    principal,
    pcmMetadata,
    pcmToken,
    userPCMBalance,
    token0Balance,
    token1Balance,
    token0SubAccountBalance,
    token1SubAccountBalance,
    unusedBalance,
    noLiquidity,
  ]);

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

  const handleByToken = useCallback(
    (address: string) => {
      let input: string = address;
      let output: string = address;

      if (address === ICP.address) {
        input = ICS.address;
        output = ICP.address;
      } else {
        input = ICP.address;
        output = address;
      }

      history.push(`/swap?input=${input}&output=${output}`);
    },
    [history],
  );

  useEffect(() => {
    return () => {
      resetMintState();
    };
  }, []);

  return (
    <Wrapper>
      <Flex fullWidth justify="center">
        <Box className={classes.container}>
          <Flex justify="space-between">
            <ArrowLeft
              style={{
                cursor: "pointer",
              }}
              onClick={loadToPage}
            />

            <Typography variant="h3" color="textPrimary" align="center">
              <Trans>Add Liquidity</Trans>
            </Typography>

            <Typography sx={{ cursor: "pointer" }} color="secondary" component="span" onClick={clearAll}>
              <Trans>clear all</Trans>
            </Typography>
          </Flex>

          <Box sx={{ margin: "32px 0 0 0" }}>
            <InfoPool pool={pool} />
          </Box>

          <Box
            sx={{
              paddingTop: "24px",
              display: "grid",
              gap: "24px 48px",
              gridTemplateRows: "138px auto",
              gridTemplateColumns: "1fr 1fr",
              "@media(max-width: 960px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            <Box
              sx={{
                gridArea: "1 / 1 / 2 /2",
              }}
            >
              <Typography variant="h4" color="textPrimary">
                <Trans>Select Pair</Trans>
              </Typography>

              <Flex gap="0 12px" sx={{ margin: "12px 0 0 0" }}>
                <Flex sx={{ flex: "50%" }}>
                  <Box sx={{ width: "100%" }}>
                    <CurrencySelector
                      currencyId={currencyIdA}
                      onChange={(token: TokenInfo) => handleTokenChange(token, true)}
                      loading={useCurrencyALoading === UseCurrencyState.LOADING}
                      disabledCurrency={[...(baseCurrency ? [baseCurrency] : [])]}
                    />
                  </Box>
                </Flex>
                <Flex sx={{ flex: "50%" }}>
                  <Box sx={{ width: "100%" }}>
                    <CurrencySelector
                      currencyId={currencyIdB}
                      onChange={(token: TokenInfo) => handleTokenChange(token, false)}
                      loading={useCurrencyBLoading === UseCurrencyState.LOADING}
                      disabledCurrency={[...(quoteCurrency ? [quoteCurrency] : [])]}
                    />
                  </Box>
                </Flex>
              </Flex>

              <Box mt={2} sx={!isValidPair ? DISABLED_STYLE : {}}>
                <FeeSelector
                  defaultActiveFee={feeAmount}
                  onSelect={handleFeeChange}
                  currencyA={baseCurrency}
                  currencyB={quoteCurrency}
                />
              </Box>
            </Box>

            <Flex
              vertical
              align="flex-start"
              gap="12px 0"
              fullWidth
              sx={{
                gridArea: "2 / 1 / auto / auto",
                ...(isDepositAmountDisabled ? DISABLED_STYLE : {}),
                "@media(max-width: 960px)": {
                  gridArea: "3 / 1 / auto / 1",
                },
              }}
            >
              <Typography variant="h4" color="textPrimary">
                <Trans>Deposit Amounts</Trans>
              </Typography>

              <SwapDepositAmount
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

              <SwapDepositAmount
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

              {!noLiquidity ? (
                <Box
                  sx={{
                    padding: "16px",
                    background: theme.palette.background.level3,
                    borderRadius: "12px",
                    width: "100%",
                  }}
                >
                  <Reclaim
                    fontSize="12px"
                    pool={pool}
                    bg1={theme.palette.background.level2}
                    keepInPool={false}
                    refreshKey={ADD_LIQUIDITY_REFRESH_KEY}
                  />
                </Box>
              ) : null}

              {nonNullArgs(baseCurrency) && nonNullArgs(quoteCurrency) && !noLiquidity ? (
                <Flex
                  fullWidth
                  sx={{
                    gap: "0 16px",
                  }}
                >
                  <Button
                    className="secondary"
                    variant="outlined"
                    fullWidth
                    onClick={() => handleByToken(baseCurrency.address)}
                  >
                    <Trans>Buy {baseCurrency.symbol}</Trans>
                  </Button>
                  <Button
                    className="secondary"
                    variant="outlined"
                    fullWidth
                    onClick={() => handleByToken(quoteCurrency.address)}
                  >
                    <Trans>Buy {quoteCurrency.symbol}</Trans>
                  </Button>
                </Flex>
              ) : null}

              <Box
                sx={{
                  width: "100%",
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
            </Flex>

            <Box
              sx={{
                gridArea: "1 / 2 / 3 / auto",
                height: "fit-content",
                "@media(max-width: 960px)": {
                  gridArea: "2 / 1 / 3 / auto",
                },
                ...(!isValidPair ? DISABLED_STYLE : {}),
              }}
            >
              <PriceRange
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
                getRangeByPercent={getRangeByPercent}
              />
              <Box
                mt={2}
                sx={{
                  "@media(max-width:960px)": {
                    display: "none",
                  },
                }}
              >
                <AddLiquidityButton size="large" disabled={!isValid} error={errorMessage} onClick={handleOnAdd} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>

      {confirmModalShow && !!position && (
        <ConfirmAddLiquidity
          onConfirm={handleOnConfirm}
          onCancel={handleOnCancel}
          open={confirmModalShow}
          position={position}
        />
      )}
    </Wrapper>
  );
}
