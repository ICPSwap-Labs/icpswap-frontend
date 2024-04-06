import React, { useState, memo, useCallback, useMemo } from "react";
import { Typography, Grid, Chip, Button, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import CurrenciesAvatar from "components/CurrenciesAvatar";
import { KeyboardArrowDown, KeyboardArrowUp, SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound, BURN_FIELD, slippageToPercent } from "constants/swap";
import { DEFAULT_PERCENT_SYMBOL, CurrencyAmountFormatDecimals } from "constants/index";
import { feeAmountToPercentage } from "utils/swap/index";
import Loading from "components/Loading";
import { useCollectFeesCall, decreaseV1Liquidity } from "hooks/swap/v2/useSwapCalls";
import { usePositionFees } from "hooks/swap/v2/usePositionFees";
import { useAccount } from "store/global/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { MaxUint128 } from "constants/misc";
import { numberToString } from "@icpswap/utils";
import {
  CurrencyAmount,
  Position,
  Price,
  Token,
  getPriceOrderingFromPositionForUI,
  useInverter,
} from "@icpswap/swap-sdk";
import { isDarkTheme } from "utils";
import { useErrorTip, useSuccessTip, useLoadingTip } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Theme } from "@mui/material/styles";
import { Identity as TypeIdentity } from "types/global";
import PositionStatus from "components/swap/PositionRangeState";
import { getLocaleMessage } from "locales/services";
import { useSlippageManager, useUserTransactionsDeadline } from "store/swapv2/cache/hooks";
import ConfirmRemoveLiquidityModal from "./HistoryRemoveModal";

import CollectFeesModal from "./CollectFeesModal";

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

export const DetailItem = memo(
  ({
    label,
    value,
    convert,
    onConvertClick,
  }: {
    label: React.ReactChild;
    value: React.ReactChild | undefined;
    convert?: boolean;
    onConvertClick?: () => void;
  }) => {
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
          <Typography {...(matchDownSM ? { fontSize: "12px" } : {})} color="textPrimary">
            {value}
          </Typography>
          {convert && (
            <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={onConvertClick} />
          )}
        </Grid>
      </Grid>
    );
  },
);

export interface PositionDetailsProps {
  positionId: number | bigint | string | undefined;
  invalid?: boolean;
  showButtons?: boolean;
  position: Position | undefined;
  manuallyInverted: boolean;
  setManuallyInverted: (manuallyInverted: boolean) => void;
  show: boolean | undefined;
}

