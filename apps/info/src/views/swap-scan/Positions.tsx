import { Trans } from "@lingui/macro";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { UserPosition } from "types/swap";
import { usePositions } from "hooks/swap-scan/index";
import { pageArgsFormat, toSignificant, numberToString, formatDollarAmount, shorten } from "@icpswap/utils";
import { useSwapPositionOwner, useParsedQueryString } from "@icpswap/hooks";
import { Pool, Position, Price, Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { useMemo, useState } from "react";
import { Header, HeaderCell, TableRow, BodyCell } from "@icpswap/ui";
import { LoadingRow, NoData, SelectPair, Pagination, PaginationType, Copy } from "ui-component/index";
import BigNumber from "bignumber.js";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { usePositionWithPool } from "hooks/swap/usePosition";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { usePositionFees } from "hooks/swap/usePositionFees";
import { toFormat } from "utils/index";
import { useHistory } from "react-router-dom";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import SwapScanWrapper, { ScanChildrenProps } from "./SwapScanWrapper";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "200px 120px 120px repeat(3, 1fr)",
    },
  };
});

export function getPriceOrderingFromPositionForUI(position: Position | undefined) {
  if (!position) return {};

  const token0 = position.amount0.currency;
  const token1 = position.amount1.currency;

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  };
}

interface useInverterProps {
  priceLower: Price<Token, Token> | undefined;
  priceUpper: Price<Token, Token> | undefined;
  quote: Token | undefined;
  base: Token | undefined;
  invert: boolean;
}

function useInverter({ priceLower, priceUpper, quote, base, invert }: useInverterProps) {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  };
}

enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

interface PositionItemProps {
  positionInfo: UserPosition;
  pool: Pool | null;
}

function PositionItem({ positionInfo, pool }: PositionItemProps) {
  const classes = useStyles();

  const [manuallyInverted, setManuallyInverted] = useState(false);

  const position = usePositionWithPool({
    pool,
    tickLower: positionInfo.tickLower.toString(),
    tickUpper: positionInfo.tickUpper.toString(),
    liquidity: positionInfo.liquidity.toString(),
  });

  const { tickLower, tickUpper } = position || {};
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
        <TableRow className={classes.wrapper}>
          <BodyCell>
            <Copy content={owner}>
              <Typography>{owner ? shorten(owner) : "--"}</Typography>
            </Copy>
          </BodyCell>

          <BodyCell>{positionInfo.id.toString()}</BodyCell>

          <BodyCell>{totalUSDValue ? `$${toFormat(totalUSDValue)}` : "--"}</BodyCell>

          <BodyCell>
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

          <BodyCell>
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

          <BodyCell>
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

interface PositionsProps {
  address: string | undefined;
}

function Positions({ address }: PositionsProps) {
  const classes = useStyles();
  const history = useHistory();
  const { pair } = useParsedQueryString() as { pair: string };

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = usePositions(pair, address, offset, pagination.pageSize);

  const positions = result?.content;
  const totalElements = result?.totalElements;

  const [, pool] = usePoolByPoolId(pair);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const handlePairChange = (pairId: string | undefined) => {
    setPagination({ pageNum: 1, pageSize: pagination.pageSize });

    if (pairId) {
      history.push(`/swap-scan/positions?pair=${pairId}`);
    } else {
      history.push(`/swap-scan/positions`);
    }
  };

  return (
    <Box sx={{ width: "100%", overflow: "auto", margin: "10px 0 0 0" }}>
      <Box sx={{ minWidth: "1200px" }}>
        <Box sx={{ display: "flex", gap: "0 16px", alignItems: "center" }}>
          <Box sx={{ width: "fit-content", minWidth: "214px" }}>
            <SelectPair value={pair} onPairChange={handlePairChange} />
          </Box>
          {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
        </Box>

        <Header className={classes.wrapper}>
          <HeaderCell field="Pair">
            <Trans>Owner</Trans>
          </HeaderCell>

          <HeaderCell field="Position ID">
            <Trans>Position ID</Trans>
          </HeaderCell>

          <HeaderCell field="USDValue">
            <Trans>Value</Trans>
          </HeaderCell>

          <HeaderCell field="TokenAmount">
            <Trans>Token Amount</Trans>
          </HeaderCell>

          <HeaderCell field="PriceRange">
            <Trans>Price Range</Trans>
          </HeaderCell>

          <HeaderCell field="UnclaimedFees">
            <Trans>Unclaimed fees</Trans>
          </HeaderCell>
        </Header>

        {!loading ? positions?.map((ele, index) => <PositionItem key={index} positionInfo={ele} pool={pool} />) : null}

        {(positions ?? []).length === 0 && !loading ? <NoData /> : null}

        {loading ? (
          <Box sx={{ margin: "20px 0 0 0" }}>
            <LoadingRow>
              <div />
              <div />
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

        {totalElements && Number(totalElements) !== 0 ? (
          <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
        ) : null}
      </Box>
    </Box>
  );
}

export default function SwapScanPositions() {
  return <SwapScanWrapper>{({ address }: ScanChildrenProps) => <Positions address={address} />}</SwapScanWrapper>;
}
