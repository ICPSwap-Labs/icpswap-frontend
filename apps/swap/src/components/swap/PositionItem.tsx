import React, { useState, useCallback, useMemo, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Grid, Chip, Button, useMediaQuery, Box, Popper } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import CurrenciesAvatar from "components/CurrenciesAvatar";
import { KeyboardArrowDown, KeyboardArrowUp, SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { DEFAULT_PERCENT_SYMBOL, CurrencyAmountFormatDecimals } from "constants/index";
import { feeAmountToPercentage } from "utils/swap/index";
import CollectFeesModal from "components/swap/CollectFeesModal";
import { usePositionFees } from "hooks/swap/usePositionFees";
import { numberToString, BigNumber, formatDollarAmount } from "@icpswap/utils";
import { CurrencyAmount, Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { isDarkTheme, toFormat } from "utils";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { Loading } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import PositionContext from "components/swap/PositionContext";
import { isElement } from "react-is";
import { isMobile } from "react-device-detect";
import { ClickAwayListener } from "@mui/base";

import PositionStatus from "./PositionRangeState";
import TransferPosition from "./TransferPosition";

const useStyle = makeStyles((theme: Theme) => ({
  positionContainer: {
    position: "relative",
    backgroundColor: theme.palette.background.level3,
    borderRadius: `${theme.radius}px`,
    border: theme.palette.border.gray200,
    padding: "24px 20px",
    marginTop: "16px",
    cursor: "pointer",
    overflow: "hidden",
    "&:first-child": {
      marginTop: "0",
    },
    [theme.breakpoints.down("md")]: {
      padding: "16px 10px",
    },
  },
  detailContainer: {
    backgroundColor: theme.palette.background.level3,
    borderRadius: `${theme.radius}px`,
    border: theme.palette.border.gray200,
    padding: "20px",
  },
}));

export interface PositionDetailItemProps {
  label: React.ReactChild;
  value: React.ReactChild | undefined;
  convert?: boolean;
  onConvertClick?: () => void;
}

export function PositionDetailItem({ label, value, convert, onConvertClick }: PositionDetailItemProps) {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      sx={{
        height: "48px",
      }}
      alignItems="center"
    >
      <Grid item xs={4}>
        <Typography {...(matchDownSM ? { fontSize: "12px" } : {})}>{label}</Typography>
      </Grid>
      <Grid item xs={8} container justifyContent="flex-end">
        {isElement(value) ? (
          value
        ) : (
          <Typography {...(matchDownSM ? { fontSize: "12px" } : {})} color="textPrimary">
            {value}
          </Typography>
        )}

        {convert && (
          <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={onConvertClick} />
        )}
      </Grid>
    </Grid>
  );
}

export interface PositionDetailsProps {
  positionId: bigint;
  invalid?: boolean;
  showButtons?: boolean;
  position: Position | undefined;
  manuallyInverted: boolean;
  setManuallyInverted: (manuallyInverted: boolean) => void;
  show: boolean | undefined;
  token0USDPrice: number | undefined;
  token1USDPrice: number | undefined;
}

export function PositionDetails({
  position,
  showButtons,
  positionId,
  invalid = false,
  manuallyInverted,
  setManuallyInverted,
  show,
  token0USDPrice,
  token1USDPrice,
}: PositionDetailsProps) {
  const classes = useStyle();
  const history = useHistory();
  const moreRef = useRef(null);
  const theme = useTheme() as Theme;

  const [collectFeesShow, setCollectFeesShow] = useState(false);
  const [reloadPositionFee, setReloadPositionFee] = useState(false);
  const [transferPopperShow, setTransferPopperShow] = useState(false);
  const [transferShow, setTransferShow] = useState(false);

  const { updateCounter } = useContext(PositionContext);

  const noLiquidity = position?.liquidity.toString() === "0";

  const { pool, tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

  const handleLoadRemoveLiquidity = useCallback(() => {
    if (invalid) {
      history.push(`/swap/liquidity/decrease/${String(positionId)}?invalid=true`);
      return;
    }
    history.push(`/swap/liquidity/decrease/${String(positionId)}/${position?.pool.id}`);
  }, [history, invalid, positionId]);

  const handleLoadIncreaseLiquidity = useCallback(() => {
    history.push(`/swap/liquidity/increase/${String(positionId)}/${position?.pool.id}`);
  }, [token0, token1]);

  const handleCollectFee = useCallback(() => {
    setCollectFeesShow(true);
  }, [setCollectFeesShow]);

  const _tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper);
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: manuallyInverted,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const pairName = useMemo(() => {
    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(
    position?.pool.id,
    positionId,
    reloadPositionFee,
  );

  const currencyFeeAmount0 = useMemo(() => {
    if (!token0 || feeAmount0 === undefined) return undefined;
    return CurrencyAmount.fromRawAmount(token0, numberToString(new BigNumber(feeAmount0.toString())));
  }, [feeAmount0, token0]);

  const currencyFeeAmount1 = useMemo(() => {
    if (!token1 || feeAmount1 === undefined) return undefined;
    return CurrencyAmount.fromRawAmount(token1, numberToString(new BigNumber(feeAmount1.toString())));
  }, [feeAmount1, token1]);

  const handleClaimedSuccessfully = () => {
    setReloadPositionFee(!reloadPositionFee);
  };

  const hasUnclaimedFees = useMemo(() => {
    if (!feeAmount0 && !feeAmount1) return false;
    return true;
  }, [feeAmount0, feeAmount1]);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTransferSuccess = () => {
    updateCounter();
  };

  return (
    <>
      <Grid mt={1} className={classes.detailContainer} sx={{ display: show ? "block" : "none" }}>
        <PositionDetailItem label={t`Position ID`} value={positionId.toString()} />
        <PositionDetailItem
          label={t`${currencyQuote?.symbol} Amount`}
          value={
            inverted
              ? toFormat(position?.amount0.toFixed(CurrencyAmountFormatDecimals(position?.amount0.currency.decimals)))
              : toFormat(position?.amount1.toFixed(CurrencyAmountFormatDecimals(position?.amount1.currency.decimals)))
          }
        />
        <PositionDetailItem
          label={t`${currencyBase?.symbol} Amount`}
          value={
            inverted
              ? toFormat(position?.amount1.toFixed(CurrencyAmountFormatDecimals(position?.amount1.currency.decimals)))
              : toFormat(position?.amount0.toFixed(CurrencyAmountFormatDecimals(position?.amount0.currency.decimals)))
          }
        />
        <PositionDetailItem
          label={t`Current Price`}
          value={
            !!token1 && !!token0
              ? inverted
                ? pool?.priceOf(token1)
                  ? `${toFormat(pool?.priceOf(token1).toSignificant(6))} ${pairName}`
                  : "--"
                : pool?.priceOf(token0)
                ? `${toFormat(pool?.priceOf(token0).toSignificant(6))} ${pairName}`
                : "--"
              : "--"
          }
          convert
          onConvertClick={() => setManuallyInverted(!manuallyInverted)}
        />
        <PositionDetailItem
          label={t`Price Range`}
          value={`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} - ${formatTickPrice(
            priceUpper,
            tickAtLimit,
            Bound.UPPER,
          )} ${pairName}`}
          convert
          onConvertClick={() => setManuallyInverted(!manuallyInverted)}
        />
        <PositionDetailItem
          label={t`Unclaimed fees`}
          value={
            <Box>
              <Typography
                color="text.primary"
                align="right"
                sx={{
                  "@media(max-width: 640px)": {
                    fontSize: "12px",
                  },
                }}
              >
                {currencyFeeAmount0 !== undefined || currencyFeeAmount1 !== undefined
                  ? `${toFormat(
                      new BigNumber(currencyFeeAmount0 ? currencyFeeAmount0.toExact() : 0).toFixed(8),
                    )} ${token0?.symbol} and ${toFormat(
                      new BigNumber(currencyFeeAmount1 ? currencyFeeAmount1.toExact() : 0).toFixed(8),
                    )} ${token1?.symbol}`
                  : "--"}
              </Typography>
              <Typography
                mt="5px"
                align="right"
                sx={{
                  "@media(max-width: 640px)": {
                    fontSize: "12px",
                  },
                }}
              >
                {currencyFeeAmount0 !== undefined &&
                currencyFeeAmount1 !== undefined &&
                !!token0USDPrice &&
                !!token1USDPrice
                  ? formatDollarAmount(
                      new BigNumber(currencyFeeAmount0 ? currencyFeeAmount0.toExact() : 0)
                        .multipliedBy(token0USDPrice)
                        .plus(
                          new BigNumber(currencyFeeAmount1 ? currencyFeeAmount1.toExact() : 0).multipliedBy(
                            token1USDPrice,
                          ),
                        )
                        .toString(),
                    )
                  : "--"}
              </Typography>
            </Box>
          }
        />
        {showButtons && (
          <Box
            mt={3}
            sx={{
              display: "grid",
              gridTemplateColumns: matchDownSM ? "1fr" : !hasUnclaimedFees ? "1fr 1fr 40px" : "1fr 1fr 1fr 40px",
              gap: matchDownSM ? "20px 0" : "0 20px",
            }}
          >
            {!noLiquidity ? (
              <Button
                fullWidth
                variant="outlined"
                size={matchDownSM ? "medium" : "medium"}
                onClick={handleLoadRemoveLiquidity}
              >
                <Trans>Remove Liquidity</Trans>
              </Button>
            ) : (
              <Box />
            )}
            {hasUnclaimedFees ? (
              <Button fullWidth variant="outlined" size={matchDownSM ? "medium" : "medium"} onClick={handleCollectFee}>
                <Trans>Claim fees</Trans>
              </Button>
            ) : null}
            {!invalid ? (
              <Button
                fullWidth
                variant="contained"
                size={matchDownSM ? "medium" : "medium"}
                onClick={handleLoadIncreaseLiquidity}
              >
                <Trans>Increase Liquidity</Trans>
              </Button>
            ) : (
              <Box />
            )}

            {!isMobile ? (
              <Box
                ref={moreRef}
                onMouseEnter={() => setTransferPopperShow(true)}
                onMouseLeave={() => setTransferPopperShow(false)}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    gap: "0 5px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ width: "4px", height: "4px", borderRadius: "50%", background: "#4F5A84" }} />
                  <Box sx={{ width: "4px", height: "4px", borderRadius: "50%", background: "#4F5A84" }} />
                  <Box sx={{ width: "4px", height: "4px", borderRadius: "50%", background: "#4F5A84" }} />
                </Box>

                <Popper
                  open={transferPopperShow}
                  anchorEl={moreRef?.current}
                  placement="top"
                  popperOptions={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [-30, 0],
                        },
                      },
                    ],
                  }}
                >
                  <ClickAwayListener onClickAway={() => setTransferPopperShow(false)}>
                    <Box
                      sx={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: theme.palette.background.level1,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setTransferShow(true);
                        setTransferPopperShow(false);
                      }}
                    >
                      <Typography color="text.primary">
                        <Trans>Transfer position</Trans>
                      </Typography>
                    </Box>
                  </ClickAwayListener>
                </Popper>
              </Box>
            ) : null}
          </Box>
        )}
      </Grid>

      {collectFeesShow ? (
        <CollectFeesModal
          pool={pool}
          positionId={positionId}
          open={collectFeesShow}
          currencyFeeAmount0={currencyFeeAmount0}
          currencyFeeAmount1={currencyFeeAmount1}
          onClose={() => {
            setCollectFeesShow(false);
          }}
          onClaimedSuccessfully={handleClaimedSuccessfully}
        />
      ) : null}

      {transferShow ? (
        <TransferPosition
          closed={closed}
          open={transferShow}
          position={position}
          positionId={positionId}
          onClose={() => setTransferShow(false)}
          onTransferSuccess={handleTransferSuccess}
        />
      ) : null}
    </>
  );
}