export function PositionDetails({
  position,
  showButtons,
  positionId,
  invalid = false,
  manuallyInverted,
  setManuallyInverted,
  show,
}: PositionDetailsProps) {
  const classes = useStyle();
  const account = useAccount();
  const principal = useAccountPrincipal();
  const theme = useTheme() as Theme;
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const [collectFeesShow, setCollectFeesShow] = useState(false);
  const [reloadPositionFee, setReloadPositionFee] = useState(false);

  const noLiquidity = position?.liquidity.toString() === "0";

  const { pool, tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

  const [slippageTolerance] = useSlippageManager("burn");
  const transactionsDeadline = useUserTransactionsDeadline();

  const handleCollectFee = useCallback(() => {
    setCollectFeesShow(true);
  }, [setCollectFeesShow]);

  const _tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper);
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { priceLower, priceUpper, base, quote } = useInverter({
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

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(positionId, invalid, reloadPositionFee);

  const currencyFeeAmount0 = useMemo(() => {
    if (!token0 || !feeAmount0) return undefined;
    return CurrencyAmount.fromRawAmount(token0, numberToString(feeAmount0));
  }, [feeAmount0, token0]);

  const currencyFeeAmount1 = useMemo(() => {
    if (!token1 || !feeAmount1) return undefined;
    return CurrencyAmount.fromRawAmount(token1, numberToString(feeAmount1));
  }, [feeAmount1, token1]);

  const collectFeesCall = useCollectFeesCall(invalid);

  const onCollectConfirm = useCallback(
    async (identity: TypeIdentity, { loading }: SubmitLoadingProps) => {
      if (!identity || loading || !principal || !positionId) return;

      setCollectFeesShow(false);

      const loadingTipKey = openLoadingTip(
        `Claim ${currencyFeeAmount0?.toSignificant(6)} ${token0?.symbol} and ${currencyFeeAmount1?.toSignificant(
          6,
        )} ${token1?.symbol}`,
      );

      const { status, message } = await collectFeesCall(identity, {
        tokenId: BigInt(positionId),
        recipient: principal,
        amount0Max: MaxUint128.toString(),
        amount1Max: MaxUint128.toString(),
        internalCall: false,
      });

      closeLoadingTip(loadingTipKey);

      if (status === "ok") {
        openSuccessTip(t`Claimed successfully`);
        setReloadPositionFee(!reloadPositionFee);
      } else {
        openErrorTip(getLocaleMessage(message) ?? t`Failed to claim`);
      }
    },
    [account, setReloadPositionFee, reloadPositionFee, token0, token1, currencyFeeAmount0, currencyFeeAmount1],
  );

  const hasUnclaimedFees = useMemo(() => {
    if (Number(feeAmount0) === 0 && Number(feeAmount1) === 0) return false;
    return true;
  }, [feeAmount0, feeAmount1]);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  let buttonGridXS = 6;
  if (!noLiquidity && hasUnclaimedFees && !invalid) {
    buttonGridXS = 4;
  }

  if (matchDownSM) {
    buttonGridXS = 12;
  }

  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const handleConfirm = useCallback(
    async (identity: TypeIdentity, { loading }: SubmitLoadingProps) => {
      if (!position || !positionId || loading || !principal) {
        return;
      }

      const loadingTipKey = openLoadingTip(`Remove ${token0?.symbol}/${token1?.symbol} liquidity`);
      setConfirmModalShow(false);

      const partialPosition = new Position({
        pool: position.pool,
        liquidity: position.liquidity,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
      });

      const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
        slippageToPercent(slippageTolerance),
      );

      const { status, message } = await decreaseV1Liquidity(identity, {
        tokenId: BigInt(positionId),
        liquidity: partialPosition.liquidity.toString(),
        amount0Min: amount0Min.toString(),
        amount1Min: amount1Min.toString(),
        deadline: BigInt(transactionsDeadline),
        recipient: principal,
      });

      closeLoadingTip(loadingTipKey);

      if (status === "ok") {
        openSuccessTip(t`Removed liquidity successfully`);
      } else {
        openErrorTip(getLocaleMessage(message) ?? t`Failed to remove liquidity`);
      }
    },
    [position, slippageTolerance, positionId, transactionsDeadline, account],
  );

  const discountedAmount0 = position ? position.amount0.quotient : undefined;
  const discountedAmount1 = position ? position.amount1.quotient : undefined;

  const parsedAmounts = {
    [BURN_FIELD.CURRENCY_A]:
      token0 && discountedAmount0 ? CurrencyAmount.fromRawAmount(token0, discountedAmount0) : undefined,
    [BURN_FIELD.CURRENCY_B]:
      token1 && discountedAmount1 ? CurrencyAmount.fromRawAmount(token1, discountedAmount1) : undefined,
  };

  const formattedAmounts = {
    [BURN_FIELD.CURRENCY_A]:
      parsedAmounts[BURN_FIELD.CURRENCY_A]?.toFixed(
        CurrencyAmountFormatDecimals(parsedAmounts[BURN_FIELD.CURRENCY_A]?.currency.decimals),
      ) ?? "",
    [BURN_FIELD.CURRENCY_B]:
      parsedAmounts[BURN_FIELD.CURRENCY_B]?.toFixed(
        CurrencyAmountFormatDecimals(parsedAmounts[BURN_FIELD.CURRENCY_B]?.currency.decimals),
      ) ?? "",
  };

  return (
    <>
      <Grid mt={1} className={classes.detailContainer} sx={{ display: show ? "block" : "none" }}>
        <DetailItem
          label={t`${currencyQuote?.symbol} Amount`}
          value={
            inverted
              ? position?.amount0.toFixed(CurrencyAmountFormatDecimals(position?.amount0.currency.decimals))
              : position?.amount1.toFixed(CurrencyAmountFormatDecimals(position?.amount1.currency.decimals))
          }
        />
        <DetailItem
          label={t`${currencyBase?.symbol} Amount`}
          value={
            inverted
              ? position?.amount1.toFixed(CurrencyAmountFormatDecimals(position?.amount1.currency.decimals))
              : position?.amount0.toFixed(CurrencyAmountFormatDecimals(position?.amount0.currency.decimals))
          }
        />
        <DetailItem
          label={t`Current Price`}
          value={
            !!token1 && !!token0
              ? inverted
                ? pool?.priceOf(token1)
                  ? `${pool?.priceOf(token1).toSignificant(6)} ${pairName}`
                  : "--"
                : pool?.priceOf(token0)
                ? `${pool?.priceOf(token0).toSignificant(6)} ${pairName}`
                : "--"
              : "--"
          }
          convert
          onConvertClick={() => setManuallyInverted(!manuallyInverted)}
        />
        <DetailItem
          label={t`Price Range`}
          value={`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} - ${formatTickPrice(
            priceUpper,
            tickAtLimit,
            Bound.UPPER,
          )} ${pairName}`}
          convert
          onConvertClick={() => setManuallyInverted(!manuallyInverted)}
        />
        <DetailItem
          label={t`Unclaimed fees`}
          value={`${currencyFeeAmount0?.toExact() ?? 0} ${token0?.symbol} and ${
            currencyFeeAmount1?.toExact() ?? 0
          } ${token1?.symbol}`}
        />
        {showButtons && (
          <Grid
            container
            mt={3}
            justifyContent={noLiquidity || !hasUnclaimedFees ? "flex-end" : "space-between"}
            spacing="20px"
            flexDirection={matchDownSM ? "column" : "row"}
          >
            {!noLiquidity && (
              <Grid item xs={buttonGridXS}>
                <Button fullWidth variant="outlined" size="large" onClick={() => setConfirmModalShow(true)}>
                  <Trans>Remove Liquidity</Trans>
                </Button>
              </Grid>
            )}
            {hasUnclaimedFees && (
              <Grid item xs={buttonGridXS}>
                <Button fullWidth variant="outlined" size="large" onClick={handleCollectFee}>
                  <Trans>Claim fees</Trans>
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>

      <Identity onSubmit={onCollectConfirm}>
        {({ submit, loading }: CallbackProps) => (
          <CollectFeesModal
            open={collectFeesShow}
            token0={token0}
            token1={token1}
            currencyFeeAmount0={currencyFeeAmount0}
            currencyFeeAmount1={currencyFeeAmount1}
            onClose={() => setCollectFeesShow(false)}
            onConfirm={submit}
            loading={loading}
          />
        )}
      </Identity>

      {confirmModalShow && (
        <Identity onSubmit={handleConfirm} fullScreenLoading>
          {({ submit }: CallbackProps) => (
            <ConfirmRemoveLiquidityModal
              open={confirmModalShow}
              onConfirm={submit}
              onCancel={() => setConfirmModalShow(false)}
              currencyA={token0}
              currencyB={token1}
              formattedAmounts={formattedAmounts}
            />
          )}
        </Identity>
      )}
    </>
  );
}

export interface PositionItemProps {
  positionId: number | bigint | string | undefined;
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
  const { priceLower, priceUpper, base, quote } = useInverter({
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

  return (
    <>
      <Grid className={classes.positionContainer} container alignItems="center" onClick={handleToggleShow}>
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
        </Grid>
        <Grid item>
          <Grid container alignItems="center">
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
        />
      )}
    </>
  );
}
