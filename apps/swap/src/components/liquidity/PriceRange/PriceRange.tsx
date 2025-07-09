import { memo, useState, useMemo, useCallback } from "react";
import { Box, Typography, makeStyles, useTheme, Theme } from "components/Mui";
import { Token, Price, Pool } from "@icpswap/swap-sdk";
import { Bound, FeeAmount, ZOOM_LEVEL_INITIAL_MIN_MAX } from "constants/swap";
import { MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { TokenToggle } from "components/TokenToggle";
import { isDarkTheme } from "utils/index";
import { NumberTextField } from "components/index";
import { Flex } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { Null, ChartTimeEnum } from "@icpswap/types";
import { usePoolPricePeriodRange } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";
import PriceRangeChart from "components/liquidity/PriceRangeChart";
import { FullRangeWarning } from "components/liquidity/FullRangeWarning";
import { PriceRangeSelector } from "components/liquidity/PriceRangeSelector";
import { RangeButton } from "components/liquidity/RangeButton";
import { PriceRangeChartTimeButtons } from "components/liquidity/PriceRangeChartTimeButtons";
import { PriceRangeLabel } from "components/liquidity/PriceRangeLabel";
import { CurrentPriceLabelForChart } from "components/liquidity/CurrentPriceLabelForChart";
import { AutoPriceRangeButton } from "components/liquidity/PriceRange/Auto";

const useSetPriceStyle = makeStyles((theme: Theme) => {
  return {
    startPriceDescription: {
      padding: "16px",
      borderRadius: "12px",
      border: `1px solid ${theme.colors.warningDark}`,
      backgroundColor: theme.palette.background.level3,
      ". description": {
        color: theme.colors.warningDark,
        fontSize: "12px",
      },
    },
    startPrice: {
      border: isDarkTheme(theme) ? "1px solid #29314F" : `1px solid ${theme.colors.lightGray200BorderColor}`,
      background: isDarkTheme(theme) ? "transparent" : "#fff",
      borderRadius: "12px",
      height: "51px",
      padding: "0 14px",
    },
    priceRangeInput: {
      position: "relative",
    },
    fullRangeButton: {
      borderRadius: "12px",
      backgroundColor: isDarkTheme(theme) ? theme.colors.darkLevel1 : "#ffffff",
      border: theme.palette.border.gray200,
      color: isDarkTheme(theme) ? theme.palette.grey[700] : theme.colors.lightTextPrimary,
      textTransform: "none",
      "&:hover": {
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.light + 20 : theme.palette.primary.light,
        borderColor: theme.palette.mode === "dark" ? "#29314F" : theme.palette.grey[100],
      },
    },
  };
});

const RANGE_BUTTONS = [
  { value: "5", text: "± 5%" },
  { value: "10", text: "± 10%" },
  { value: "20", text: "± 20%" },
  { value: "50", text: "± 50%" },
  { value: "75", text: "± 75%" },
];

export interface PriceRangeProps {
  onStartPriceInput: (value: string) => void;
  onLeftRangeInput: (value: string) => void;
  onRightRangeInput: (value: string) => void;
  startPrice: string | number | undefined;
  noLiquidity?: boolean;
  priceLower: Price<Token, Token> | undefined;
  priceUpper: Price<Token, Token> | undefined;
  baseCurrency: Token | undefined;
  quoteCurrency: Token | undefined;
  feeAmount: FeeAmount | undefined;
  ticksAtLimit: {
    [Bound.LOWER]: boolean | undefined;
    [Bound.UPPER]: boolean | undefined;
  };
  price: string | number | undefined;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  getSetFullRange: () => void;
  handleTokenToggle: () => void;
  poolLoading?: boolean;
  getRangeByPercent: (value: string | number) => [string, string] | undefined;
  pool: Pool | Null;
}

export const PriceRange = memo(
  ({
    onStartPriceInput,
    onLeftRangeInput,
    onRightRangeInput,
    startPrice,
    noLiquidity,
    priceLower,
    priceUpper,
    baseCurrency,
    quoteCurrency,
    feeAmount,
    ticksAtLimit,
    price,
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
    handleTokenToggle,
    poolLoading,
    getRangeByPercent,
    pool,
  }: PriceRangeProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const classes = useSetPriceStyle();
    const { result: periodPriceRange } = usePoolPricePeriodRange(pool?.id);

    const [chartTime, setChartTime] = useState<ChartTimeEnum>(ChartTimeEnum["7D"]);
    const [fullRangeWaring, setFullRangeWarning] = useState(false);
    const [rangeValue, setRangeValue] = useState<string | null>(null);

    const tokenA = (baseCurrency ?? undefined)?.wrapped;
    const tokenB = (quoteCurrency ?? undefined)?.wrapped;
    const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB);

    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    const isRangePriceDisabled = useMemo(
      () => (noLiquidity && !startPrice) || poolLoading,
      [noLiquidity, startPrice, poolLoading],
    );

    const handleRange = useCallback(
      (rangeValue: string) => {
        setFullRangeWarning(false);
        setRangeValue(rangeValue);

        if (rangeValue !== "FullRange") {
          const range = getRangeByPercent(rangeValue);

          if (range) {
            onLeftRangeInput(range[0]);
            onRightRangeInput(range[1]);
          }
        }
      },
      [setRangeValue, getRangeByPercent],
    );

    const handleIUnderstand = useCallback(() => {
      setFullRangeWarning(true);
      getSetFullRange();
    }, []);

    const handleReset = useCallback(() => {
      if (feeAmount && price) {
        const zoomLevel = ZOOM_LEVEL_INITIAL_MIN_MAX[feeAmount];

        const minPrice = new BigNumber(price).multipliedBy(zoomLevel.min).toString();
        const maxPrice = new BigNumber(price).multipliedBy(zoomLevel.max).toString();

        onLeftRangeInput(minPrice);
        onRightRangeInput(maxPrice);
        setRangeValue(null);
        setFullRangeWarning(false);
      }
    }, [price, ZOOM_LEVEL_INITIAL_MIN_MAX, feeAmount, onLeftRangeInput, onRightRangeInput, setRangeValue]);

    const fullRangeShow = useMemo(() => {
      return rangeValue === "FullRange" && !fullRangeWaring;
    }, [rangeValue, fullRangeWaring]);

    const { poolPriceLower, poolPriceUpper } = useMemo(() => {
      if (isUndefinedOrNull(periodPriceRange)) return {};

      let poolPriceLower: number | string | Null = null;
      let poolPriceUpper: number | string | Null = null;

      if (chartTime === ChartTimeEnum["24H"]) {
        poolPriceLower = periodPriceRange.priceLow24H;
        poolPriceUpper = periodPriceRange.priceHigh24H;
      } else if (chartTime === ChartTimeEnum["7D"]) {
        poolPriceLower = periodPriceRange.priceLow7D;
        poolPriceUpper = periodPriceRange.priceHigh7D;
      } else {
        poolPriceLower = periodPriceRange.priceLow30D;
        poolPriceUpper = periodPriceRange.priceHigh30D;
      }

      if (new BigNumber(poolPriceLower).isEqualTo(0) || new BigNumber(poolPriceUpper).isEqualTo(0)) return {};

      return {
        poolPriceLower: isSorted
          ? poolPriceLower
          : poolPriceLower
          ? poolPriceUpper
            ? new BigNumber(1).dividedBy(poolPriceUpper).toString()
            : null
          : null,
        poolPriceUpper: isSorted
          ? poolPriceUpper
          : poolPriceUpper
          ? poolPriceLower
            ? new BigNumber(1).dividedBy(poolPriceLower).toString()
            : null
          : null,
      };
    }, [periodPriceRange, chartTime, isSorted]);

    return (
      <>
        {noLiquidity && (
          <>
            <Typography variant="h4" color="textPrimary">
              {t("liquidity.set.price")}
            </Typography>
            <Box mt={2}>
              <Box className={classes.startPriceDescription}>
                <Typography color={theme.colors.warningDark} fontSize={12} lineHeight="16px">
                  {t("liquidity.set.price.description")}
                </Typography>
              </Box>
              <Box mt={2}>
                <NumberTextField
                  value={startPrice}
                  fullWidth
                  placeholder="0.0"
                  variant="outlined"
                  numericProps={{
                    allowNegative: false,
                    thousandSeparator: true,
                    decimalScale: 8,
                    maxLength: MAX_SWAP_INPUT_LENGTH,
                  }}
                  onChange={(e) => onStartPriceInput(e.target.value)}
                />
              </Box>
              <Flex sx={{ margin: "16px 0" }} className={classes.startPrice} justify="space-between">
                <Typography sx={{ marginRight: "8px" }}>
                  {t("liquidity.current.token.price", {
                    symbol: tokenSymbolEllipsis({ symbol: baseCurrency?.symbol }),
                  })}
                </Typography>

                <Flex gap="0 4px">
                  <Typography
                    fontWeight={600}
                    color="textPrimary"
                    align="right"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {startPrice ? `${startPrice}` : "- "}
                  </Typography>
                  <Typography fontWeight={600} color="text.primary">
                    {tokenSymbolEllipsis({ symbol: quoteCurrency?.symbol })}
                  </Typography>
                </Flex>
              </Flex>
            </Box>
          </>
        )}
        <Box>
          <Flex justify="space-between">
            <Typography variant="h4" color="text.primary">
              {t("liquidity.set.price.range")}
            </Typography>
            {baseCurrency && quoteCurrency && (
              <Box sx={{ width: "fit-content" }}>
                <TokenToggle currencyA={baseCurrency} currencyB={quoteCurrency} handleToggle={handleTokenToggle} />
              </Box>
            )}
          </Flex>

          <Box
            sx={
              isRangePriceDisabled
                ? {
                    opacity: "0.2",
                    pointerEvents: "none",
                  }
                : {}
            }
          >
            {!noLiquidity && (
              <Box mt={3} sx={{ position: "relative" }}>
                <Flex sx={{ height: "28px" }} fullWidth>
                  <PriceRangeChartTimeButtons time={chartTime} setTime={setChartTime} />
                </Flex>

                <Flex vertical gap="12px 0" sx={{ margin: "16px 0 0 0" }}>
                  <CurrentPriceLabelForChart pool={pool} baseCurrency={baseCurrency} />

                  <PriceRangeLabel
                    poolPriceLower={poolPriceLower}
                    poolPriceUpper={poolPriceUpper}
                    chartTime={chartTime}
                  />
                </Flex>

                <Box mt={3}>
                  <PriceRangeChart
                    priceLower={priceLower}
                    priceUpper={priceUpper}
                    ticksAtLimit={ticksAtLimit}
                    onLeftRangeInput={onLeftRangeInput}
                    onRightRangeInput={onRightRangeInput}
                    currencyA={baseCurrency}
                    currencyB={quoteCurrency}
                    feeAmount={feeAmount}
                    price={price}
                    poolPriceLower={poolPriceLower}
                    poolPriceUpper={poolPriceUpper}
                    poolId={pool?.id}
                  />
                </Box>
              </Box>
            )}

            <Box mt={4} className={classes.priceRangeInput}>
              <Box
                sx={{
                  opacity: fullRangeShow ? 0.05 : 1,
                }}
              >
                <Flex fullWidth justify="space-between" align="flex-start">
                  <Flex sx={{ width: "48%" }}>
                    <PriceRangeSelector
                      label={t("common.min.price")}
                      value={
                        ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? "0" : leftPrice?.toSignificant(5) ?? ""
                      }
                      onRangeInput={onLeftRangeInput}
                      decrement={isSorted ? getDecrementLower : getIncrementUpper}
                      increment={isSorted ? getIncrementLower : getDecrementUpper}
                      decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
                      incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
                      baseCurrency={baseCurrency}
                      quoteCurrency={quoteCurrency}
                    />
                  </Flex>
                  <Flex sx={{ width: "48%" }}>
                    <PriceRangeSelector
                      label={t("common.max.price")}
                      value={
                        ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? "∞" : rightPrice?.toSignificant(6) ?? ""
                      }
                      onRangeInput={(value) => onRightRangeInput(value)}
                      decrement={isSorted ? getDecrementUpper : getIncrementLower}
                      increment={isSorted ? getIncrementUpper : getDecrementLower}
                      isUpperFullRange={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                      incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                      decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                      baseCurrency={baseCurrency}
                      quoteCurrency={quoteCurrency}
                    />
                  </Flex>
                </Flex>

                {!noLiquidity ? (
                  <Box sx={{ margin: "12px 0 0 0" }}>
                    <Flex gap="12px" wrap="wrap">
                      {RANGE_BUTTONS.map(({ value, text }) => (
                        <RangeButton key={value} text={text} value={value} onClick={handleRange} active={rangeValue} />
                      ))}

                      {!noLiquidity ? (
                        <AutoPriceRangeButton
                          onLeftRangeInput={onLeftRangeInput}
                          onRightRangeInput={onRightRangeInput}
                          pool={pool}
                          baseCurrency={baseCurrency}
                          quoteCurrency={quoteCurrency}
                          rangeValue={rangeValue}
                          setRangeValue={setRangeValue}
                        />
                      ) : null}

                      {!noLiquidity ? (
                        <RangeButton
                          key="FullRange"
                          text={t("common.full.range")}
                          value="FullRange"
                          onClick={handleRange}
                          active={fullRangeWaring ? "FullRange" : undefined}
                        />
                      ) : null}

                      <Typography
                        sx={{
                          width: "fit-content",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontWeight: 500,
                          "&:hover": {
                            opacity: 0.6,
                          },
                        }}
                        onClick={handleReset}
                      >
                        Reset
                      </Typography>
                    </Flex>
                  </Box>
                ) : null}
              </Box>

              {fullRangeShow && <FullRangeWarning onUnderstand={handleIUnderstand} />}
            </Box>
          </Box>
        </Box>
      </>
    );
  },
);
