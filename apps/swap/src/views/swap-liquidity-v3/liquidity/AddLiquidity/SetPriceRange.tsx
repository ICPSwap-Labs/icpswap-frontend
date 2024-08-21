import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { Box, Grid, Typography, TextField, Chip, Button, ButtonBase } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Token, Price } from "@icpswap/swap-sdk";
import WarningIcon from "assets/images/swap/warning";
import { Bound, FeeAmount } from "constants/swap";
import { MAX_SWAP_INPUT_LENGTH } from "constants/index";
import TokenToggle from "components/TokenToggle";
import { isDarkTheme, toSignificantFormatted } from "utils";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { NumberTextField } from "components/index";
import PriceRangeChart from "./PriceRangeChart";

const usePriceRangeInputStyle = makeStyles((theme: Theme) => {
  return {
    inputContainer: {
      border: theme.palette.border.gray200,
      borderRadius: "12px",
    },
    input: {
      "& input": {
        fontSize: "20px!important",
        fontWeight: 700,
        textAlign: "center",
        height: "28px",
        padding: "0 0",
        [theme.breakpoints.down("sm")]: {
          fontSize: "12px",
        },
      },
      "& input::placeholder": {
        fontSize: "20px",
        fontWeight: 700,
        [theme.breakpoints.down("sm")]: {
          fontSize: "12px",
        },
      },
    },
    chip: {
      width: "28px",
      height: "28px",
      borderRadius: "8px",
      "& .MuiSvgIcon-root": {
        marginLeft: "17px",
        color: isDarkTheme(theme) ? "#e0e0e0" : theme.colors.darkLevel1,
      },
    },
  };
});

export interface PriceRangeSelectorProps {
  label: React.ReactChild;
  value: string;
  increment: () => string;
  decrement: () => string;
  onRangeInput: (value: string) => void;
  isUpperFullRange?: boolean | undefined;
  incrementDisabled?: boolean;
  decrementDisabled?: boolean;
  baseCurrency: Token | undefined;
  quoteCurrency: Token | undefined;
}

export function PriceRangeSelector({
  label = t`Min Price`,
  value,
  increment,
  decrement,
  onRangeInput,
  isUpperFullRange,
  incrementDisabled,
  decrementDisabled,
  baseCurrency,
  quoteCurrency,
}: PriceRangeSelectorProps) {
  const classes = usePriceRangeInputStyle();

  const [localValue, setLocalValue] = useState("");
  const [useLocalValue, setUseLocalValue] = useState(false);

  const handleOnFocus = useCallback(() => {
    setUseLocalValue(true);
  }, []);

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false);
    onRangeInput(localValue); // trigger update on parent value
  }, [localValue, onRangeInput]);

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value); // reset local value to match parent
      }, 0);
    }
  }, [localValue, useLocalValue, value]);

  const handleIncreasePrice = useCallback(() => {
    setUseLocalValue(false);
    onRangeInput(increment());
  }, [increment, onRangeInput]);

  const handleDecreasePrice = useCallback(() => {
    setUseLocalValue(false);
    onRangeInput(decrement());
  }, [decrement, onRangeInput]);

  return (
    <Grid className={classes.inputContainer} container alignItems="center" justifyContent="center" sx={{ p: 2 }}>
      <Typography align="center" fontSize={12}>
        {label}
      </Typography>
      <Grid container mt="12px" mb="12px">
        <Chip
          className={classes.chip}
          icon={<RemoveIcon />}
          onClick={handleDecreasePrice}
          disabled={decrementDisabled}
        />
        <Grid item xs ml="5px" mr="5px">
          {isUpperFullRange ? (
            <TextField
              fullWidth
              value={localValue}
              className={classes.input}
              placeholder="0.0"
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
            />
          ) : (
            <NumberTextField
              fullWidth
              value={localValue}
              className={classes.input}
              placeholder="0.0"
              variant="standard"
              numericProps={{
                thousandSeparator: true,
                decimalScale: 8,
                allowNegative: false,
                maxLength: MAX_SWAP_INPUT_LENGTH,
              }}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
            />
          )}
        </Grid>
        <Chip className={classes.chip} icon={<AddIcon />} onClick={handleIncreasePrice} disabled={incrementDisabled} />
      </Grid>
      <Typography align="center">
        {baseCurrency && quoteCurrency ? `${quoteCurrency?.symbol} per ${baseCurrency?.symbol}` : ""}
      </Typography>
    </Grid>
  );
}

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
    fullRangeMask: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(255, 193, 7, 0.16)",
      border: `1px solid ${theme.colors.warningDark}`,
      borderRadius: "12px",
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
    warningText: {
      marginTop: "13px",
      color: theme.colors.warningDark,
    },
    warningTitle: {
      color: theme.colors.warningDark,
      fontWeight: 700,
      fontSize: "16px",
    },
    iUnderstand: {
      padding: "0 9px",
      backgroundColor: theme.colors.warningDark,
      color: theme.colors.darkLevel1,
      borderRadius: "8px",
      height: "32px",
      marginTop: "16px",
    },
  };
});

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
}

