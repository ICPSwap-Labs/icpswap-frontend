import { useMemo, useState } from "react";
import { Typography, useTheme } from "components/Mui";
import { PositionDetails } from "types/swap";
import { toSignificant, numberToString, formatDollarAmount, shorten, BigNumber } from "@icpswap/utils";
import { useSwapPositionOwner, useTickAtLimit } from "@icpswap/hooks";
import { Pool, getPriceOrderingFromPositionForUI, useInverter, CurrencyAmount } from "@icpswap/swap-sdk";
import { TableRow, BodyCell } from "@icpswap/ui";
import { LoadingRow, Copy } from "components/index";
import { usePositionWithPool, usePositionFees } from "hooks/swap/index";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { toFormat } from "utils/index";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Null } from "@icpswap/types";

enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

export interface PositionRowProps {
  positionInfo: PositionDetails;
  pool: Pool | Null;
  wrapperClassName?: string;
}

export function PositionRow({ positionInfo, pool, wrapperClassName }: PositionRowProps) {
  const theme = useTheme();

  const [manuallyInverted, setManuallyInverted] = useState(false);

  const position = usePositionWithPool({
    pool,
    tickLower: positionInfo.tickLower.toString(),
    tickUpper: positionInfo.tickUpper.toString(),
    liquidity: positionInfo.liquidity.toString(),
  });

  const { tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

  const _tickAtLimit = useTickAtLimit(feeAmount, tickLower, tickUpper);
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
  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  const pairName = useMemo(() => {
    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  const token0USDPrice = useUSDPriceById(position?.pool.token0.address);
  const token1USDPrice = useUSDPriceById(position?.pool.token1.address);

  const totalUSDValue = useMemo(() => {
    if (!position || !token0USDPrice || !token1USDPrice) return undefined;

    const totalUSD = new BigNumber(token0USDPrice)
      .multipliedBy(position.amount0.toExact())
      .plus(new BigNumber(token1USDPrice).multipliedBy(position.amount1.toExact()));

    return totalUSD.toFixed(4);
  }, [position, token0USDPrice, token1USDPrice]);

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(position?.pool.id, positionInfo.id);

  const currencyFeeAmount0 = useMemo(() => {
    if (!token0 || feeAmount0 === undefined) return undefined;
    return CurrencyAmount.fromRawAmount(token0, numberToString(new BigNumber(feeAmount0.toString())));
  }, [feeAmount0, token0]);

  const currencyFeeAmount1 = useMemo(() => {
    if (!token1 || feeAmount1 === undefined) return undefined;
    return CurrencyAmount.fromRawAmount(token1, numberToString(new BigNumber(feeAmount1.toString())));
  }, [feeAmount1, token1]);

  const { result: owner } = useSwapPositionOwner(positionInfo.poolId, positionInfo.id);

  return (
    <>
      {pool ? (
        <TableRow className={wrapperClassName} borderBottom={`1px solid ${theme.palette.border.level1}`}>
          <BodyCell>
            <Copy content={owner ?? ""}>
              <Typography>{owner ? shorten(owner) : "--"}</Typography>
            </Copy>
          </BodyCell>

          <BodyCell>{positionInfo.id.toString()}</BodyCell>

          <BodyCell>{totalUSDValue ? `$${toFormat(totalUSDValue)}` : "--"}</BodyCell>

          <BodyCell sx={{ flexDirection: "column" }}>
            <Typography>
              {position
                ? `${toSignificant(position.amount0.toExact(), 12, { groupSeparator: "," })} ${pool.token0.symbol}`
                : "--"}
            </Typography>

            <Typography sx={{ margin: "10px 0 0 0" }}>
              {position
                ? `${toSignificant(position.amount1.toExact(), 12, { groupSeparator: "," })} ${pool.token1.symbol}`
                : "--"}
            </Typography>
          </BodyCell>

          <BodyCell sx={{ flexDirection: "column" }}>
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              {!!token1 && !!token0
                ? inverted
                  ? pool?.priceOf(token1)
                    ? `${toFormat(pool?.priceOf(token1).toSignificant(6))} ${pairName}`
                    : "--"
                  : pool?.priceOf(token0)
                  ? `${toFormat(pool?.priceOf(token0).toSignificant(6))} ${pairName}`
                  : "--"
                : "--"}
              <SyncAltIcon
                sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer", color: "#ffffff" }}
                onClick={() => setManuallyInverted(!manuallyInverted)}
              />
            </Typography>

            <Typography sx={{ margin: "10px 0 0 0" }}>
              {`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, undefined, {
                groupSeparator: ",",
              })} - ${formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, undefined, {
                groupSeparator: ",",
              })} ${pairName}`}
            </Typography>
          </BodyCell>

          <BodyCell sx={{ flexDirection: "column" }}>
            <Typography>
              {currencyFeeAmount0 !== undefined || currencyFeeAmount1 !== undefined
                ? `${toFormat(
                    new BigNumber(currencyFeeAmount0 ? currencyFeeAmount0.toExact() : 0).toFixed(8),
                  )} ${token0?.symbol} and ${toFormat(
                    new BigNumber(currencyFeeAmount1 ? currencyFeeAmount1.toExact() : 0).toFixed(8),
                  )} ${token1?.symbol}`
                : "--"}
            </Typography>

            <Typography mt="10px" align="left">
              {currencyFeeAmount0 !== undefined &&
              currencyFeeAmount1 !== undefined &&
              !!token0USDPrice &&
              !!token1USDPrice
                ? `≈ ${formatDollarAmount(
                    new BigNumber(currencyFeeAmount0 ? currencyFeeAmount0.toExact() : 0)
                      .multipliedBy(token0USDPrice)
                      .plus(
                        new BigNumber(currencyFeeAmount1 ? currencyFeeAmount1.toExact() : 0).multipliedBy(
                          token1USDPrice,
                        ),
                      )
                      .toString(),
                  )}`
                : "--"}
            </Typography>
          </BodyCell>
        </TableRow>
      ) : (
        <TableRow>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </TableRow>
      )}
    </>
  );
}
