import { Checkbox, Box, Typography, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { usePosition } from "hooks/swap/usePosition";
import { toFormat } from "utils/index";
import { TokenImage } from "components/Image/Token";
import PositionRangeState from "components/swap/PositionRangeState";
import { useState, useMemo } from "react";
import { Theme } from "@mui/material/styles";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import { Bound } from "constants/swap";
import { getPriceOrderingFromPositionForUI, useInverter } from "components/swap/PositionItem";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import LoadingRow from "components/Loading/LoadingRow";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { BigNumber } from "bignumber.js";
import { formatDollarAmount } from "@icpswap/utils";

const useStyle = makeStyles(() => ({
  selectNFTBox: {
    position: "relative",
  },
  nft: {
    width: "160px",
    filter: "grayscale(100%)",
  },
  checked: {
    width: "160px",
    border: "1px solid #5669DC",
    filter: "drop-shadow(0px 0px 4px #5669DC)",
    borderRadius: "22px",
  },
  checkbox: {
    "&.noLiquidity": {
      filter: "grayscale(100%)!important",
    },
  },
}));

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_32128_12869)">
        <path d="M11.06 5.72656L8 8.7799L4.94 5.72656L4 6.66656L8 10.6666L12 6.66656L11.06 5.72656Z" fill="#8492C4" />
      </g>
      <defs>
        <clipPath id="clip0_32128_12869">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

interface DetailsItemProps {
  label: string | undefined;
  value: string | undefined;
}

function DetailsItem({ label, value }: DetailsItemProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography>{label}</Typography>
      <Typography color="text.primary">{value}</Typography>
    </Box>
  );
}

export type PositionInfo = {
  id: bigint;
  tickUpper: bigint;
  liquidity: bigint;
  tickLower: bigint;
};

interface PositionItemProps {
  positionInfo: PositionInfo;
  setSelectedPositionId: (positionId: number | undefined) => void;
  selectedPositionId: number | undefined;
  poolId: string;
}

export function PositionItem({ positionInfo, selectedPositionId, setSelectedPositionId, poolId }: PositionItemProps) {
  const classes = useStyle();
  const theme = useTheme() as Theme;

  const [show, setShow] = useState(false);

  const { position } = usePosition({
    poolId,
    tickLower: positionInfo.tickLower,
    tickUpper: positionInfo.tickUpper,
    liquidity: positionInfo.liquidity,
  });

  const pool = position?.pool;
  const tickUpper = position?.tickUpper;
  const tickLower = position?.tickLower;

  const token0 = pool?.token0;
  const token1 = pool?.token1;

  const token0Amount = position?.amount0.toSignificant(8);
  const token1Amount = position?.amount1.toSignificant(8);

  const outOfRange =
    pool && (tickUpper || tickUpper === 0) && (tickLower || tickLower === 0)
      ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper
      : false;

  const closed = position?.liquidity?.toString() === "0";

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: false,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const pairName = useMemo(() => {
    return `${currencyQuote?.symbol} per ${currencyBase?.symbol}`;
  }, [currencyQuote, currencyBase]);

  const _tickAtLimit = useIsTickAtLimit(pool?.fee, tickLower, tickUpper);

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  const token0USDPrice = useUSDPriceById(position?.pool.token0.address);
  const token1USDPrice = useUSDPriceById(position?.pool.token1.address);

  const totalUSDValue = useMemo(() => {
    if (!position || !token0USDPrice || !token1USDPrice) return undefined;

    const totalUSD = new BigNumber(token0USDPrice)
      .multipliedBy(position.amount0.toExact())
      .plus(new BigNumber(token1USDPrice).multipliedBy(position.amount1.toExact()));

    return totalUSD.toString();
  }, [position, token0USDPrice, token1USDPrice]);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <Box className={classes.selectNFTBox}>
      {!!position ? (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              height: "64px",
              alignItems: "center",
              cursor: "pointer",
              padding: "0 12px",
              "&:hover": {
                background: theme.palette.background.level2,
              },
            }}
            onClick={handleToggle}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0 100px",
                "@media(max-width:640px)": {
                  flexDirection: "column",
                  gap: "4px 0",
                  alignItems: "flex-start",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0 5px",
                  "@media(max-width: 640px)": {
                    gap: "0 2px",
                  },
                }}
              >
                <Checkbox
                  className={classes.checkbox}
                  checked={Number(positionInfo.id) === selectedPositionId}
                  onChange={() => {
                    if (selectedPositionId === Number(positionInfo.id)) {
                      setSelectedPositionId(undefined);
                      return;
                    }
                    if (positionInfo.liquidity !== BigInt(0)) {
                      setSelectedPositionId(Number(positionInfo.id));
                    }
                  }}
                  onClick={(event: any) => {
                    event.stopPropagation();
                    event.nativeEvent.stopImmediatePropagation();
                  }}
                />

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TokenImage src={position.pool.token0.logo} width="24px" height="24px" />
                  <Box sx={{ position: "relative", left: "-5px" }}>
                    <TokenImage src={position.pool.token1.logo} width="24px" height="24px" />
                  </Box>
                </Box>

                <Typography
                  color="text.primary"
                  fontWeight={500}
                  sx={{
                    "@media(max-width: 640px)": {
                      fontSize: "12px",
                    },
                  }}
                >
                  {position.pool.token0.symbol} / {position.pool.token1.symbol}
                </Typography>
              </Box>

              <Typography
                color="text.primary"
                sx={{
                  "@media(max-width: 640px)": {
                    fontSize: "12px",
                    padding: "0 0 0 32px",
                  },
                }}
              >
                {totalUSDValue ? formatDollarAmount(totalUSDValue) : "--"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
              <PositionRangeState outOfRange={outOfRange} closed={closed} />
              <ArrowIcon />
            </Box>
          </Box>

          {show ? (
            <Box
              sx={{
                background: theme.palette.background.level2,
                padding: "20px 12px",
                display: "flex",
                gap: "24px 0",
                flexDirection: "column",
              }}
            >
              <DetailsItem
                label={!!token0 ? `${token0?.symbol} Amount` : "--"}
                value={!!token0 ? `${token0Amount} ${token0.symbol}` : "--"}
              />
              <DetailsItem
                label={!!token1 ? `${token1?.symbol} Amount` : "--"}
                value={!!token1 ? `${token1Amount} ${token1.symbol}` : "--"}
              />
              <DetailsItem
                label={`Current Price`}
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
              />
              <DetailsItem
                label={`Price Range`}
                value={`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} - ${formatTickPrice(
                  priceUpper,
                  tickAtLimit,
                  Bound.UPPER,
                )} ${pairName}`}
              />
            </Box>
          ) : null}
        </>
      ) : (
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
      )}
    </Box>
  );
}
