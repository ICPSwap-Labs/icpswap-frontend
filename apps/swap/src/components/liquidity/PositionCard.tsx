import { useState, useCallback, useMemo, useEffect } from "react";
import { Typography, useMediaQuery, Box, makeStyles, useTheme, Theme } from "components/Mui";
import { CurrenciesAvatar } from "components/CurrenciesAvatar";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { BigNumber, formatDollarAmount, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { CurrencyAmount, Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { isDarkTheme } from "utils/index";
import { Loading } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { usePositionContext, PositionRangeState, PoolCurrentPrice } from "components/swap/index";
import { FeeTierPercentLabel, Flex } from "@icpswap/ui";
import { encodePositionKey, PositionState } from "utils/swap/index";
import { PositionFilterState, PositionSort } from "types/swap";
import { usePositionState } from "hooks/liquidity";
import { LimitLabel } from "components/swap/limit-order/index";
import { useTranslation } from "react-i18next";
import { TokenPairName } from "components/TokenPairName";
import { LiquidityStateFlag } from "components/liquidity/LiquidityStateFlag";
import { PositionDetails } from "components/liquidity/PositionDetails";

const useStyle = makeStyles((theme: Theme) => ({
  wrapper: {
    width: "100%",
    position: "relative",
    backgroundColor: theme.palette.background.level1,
    borderRadius: `12px`,
    padding: "16px 24px",
    margin: "8px 0 0 0",
    cursor: "pointer",
    overflow: "hidden",

    "&:first-child": {
      marginTop: "0",
    },

    [theme.breakpoints.down("md")]: {
      padding: "16px 24px",
    },

    "@media(max-width: 640px)": {
      margin: "12px 0 0 0",
      padding: "16px 12px",
    },
  },

  item: {
    flexDirection: "column",
    gap: "8px 0",
    alignItems: "flex-start",
    "@media(max-width: 640px)": {
      flexDirection: "row",
      gap: "0 4px",
      alignItems: "center",
    },
  },

  label: {
    width: "fit-content",
    fontSize: "12px",
    textAlign: "left",
    whiteSpace: "nowrap",
    "@media(min-width: 640px)": {
      width: "100%",
      justifyContent: "flex-end",
      textAlign: "right",
    },
  },
}));

export interface PositionCardProps {
  positionId: bigint;
  showButtons?: boolean;
  position: Position | undefined;
  farmId?: string | undefined;
  staked?: boolean; // The position is staked or not
  filterState: PositionFilterState;
  sort: PositionSort;
  isLimit: boolean | undefined;
  fee: { fee0: bigint; fee1: bigint } | undefined;
}

export function PositionCard({
  position,
  showButtons,
  positionId,
  farmId,
  staked,
  filterState,
  isLimit,
  fee,
}: PositionCardProps) {
  const { t } = useTranslation();
  const classes = useStyle();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [detailShow, setDetailShow] = useState<boolean | undefined>(undefined);
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { setAllPositionsUSDValue, setHiddenNumbers } = usePositionContext();

  const handleToggleShow = useCallback(() => {
    if (!position) return;
    setDetailShow(!detailShow);
  }, [detailShow, setDetailShow, position]);

  const pool = position?.pool;
  const { token0, token1, fee: feeAmount } = pool || {};

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { base } = useInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: manuallyInverted,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const positionKey = useMemo(() => {
    if (!position) return undefined;
    return encodePositionKey(position, positionId);
  }, [position, positionId]);

  const positionState = usePositionState(position);

  const token0USDPrice = useUSDPriceById(position?.pool.token0.address);
  const token1USDPrice = useUSDPriceById(position?.pool.token1.address);

  const totalUSDValue = useMemo(() => {
    if (!position || !token0USDPrice || !token1USDPrice) return undefined;

    const totalUSD = new BigNumber(token0USDPrice)
      .multipliedBy(position.amount0.toExact())
      .plus(new BigNumber(token1USDPrice).multipliedBy(position.amount1.toExact()));

    return totalUSD.toString();
  }, [position, token0USDPrice, token1USDPrice]);

  const { fee0: feeAmount0, fee1: feeAmount1 } = useMemo(() => {
    if (!fee) return { fee0: undefined, fee1: undefined };
    return fee;
  }, [fee]);

  const { currencyFeeAmount0, currencyFeeAmount1 } = useMemo(() => {
    if (
      isUndefinedOrNull(token0) ||
      isUndefinedOrNull(token1) ||
      isUndefinedOrNull(feeAmount0) ||
      isUndefinedOrNull(feeAmount1)
    )
      return {};

    const currencyFeeAmount0 = CurrencyAmount.fromRawAmount(token0, feeAmount0.toString());
    const currencyFeeAmount1 = CurrencyAmount.fromRawAmount(token1, feeAmount1.toString());

    return {
      currencyFeeAmount0,
      currencyFeeAmount1,
    };
  }, [feeAmount0, feeAmount1, token0, token1]);

  const feeUSDValue = useMemo(() => {
    if (
      isUndefinedOrNull(currencyFeeAmount0) ||
      isUndefinedOrNull(currencyFeeAmount1) ||
      isUndefinedOrNull(token0USDPrice) ||
      isUndefinedOrNull(token1USDPrice)
    )
      return undefined;

    return new BigNumber(currencyFeeAmount0.toExact())
      .multipliedBy(token0USDPrice)
      .plus(new BigNumber(currencyFeeAmount1.toExact()).multipliedBy(token1USDPrice))
      .toString();
  }, [currencyFeeAmount0, currencyFeeAmount1, token0USDPrice, token1USDPrice]);

  useEffect(() => {
    if (nonUndefinedOrNull(totalUSDValue) && nonUndefinedOrNull(positionKey) && isLimit === false) {
      setAllPositionsUSDValue(positionKey, new BigNumber(totalUSDValue));
    }
  }, [totalUSDValue, positionKey, staked, isLimit]);

  const displayByFilter = useMemo(() => {
    if (isUndefinedOrNull(positionState) || isUndefinedOrNull(isLimit)) return true;
    if (isLimit) return false;

    switch (filterState) {
      case PositionFilterState.All:
        return true;
      case PositionFilterState.Default:
        return positionState !== PositionState.CLOSED;
      case PositionFilterState.Closed:
        return positionState === PositionState.CLOSED;
      case PositionFilterState.OutOfRanges:
        return positionState === PositionState.OutOfRange;
      case PositionFilterState.InRanges:
        return positionState !== PositionState.CLOSED && positionState !== PositionState.OutOfRange;
      default:
        return true;
    }
  }, [positionState, filterState, isLimit]);

  useEffect(() => {
    if (positionKey) {
      setHiddenNumbers(`${positionKey}_YOUR`, !displayByFilter);
    }
  }, [displayByFilter, setHiddenNumbers, positionKey]);

  return (
    <Box
      className={classes.wrapper}
      sx={{
        display: displayByFilter ? "block" : "none",
      }}
    >
      <LiquidityStateFlag position={position} />

      <Flex
        justify="space-between"
        fullWidth
        onClick={() => {
          handleToggleShow();
        }}
        sx={{
          userSelect: "none",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "18px 0",
          },
        }}
      >
        {!position && <Loading loading={!position} circularSize={28} />}

        <Flex gap="0 8px">
          <CurrenciesAvatar
            currencyA={currencyBase}
            currencyB={currencyQuote}
            borderColor={isDarkTheme(theme) ? "rgba(189, 200, 240, 0.4)" : "rgba(255, 255, 255, 0.4)"}
            bgColor={isDarkTheme(theme) ? "#273155" : "#DADADA"}
            size="28px"
          />

          <TokenPairName
            symbol0={currencyBase?.symbol}
            symbol1={currencyQuote?.symbol}
            width="178px"
            sx={{
              fontSize: "18px",
              color: "text.primary",
            }}
          />

          <FeeTierPercentLabel feeTier={feeAmount} />

          {isLimit ? (
            <Flex gap="0 4px">
              <LimitLabel />
            </Flex>
          ) : null}
        </Flex>

        <Flex
          gap="0 32px"
          sx={{
            "@media(max-width: 640px)": {
              gap: "14px 0",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            },
          }}
        >
          <Flex
            className={classes.item}
            sx={{
              width: "fit-content",
              justifyContent: "flex-start",
              "@media(min-width: 640px)": {
                width: "280px",
                justifyContent: "flex-end",
              },
            }}
          >
            <Typography className={classes.label}>{t("common.current.price")}</Typography>

            <Flex
              gap="0 4px"
              fullWidth
              justify="flex-end"
              sx={{
                "@media(max-width: 640px)": { width: "fit-content" },
              }}
            >
              <PoolCurrentPrice
                pool={pool}
                showInverted
                fontSize="14px"
                usdValueColor="text.primary"
                symbolColor="text.primary"
                showUsdValue={false}
              />
            </Flex>
          </Flex>

          {positionState !== PositionState.CLOSED ? (
            <Flex
              className={classes.item}
              justify="flex-end"
              sx={{ width: "80px", "@media(max-width: 640px)": { width: "fit-content" } }}
            >
              <Typography className={classes.label}>{t("common.value")}</Typography>

              <Flex
                justify="flex-end"
                fullWidth
                sx={{
                  "@media(max-width: 640px)": { width: "fit-content" },
                }}
              >
                <Typography color="text.primary">{totalUSDValue ? formatDollarAmount(totalUSDValue) : "--"}</Typography>
              </Flex>
            </Flex>
          ) : null}

          <Flex
            className={classes.item}
            justify="flex-end"
            sx={{ width: "110px", "@media(max-width: 640px)": { width: "fit-content" } }}
          >
            <Typography className={classes.label}>{t("common.uncollected.fees")}</Typography>

            <Flex
              fullWidth
              justify="flex-end"
              sx={{
                "@media(max-width: 640px)": { width: "fit-content" },
              }}
            >
              <Typography color="text.primary">{feeUSDValue ? formatDollarAmount(feeUSDValue) : "--"}</Typography>
            </Flex>
          </Flex>

          <PositionRangeState state={positionState} width="110px" />

          {matchDownMD ? (
            <Flex
              sx={{
                "@media(max-width: 640px)": {
                  width: "100%",
                  justifyContent: "center",
                  visibility: detailShow ? "hidden" : "visible",
                  height: detailShow ? "0px" : "auto",
                },
              }}
            >
              <Typography
                sx={{
                  display: "none",
                  fontSize: "12px",
                  "@media(max-width: 640px)": {
                    display: "block",
                  },
                }}
                color="text.theme-secondary"
              >
                {t("common.details")}
              </Typography>

              {detailShow ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown
                  sx={{
                    color: matchDownMD ? theme.palette.text["theme-secondary"] : theme.palette.text.secondary,
                  }}
                />
              )}
            </Flex>
          ) : (
            <Flex
              sx={{
                justifyContent: "flex-end",
              }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleToggleShow();
              }}
            >
              {detailShow ? (
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    background: theme.palette.background.level4,
                    borderRadius: "50%",
                  }}
                >
                  <KeyboardArrowUp />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    background: theme.palette.background.level4,
                    borderRadius: "50%",
                  }}
                >
                  <KeyboardArrowDown
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  />
                </Box>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>

      <Box sx={{ display: detailShow === true ? "block" : "none" }}>
        <PositionDetails
          farmId={farmId}
          position={position}
          positionId={positionId}
          showButtons={showButtons}
          manuallyInverted={manuallyInverted}
          setManuallyInverted={setManuallyInverted}
          show={detailShow}
          token0USDPrice={token0USDPrice}
          token1USDPrice={token1USDPrice}
          positionKey={positionKey}
          feeUSDValue={feeUSDValue}
          feeAmount0={currencyFeeAmount0}
          feeAmount1={currencyFeeAmount1}
          onHide={() => setDetailShow(false)}
          staked={staked}
          state={positionState}
          isLimit={isLimit}
        />
      </Box>
    </Box>
  );
}