export interface PositionItemProps {
  positionId: bigint;
  invalid?: boolean;
  showButtons?: boolean;
  position: Position | undefined;
  closed: boolean;
}

export default function PositionItem({
  position,
  showButtons,
  positionId,
  invalid = false,
  closed,
}: PositionItemProps) {
  const classes = useStyle();
  const theme = useTheme() as Theme;

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [detailShow, setDetailShow] = useState<boolean | undefined>(undefined);

  const handleToggleShow = useCallback(() => {
    if (!position) return;
    setDetailShow(!detailShow);
  }, [detailShow, setDetailShow, position]);

  const { pool, tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);
  const [manuallyInverted, setManuallyInverted] = useState(false);

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

  const outOfRange =
    pool && (tickUpper || tickUpper === 0) && (tickLower || tickLower === 0)
      ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper
      : false;

  const token0USDPrice = useUSDPriceById(position?.pool.token0.address);
  const token1USDPrice = useUSDPriceById(position?.pool.token1.address);

  const totalUSDValue = useMemo(() => {
    if (!position || !token0USDPrice || !token1USDPrice) return undefined;

    const totalUSD = new BigNumber(token0USDPrice)
      .multipliedBy(position.amount0.toExact())
      .plus(new BigNumber(token1USDPrice).multipliedBy(position.amount1.toExact()));

    return totalUSD.toString();
  }, [position, token0USDPrice, token1USDPrice]);

  const { setAllPositionsUSDValue, updateCounter } = useContext(PositionContext);

  const positionKey = useMemo(() => {
    if (!position) return undefined;
    return `${position.pool.id}_${positionId.toString()}`;
  }, [position, positionId]);

  useEffect(() => {
    if (!!totalUSDValue && !!positionKey) {
      setAllPositionsUSDValue(positionKey, new BigNumber(totalUSDValue));
    }
  }, [totalUSDValue, positionKey]);

  return (
    <>
      <Grid className={classes.positionContainer} container onClick={handleToggleShow}>
        {!position && <Loading loading={!position} circularSize={28} />}

        <Grid item xs>
          <Grid container alignItems="center">
            <Grid item>
              <CurrenciesAvatar
                currencyA={currencyBase}
                currencyB={currencyQuote}
                borderColor={isDarkTheme(theme) ? "rgba(189, 200, 240, 0.4)" : "rgba(255, 255, 255, 0.4)"}
                bgColor={isDarkTheme(theme) ? "#273155" : "#DADADA"}
                size={matchDownMD ? "20px" : "24px"}
              />
            </Grid>
            <Grid item mx={1}>
              <Typography color="textPrimary" fontSize={matchDownMD ? 14 : 16} fontWeight={500}>
                {currencyBase?.symbol}/{currencyQuote?.symbol}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={feeAmount ? feeAmountToPercentage(feeAmount) : DEFAULT_PERCENT_SYMBOL}
                sx={{
                  borderRadius: "8px",
                  height: matchDownMD ? "22px" : "24px",
                  "& span": { padding: matchDownMD ? "2px" : "5px", fontSize: matchDownMD ? "12px" : "14px" },
                  backgroundColor: isDarkTheme(theme) ? "#4F5A84" : "#EFEFFF",
                }}
              />
            </Grid>
          </Grid>

          {!closed ? (
            <Grid container mt="10px">
              <Typography>
                <Trans>Value:</Trans>&nbsp;
              </Typography>
              <Typography color="text.primary">{totalUSDValue ? formatDollarAmount(totalUSDValue) : "--"}</Typography>
            </Grid>
          ) : null}
        </Grid>

        <Grid item>
          <Grid container>
            <PositionStatus closed={closed} outOfRange={outOfRange} />
            <Grid item ml={matchDownMD ? "5px" : "10px"}>
              <Grid container alignItems="center">
                {detailShow ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {typeof detailShow !== "boolean" ? null : (
        <PositionDetails
          position={position}
          positionId={positionId}
          invalid={invalid}
          showButtons={showButtons}
          manuallyInverted={manuallyInverted}
          setManuallyInverted={setManuallyInverted}
          show={detailShow}
          token0USDPrice={token0USDPrice}
          token1USDPrice={token1USDPrice}
        />
      )}
    </>
  );
}
