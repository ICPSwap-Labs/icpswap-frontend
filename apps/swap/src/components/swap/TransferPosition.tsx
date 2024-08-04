import React, { useState, useMemo } from "react";
import { Typography, Grid, Chip, Button, useMediaQuery, Box } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import CurrenciesAvatar from "components/CurrenciesAvatar";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { DEFAULT_PERCENT_SYMBOL, CurrencyAmountFormatDecimals } from "constants/index";
import { feeAmountToPercentage } from "utils/swap/index";
import { usePositionFees } from "hooks/swap/usePositionFees";
import { useAccountPrincipal } from "store/auth/hooks";
import {
  numberToString,
  BigNumber,
  resultFormat,
  formatDollarAmount,
  isValidPrincipal,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { swapPool } from "@icpswap/actor";
import { ResultStatus } from "@icpswap/types";
import { CurrencyAmount, Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { isDarkTheme } from "utils/index";
import { useSuccessTip, useLoadingTip, useErrorTip } from "hooks/useTips";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { FilledTextField, Loading } from "components/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { isElement } from "react-is";
import SwapModal from "components/modal/swap";
import { Principal } from "@dfinity/principal";

import PositionStatus from "./PositionRangeState";

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
    [theme.breakpoints.down("md")]: {
      padding: "10px",
    },
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
    <Grid container alignItems="center">
      <Typography {...(matchDownSM ? { fontSize: "12px" } : {})}>{label}</Typography>
      <Grid sx={{ flex: 1 }} container justifyContent="flex-end" alignItems="center">
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
  onPrincipalChange: (principal: string) => void;
}

export function PositionDetails({
  position,
  positionId,
  manuallyInverted,
  setManuallyInverted,
  show,
  token0USDPrice,
  token1USDPrice,
  onPrincipalChange,
}: PositionDetailsProps) {
  const classes = useStyle();

  const { pool, tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

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

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(position?.pool.id, positionId);

  const currencyFeeAmount0 = useMemo(() => {
    if (!token0 || feeAmount0 === undefined) return undefined;
    return CurrencyAmount.fromRawAmount(token0, numberToString(new BigNumber(feeAmount0.toString())));
  }, [feeAmount0, token0]);

  const currencyFeeAmount1 = useMemo(() => {
    if (!token1 || feeAmount1 === undefined) return undefined;
    return CurrencyAmount.fromRawAmount(token1, numberToString(new BigNumber(feeAmount1.toString())));
  }, [feeAmount1, token1]);

  return (
    <>
      <Box
        className={classes.detailContainer}
        sx={{ display: show ? "flex" : "none", margin: "8px 0 0 0", gap: "20px 0", flexDirection: "column" }}
      >
        <PositionDetailItem label={t`Position ID`} value={positionId.toString()} />
        <PositionDetailItem
          label={t`${currencyQuote?.symbol} Amount`}
          value={
            !position
              ? "--"
              : inverted
              ? toSignificantWithGroupSeparator(
                  position.amount0.toFixed(CurrencyAmountFormatDecimals(position?.amount0.currency.decimals)),
                )
              : toSignificantWithGroupSeparator(
                  position.amount1.toFixed(CurrencyAmountFormatDecimals(position?.amount1.currency.decimals)),
                )
          }
        />
        <PositionDetailItem
          label={t`${currencyBase?.symbol} Amount`}
          value={
            !position
              ? "--"
              : inverted
              ? toSignificantWithGroupSeparator(
                  position.amount1.toFixed(CurrencyAmountFormatDecimals(position?.amount1.currency.decimals)),
                )
              : toSignificantWithGroupSeparator(
                  position.amount0.toFixed(CurrencyAmountFormatDecimals(position?.amount0.currency.decimals)),
                )
          }
        />
        <PositionDetailItem
          label={t`Current Price`}
          value={
            !!token1 && !!token0 && pool
              ? inverted
                ? `${pool.priceOf(token1).toSignificant(6, { groupSeparator: "," })} ${pairName}`
                : `${pool.priceOf(token0).toSignificant(6, { groupSeparator: "," })} ${pairName}`
              : "--"
          }
          convert
          onConvertClick={() => setManuallyInverted(!manuallyInverted)}
        />
        <PositionDetailItem
          label={t`Price Range`}
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
                {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} -
                {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)}
              </Typography>
              <Typography
                color="text.primary"
                align="right"
                sx={{
                  "@media(max-width: 640px)": {
                    fontSize: "12px",
                  },
                }}
              >
                {pairName}
              </Typography>
            </Box>
          }
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
                  ? `${toSignificantWithGroupSeparator(
                      new BigNumber(currencyFeeAmount0 ? currencyFeeAmount0.toExact() : 0).toString(),
                    )} ${token0?.symbol}`
                  : "--"}
              </Typography>
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
                  ? `and ${toSignificantWithGroupSeparator(
                      new BigNumber(currencyFeeAmount1 ? currencyFeeAmount1.toExact() : 0).toString(),
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

        <Box>
          <Typography sx={{ margin: "0  0 10px 0" }}>
            <Trans>Transfer to</Trans>
          </Typography>

          <FilledTextField multiline placeholder="Enter the principal ID" onChange={onPrincipalChange} />
        </Box>
      </Box>
    </>
  );
}

export interface TransferPositionProps {
  positionId: bigint;
  invalid?: boolean;
  showButtons?: boolean;
  position: Position | undefined;
  closed: boolean;
  open: boolean;
  onClose: () => void;
  onTransferSuccess?: () => void;
}

export default function TransferPosition({
  position,
  showButtons,
  positionId,
  invalid = false,
  closed,
  open,
  onClose,
  onTransferSuccess,
}: TransferPositionProps) {
  const classes = useStyle();
  const theme = useTheme() as Theme;

  const userPrincipal = useAccountPrincipal();

  const [principal, setPrincipal] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

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

  const handlePrincipalChange = (principal: string) => {
    setPrincipal(principal);
  };

  const handleTransfer = async () => {
    if (!principal || !position || !userPrincipal) return;

    onClose();

    setLoading(true);

    const poolId = position.pool.id;

    const loadingKey = openLoadingTip(t`Transferring your position, ID is ${positionId}`);

    const { status, message } = resultFormat<boolean>(
      await (
        await swapPool(poolId, true)
      ).transferPosition(userPrincipal, Principal.fromText(principal), BigInt(positionId)),
    );

    if (status === ResultStatus.OK) {
      openSuccessTip(t`Transfer successfully`);
      onClose();
      if (onTransferSuccess) onTransferSuccess();
    } else {
      openErrorTip(message ?? t`Failed to transfer`);
    }

    setLoading(false);

    closeLoadingTip(loadingKey);
  };

  let error: string | undefined;
  if (principal && !isValidPrincipal(principal)) error = "Invalid principal ID";
  if (!principal) error = "Enter the principal ID";

  return (
    <SwapModal open={open} title={t`Transfer position`} onClose={onClose}>
      <Grid className={classes.positionContainer} container>
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
          </Grid>
        </Grid>
      </Grid>

      <PositionDetails
        position={position}
        positionId={positionId}
        invalid={invalid}
        showButtons={showButtons}
        manuallyInverted={manuallyInverted}
        setManuallyInverted={setManuallyInverted}
        show
        token0USDPrice={token0USDPrice}
        token1USDPrice={token1USDPrice}
        onPrincipalChange={handlePrincipalChange}
      />

      <Box mt="20px">
        <Button fullWidth size="medium" variant="contained" disabled={!!error || loading} onClick={handleTransfer}>
          {error || <Trans>Transfer</Trans>}
        </Button>
      </Box>
    </SwapModal>
  );
}