const PriceRange = memo(
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
  }: PriceRangeProps) => {
    const [isFullRange, setFullRange] = useState(false);
    const classes = useSetPriceStyle();
    const theme = useTheme() as Theme;

    const tokenA = (baseCurrency ?? undefined)?.wrapped;
    const tokenB = (quoteCurrency ?? undefined)?.wrapped;
    const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB);

    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    const isRangePriceDisabled = useMemo(
      () => (noLiquidity && !startPrice) || poolLoading,
      [noLiquidity, startPrice, poolLoading],
    );

    const handleFullRangeClick = () => {
      setFullRange(true);
    };

    const handleIUnderstand = () => {
      setFullRange(false);
      getSetFullRange();
    };

    return (
      <>
        {noLiquidity && (
          <>
            <Typography variant="h4" color="textPrimary">
              <Trans>Set Starting Price</Trans>
            </Typography>
            <Box mt={2}>
              <Box className={classes.startPriceDescription}>
                <Typography color={theme.colors.warningDark} fontSize={12}>
                  <Trans>
                    Before you can add liquidity, this pool needs to be initialized. Creating a trading pair incurs 1
                    ICP fee for setting up the Swap pool canister. To begin, select an initial price for the pool,
                    determine your liquidity price range, and decide on the deposit amount. Please be aware that if the
                    liquidity pool is being established for the first time, the creation of a new canister might require
                    some time.
                  </Trans>
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
              <Grid container mt={2} mb={2} className={classes.startPrice} alignItems="center">
                <Typography sx={{ marginRight: "8px" }}>
                  <Trans>Current {baseCurrency?.symbol} Price:</Trans>
                </Typography>
                <Grid item xs>
                  <Grid container alignItems="center">
                    <Grid
                      item
                      xs
                      sx={{
                        overflow: "hidden",
                        width: "0px",
                      }}
                    >
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
                    </Grid>
                    <Typography
                      fontWeight={600}
                      color="textPrimary"
                      sx={{
                        marginLeft: "4px",
                      }}
                    >
                      {quoteCurrency?.symbol}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
        <Box>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="h4" color="textPrimary">
                <Trans>Set Price Range</Trans>
              </Typography>
            </Grid>
            {baseCurrency && quoteCurrency && (
              <Grid item>
                <TokenToggle currencyA={baseCurrency} currencyB={quoteCurrency} handleToggle={handleTokenToggle} />
              </Grid>
            )}
          </Grid>

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
            {/* zoom position */}
            {!noLiquidity && (
              <Box mt={3} sx={{ position: "relative" }}>
                <Grid sx={{ height: "28px" }} container alignItems="center">
                  <Typography color="textPrimary" fontSize="12px">
                    <Trans>Current Price: </Trans> {price ? toSignificantFormatted(price) : "--"}
                    <Typography component="span" sx={{ marginLeft: "5px" }} fontSize="12px">
                      {quoteCurrency?.symbol} per {baseCurrency?.symbol}
                    </Typography>
                  </Typography>
                </Grid>
                <Box mt={3}>
                  {/* @ts-ignore */}
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
                  />
                </Box>
              </Box>
            )}
            <Box mt={4} className={classes.priceRangeInput}>
              <Box
                sx={{
                  opacity: isFullRange ? 0.05 : 1,
                }}
              >
                <Grid container justifyContent="space-between">
                  <Grid item sx={{ width: "48%" }}>
                    <PriceRangeSelector
                      label={t`Min Price`}
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
                  </Grid>
                  <Grid item sx={{ width: "48%" }}>
                    <PriceRangeSelector
                      label={t`Max Price`}
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
                  </Grid>
                </Grid>
                {!noLiquidity && (
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      color="secondary"
                      className={classes.fullRangeButton}
                      onClick={handleFullRangeClick}
                    >
                      <Trans>Full Range</Trans>
                    </Button>
                  </Box>
                )}
              </Box>
              {isFullRange && (
                <Box className={classes.fullRangeMask} sx={{ p: 3 }}>
                  <Grid container alignItems="center">
                    <Grid item xs="auto" mr="12px">
                      <Grid container>
                        <WarningIcon />
                      </Grid>
                    </Grid>
                    <Typography className={classes.warningTitle}>
                      <Trans>Efficiency Comparison</Trans>
                    </Typography>
                  </Grid>
                  <Typography className={classes.warningText}>
                    <Trans>Full range positions may earn less fees than concentrated positions.</Trans>
                  </Typography>
                  <ButtonBase className={classes.iUnderstand} onClick={handleIUnderstand}>
                    <Trans>I Understand</Trans>
                  </ButtonBase>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </>
    );
  },
);

export default PriceRange;
