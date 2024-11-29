import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { Typography, useMediaQuery, Box, makeStyles, useTheme, Theme } from "components/Mui";
import CurrenciesAvatar from "components/CurrenciesAvatar";
import { KeyboardArrowDown, KeyboardArrowUp, SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { usePositionFees } from "hooks/swap/usePositionFees";
import { BigNumber, formatDollarAmount, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { CurrencyAmount, Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { isDarkTheme, toFormat } from "utils";
import { Trans } from "@lingui/macro";
import { Loading } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import PositionContext from "components/swap/PositionContext";
import { FeeTierPercentLabel, Flex } from "@icpswap/ui";
import { encodePositionKey, PositionState } from "utils/swap/index";
import { PositionRangeState } from "components/swap/index";
import { PositionFilterState, PositionSort } from "types/swap";
import { useGlobalContext } from "hooks/index";
import { usePositionState } from "hooks/liquidity";

import { PositionDetails } from "./PositionDetails";

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
  state: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
    background: "#8492C4",

    "@media(max-width: 640px)": {
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      borderTopLeftRadius: "12px",
      borderBottomLeftRadius: "0px",
      borderTopRightRadius: "12px",
    },

    "&.level0": {
      background: "#FFD24C",
    },

    "&.level1": {
      background: "#D3625B",
    },

    "&.outOfRange": {
      background: "#9D332C",
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
  staked?: boolean;
  filterState: PositionFilterState;
  sort: PositionSort;
}

export function PositionCard({ position, showButtons, positionId, farmId, staked, filterState }: PositionCardProps) {
  const classes = useStyle();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [detailShow, setDetailShow] = useState<boolean | undefined>(undefined);
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { setAllPositionsUSDValue, setHiddenNumbers } = useContext(PositionContext);
  const { refreshTriggers, setRefreshTriggers } = useGlobalContext();

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

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(
    position?.pool.id,
    positionId,
    positionKey ? refreshTriggers[positionKey] : undefined,
  );

  const { currencyFeeAmount0, currencyFeeAmount1 } = useMemo(() => {
    if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(feeAmount0) || isNullArgs(feeAmount1)) return {};

    const currencyFeeAmount0 = CurrencyAmount.fromRawAmount(token0, feeAmount0.toString());
    const currencyFeeAmount1 = CurrencyAmount.fromRawAmount(token1, feeAmount1.toString());

    return {
      currencyFeeAmount0,
      currencyFeeAmount1,
    };
  }, [feeAmount0, feeAmount1, token0, token1]);

  const feeUSDValue = useMemo(() => {
    if (
      isNullArgs(currencyFeeAmount0) ||
      isNullArgs(currencyFeeAmount1) ||
      isNullArgs(token0USDPrice) ||
      isNullArgs(token1USDPrice)
    )
      return undefined;

    return new BigNumber(currencyFeeAmount0.toExact())
      .multipliedBy(token0USDPrice)
      .plus(new BigNumber(currencyFeeAmount1.toExact()).multipliedBy(token1USDPrice))
      .toString();
  }, [currencyFeeAmount0, currencyFeeAmount1, token0USDPrice, token1USDPrice]);

  useEffect(() => {
    if (nonNullArgs(totalUSDValue) && nonNullArgs(positionKey)) {
      setAllPositionsUSDValue(positionKey, new BigNumber(totalUSDValue));
    }
  }, [totalUSDValue, positionKey, staked]);

  const pairName = useMemo(() => {
    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  const handleConvert = useCallback(
    (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      event.stopPropagation();
      setManuallyInverted(!manuallyInverted);
    },
    [setManuallyInverted, manuallyInverted],
  );

  const handleClaimSuccess = useCallback(() => {
    if (positionKey) {
      setRefreshTriggers(positionKey);
    }
  }, [setRefreshTriggers, positionKey]);

  const displayByFilter = useMemo(() => {
    if (isNullArgs(positionState)) return true;

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
  }, [positionState, filterState]);

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
      <Box className={`${classes.state} ${positionState ?? ""}`} />

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

          <Typography color="textPrimary" fontSize="18px">
            {currencyBase?.symbol}/{currencyQuote?.symbol}
          </Typography>

          <FeeTierPercentLabel feeTier={feeAmount} />
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
            <Typography className={classes.label}>
              <Trans>Current Price</Trans>
            </Typography>

            <Flex
              gap="0 4px"
              fullWidth
              justify="flex-end"
              sx={{
                "@media(max-width: 640px)": { width: "fit-content" },
              }}
            >
              <Typography color="text.primary">
                {!!token1 && !!token0
                  ? inverted
                    ? pool?.priceOf(token1)
                      ? `${toFormat(pool?.priceOf(token1).toSignificant(6))} ${pairName}`
                      : "--"
                    : pool?.priceOf(token0)
                    ? `${toFormat(pool?.priceOf(token0).toSignificant(6))} ${pairName}`
                    : "--"
                  : "--"}
              </Typography>

              <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={handleConvert} />
            </Flex>
          </Flex>

          {positionState !== PositionState.CLOSED ? (
            <Flex
              className={classes.item}
              justify="flex-end"
              sx={{ width: "80px", "@media(max-width: 640px)": { width: "fit-content" } }}
            >
              <Typography className={classes.label}>
                <Trans>Value</Trans>
              </Typography>

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
            <Typography className={classes.label}>
              <Trans>Uncollected Fees</Trans>
            </Typography>

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
                <Trans>Detail</Trans>
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
          onClaimSuccess={handleClaimSuccess}
          onHide={() => setDetailShow(false)}
          staked={staked}
          state={positionState}
        />
      </Box>
    </Box>
  );
}
