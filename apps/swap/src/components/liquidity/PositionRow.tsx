import { useAddressAlias, useSwapPositionOwner } from "@icpswap/hooks";
import { CurrencyAmount, type Pool } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { BodyCell, Link, TableRow } from "@icpswap/ui";
import {
  BigNumber,
  formatAmount,
  formatDollarAmount,
  isUndefinedOrNull,
  numberToString,
  shorten,
} from "@icpswap/utils";
import { Copy, IsSneedOwner, LoadingRow } from "components/index";
import { PositionPriceRange } from "components/liquidity/PositionPriceRange";
import { Typography, useTheme } from "components/Mui";
import { LimitLabel } from "components/swap/limit-order";
import { TokenSymbol } from "components/TokenSymbol";
import { useIsSneedOwner } from "hooks/index";
import { usePositionFees, usePositionWithPool } from "hooks/swap/index";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { PositionDetails } from "types/swap";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";

export interface PositionRowProps {
  positionInfo: PositionDetails;
  pool: Pool | Null;
  wrapperClassName?: string;
  sneedLedger?: string | Null;
  showDetails?: boolean;
  allLimitOrders?: bigint[] | Null;
  padding?: string;
}

export function PositionRow({
  positionInfo,
  sneedLedger,
  pool,
  showDetails = true,
  wrapperClassName,
  allLimitOrders,
  padding,
}: PositionRowProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const position = usePositionWithPool({
    pool,
    tickLower: positionInfo.tickLower.toString(),
    tickUpper: positionInfo.tickUpper.toString(),
    liquidity: positionInfo.liquidity.toString(),
  });

  const { token0, token1 } = pool || {};

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

  const { data: owner } = useSwapPositionOwner(positionInfo.poolId, positionInfo.id);

  const isSneed = useIsSneedOwner({ owner, sneedLedger });

  const isLimitOrder = useMemo(() => {
    if (isUndefinedOrNull(allLimitOrders)) return false;
    return allLimitOrders.includes(BigInt(positionInfo.id));
  }, [allLimitOrders, positionInfo]);

  const { data: addressAlias } = useAddressAlias({ account: owner });

  return (
    <>
      {pool ? (
        <TableRow
          className={wrapperClassName}
          borderBottom={`1px solid ${theme.palette.border.level1}`}
          padding={padding}
        >
          <BodyCell sx={{ gap: "8px 4px", alignItems: "center" }}>
            {positionInfo.id.toString()}
            {isLimitOrder ? <LimitLabel /> : null}
          </BodyCell>

          <BodyCell sx={{ gap: "0 8px", alignItems: "center" }}>
            <Copy content={owner ?? ""}>
              <BodyCell>{addressAlias ?? (owner ? shorten(owner) : "--")}</BodyCell>
            </Copy>

            <IsSneedOwner isSneed={isSneed} tooltip={t("liquidity.locked.snned")} />
          </BodyCell>

          <BodyCell>{totalUSDValue ? `${formatDollarAmount(totalUSDValue)}` : "--"}</BodyCell>

          <BodyCell sx={{ flexDirection: "column", gap: "10px" }}>
            <BodyCell>
              {position ? (
                <>
                  {formatAmount(position.amount0.toExact())}&nbsp;
                  <TokenSymbol symbol={pool.token0.symbol} typographyStyle="inherit" />
                </>
              ) : (
                "--"
              )}
            </BodyCell>

            <BodyCell>
              {position ? (
                <>
                  {formatAmount(position.amount1.toExact())}&nbsp;
                  <TokenSymbol symbol={pool.token1.symbol} typographyStyle="inherit" />
                </>
              ) : (
                "--"
              )}
            </BodyCell>
          </BodyCell>

          <BodyCell>
            <PositionPriceRange position={position} color="inherit" fontSize="inherit" arrow={false} />
          </BodyCell>

          <BodyCell sx={{ flexDirection: "column", gap: "10px" }}>
            <BodyCell>
              {currencyFeeAmount0 !== undefined || currencyFeeAmount1 !== undefined
                ? `${formatAmount(currencyFeeAmount0 ? currencyFeeAmount0.toExact() : 0)} ${tokenSymbolEllipsis({
                    symbol: token0?.symbol,
                  })} and ${formatAmount(currencyFeeAmount1 ? currencyFeeAmount1.toExact() : 0)} ${tokenSymbolEllipsis({
                    symbol: token1?.symbol,
                  })}`
                : "--"}
            </BodyCell>

            <Typography align="left">
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

          {showDetails ? (
            <BodyCell sx={{ flexDirection: "column" }}>
              <Link to={`/liquidity/position/${positionInfo.id}/${pool.id}`}>
                <Typography color="text.theme-secondary">{t("common.details")}</Typography>
              </Link>
            </BodyCell>
          ) : null}
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
