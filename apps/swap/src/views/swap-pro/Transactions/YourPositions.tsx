import { useState, useMemo, useContext } from "react";
import { Box, Typography, useTheme, makeStyles } from "components/Mui";
import { Trans } from "@lingui/macro";
import { useTickAtLimit, useUserLimitOrders } from "@icpswap/hooks";
import {
  CurrencyAmount,
  FeeAmount,
  Pool,
  useInverter,
  getPriceOrderingFromPositionForUI,
  formatTickPrice,
} from "@icpswap/swap-sdk";
import { useUserPoolPositions } from "hooks/swap/useUserAllPositions";
import { Header, HeaderCell, TableRow, BodyCell, LoadingRow, NoData, SimplePagination, TextButton } from "@icpswap/ui";
import type { UserPosition } from "types/swap";
import { usePositionFees } from "hooks/swap/usePositionFees";
import { usePositionWithPool } from "hooks/swap/usePosition";
import { usePool } from "hooks/swap/usePools";
import { BigNumber, formatDollarAmount, formatAmount, isNullArgs } from "@icpswap/utils";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { useAccountPrincipal } from "store/auth/hooks";
import { SwapProContext } from "components/swap/pro";
import { Null } from "@icpswap/types";
import { SwapContext } from "components/swap";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "100px repeat(3, 1fr) 60px",
      padding: "16px",
    },
  };
});

interface PositionItemProps {
  positionInfo: UserPosition;
  pool: Pool | undefined | null;
}

enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

function PositionItem({ positionInfo, pool }: PositionItemProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { inputToken, outputToken } = useContext(SwapContext);
  const { inputTokenPrice, outputTokenPrice } = useContext(SwapProContext);

  const [manuallyInverted, setManuallyInverted] = useState(false);

  const position = usePositionWithPool({
    tickLower: positionInfo.tickLower.toString(),
    tickUpper: positionInfo.tickUpper.toString(),
    liquidity: positionInfo.liquidity.toString(),
    pool,
  });

  const { amount0: feeAmount0, amount1: feeAmount1 } = usePositionFees(positionInfo.id, BigInt(positionInfo.index));

  const { token0, token1, fee, tickLower, tickUpper } = useMemo(
    () => ({
      token0: pool?.token0,
      token1: pool?.token1,
      fee: pool?.fee,
      tickLower: position?.tickLower,
      tickUpper: position?.tickUpper,
    }),
    [position, pool],
  );

  const nonInvertedTicksAtLimit = useTickAtLimit(fee, tickLower, tickUpper);
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
    if (!inverted) return nonInvertedTicksAtLimit;

    return {
      [Bound.LOWER]: nonInvertedTicksAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: nonInvertedTicksAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [nonInvertedTicksAtLimit, inverted]);

  const pairName = useMemo(() => {
    if (!currencyQuote || !currencyBase) return undefined;
    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  const { currencyFeeAmount0, currencyFeeAmount1 } = useMemo(() => {
    if (!token0 || feeAmount0 === undefined || !token1 || feeAmount1 === undefined)
      return {
        currencyFeeAmount0: undefined,
        currencyFeeAmount1: undefined,
      };

    return {
      currencyFeeAmount0: CurrencyAmount.fromRawAmount(token0, feeAmount0.toString()),
      currencyFeeAmount1: CurrencyAmount.fromRawAmount(token1, feeAmount1.toString()),
    };
  }, [feeAmount0, token0]);

  const { token0USDPrice, token1USDPrice } = useMemo(() => {
    if (!pool || !inputToken || !outputToken) return { token0USDPrice: undefined, token1USDPrice: undefined };

    return {
      token0USDPrice: pool.token0.address === inputToken.address ? inputTokenPrice : outputTokenPrice,
      token1USDPrice: pool.token1.address === inputToken.address ? inputTokenPrice : outputTokenPrice,
    };
  }, [pool, inputTokenPrice, outputTokenPrice, inputToken, outputToken]);

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.palette.background.level1}`,
      }}
    >
      <TableRow className={classes.wrapper} borderBottom="none">
        <BodyCell>{positionInfo.index}</BodyCell>

        <BodyCell sx={{ flexDirection: "column", gap: "12px" }}>
          <BodyCell>{position ? `${formatAmount(position.amount0.toExact())} ${token0?.symbol}` : "--"}</BodyCell>
          <BodyCell>{position ? `${formatAmount(position.amount1.toExact())} ${token1?.symbol}` : "--"}</BodyCell>
        </BodyCell>

        <BodyCell sx={{ display: "inline-block" }} onClick={() => setManuallyInverted(!manuallyInverted)}>
          {`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} - ${formatTickPrice(
            priceUpper,
            tickAtLimit,
            Bound.UPPER,
          )} ${pairName}`}

          <SyncAltIcon
            sx={{ fontSize: "1rem", cursor: "pointer", color: "#ffffff", margin: "0 0 0 4px", verticalAlign: "middle" }}
          />
        </BodyCell>

        <BodyCell
          sx={{
            flexDirection: "column",
          }}
        >
          <BodyCell>
            {currencyFeeAmount0 !== undefined && currencyFeeAmount1 !== undefined
              ? `${formatAmount(currencyFeeAmount0 ? currencyFeeAmount0.toExact() : 0)} ${token0?.symbol}`
              : "--"}
          </BodyCell>
          {currencyFeeAmount0 !== undefined && currencyFeeAmount1 !== undefined ? (
            <BodyCell>
              and&nbsp;
              {formatAmount(currencyFeeAmount1 ? currencyFeeAmount1.toExact() : 0)}
              &nbsp;{token1?.symbol}
            </BodyCell>
          ) : null}

          <Typography mt="10px" align="left">
            {currencyFeeAmount0 !== undefined &&
            currencyFeeAmount1 !== undefined &&
            !!token0USDPrice &&
            !!token1USDPrice
              ? `≈ ${formatDollarAmount(
                  new BigNumber(currencyFeeAmount0.toExact())
                    .multipliedBy(token0USDPrice)
                    .plus(new BigNumber(currencyFeeAmount1.toExact()).multipliedBy(token1USDPrice))
                    .toString(),
                )}`
              : "--"}
          </Typography>
        </BodyCell>

        <BodyCell
          sx={{
            width: "24px",
            height: "24px",
            "@media screen and (max-width: 600px)": {
              fontSize: "14px",
              width: "24px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              position: "sticky",
              right: "0",
              background: theme.palette.background.level3,
            },
          }}
        >
          <TextButton to={`/liquidity/position/${positionInfo.index}/${positionInfo.id}`}>
            <Trans>Details</Trans>
          </TextButton>
        </BodyCell>
      </TableRow>
    </Box>
  );
}

const maxItems = 10;

export interface PoolTransactionsProps {
  poolId: string | Null;
}

export function YourPositions({ poolId }: PoolTransactionsProps) {
  const classes = useStyles();
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const { inputToken, outputToken } = useContext(SwapContext);

  const [page, setPage] = useState(1);
  const { result: userPositions, loading } = useUserPoolPositions(poolId);
  const { result: userLimitOrders } = useUserLimitOrders(poolId, principal?.toString());

  const filteredPositions = useMemo(() => {
    if (isNullArgs(userPositions) || isNullArgs(userLimitOrders)) return null;

    return (
      userPositions
        .filter((e) => e.liquidity !== BigInt(0))
        // Filter the limit order
        .filter((e) => {
          return !userLimitOrders.find((limit) => limit.userPositionId === BigInt(e.index));
        })
        .slice(maxItems * (page - 1), page * maxItems)
    );
  }, [userPositions, userLimitOrders]);

  const [, pool] = usePool(inputToken, outputToken, FeeAmount.MEDIUM);

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ minWidth: "940px" }}>
        <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
          <HeaderCell field="PositionId">
            <Trans>Position ID</Trans>
          </HeaderCell>

          <HeaderCell field="TokenAmount">
            <Trans>Token Amount</Trans>
          </HeaderCell>

          <HeaderCell field="priceRange">
            <Trans>Price Range</Trans>
          </HeaderCell>

          <HeaderCell field="unclaimedFees">
            <Trans>Uncollected Fees</Trans>
          </HeaderCell>

          <HeaderCell>&nbsp;</HeaderCell>
        </Header>

        {!loading
          ? (filteredPositions ?? []).map((position) => (
              <PositionItem key={`${position.id}_${position.index}`} positionInfo={position} pool={pool} />
            ))
          : null}

        {(filteredPositions ?? []).length === 0 && !loading ? <NoData /> : null}

        {loading ? (
          <Box sx={{ padding: "24px" }}>
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          </Box>
        ) : null}

        <Box sx={{ padding: "20px 0" }}>
          {!loading && !!filteredPositions?.length ? (
            <SimplePagination
              page={page}
              maxItems={maxItems}
              length={filteredPositions?.length ?? 0}
              onPageChange={setPage}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
