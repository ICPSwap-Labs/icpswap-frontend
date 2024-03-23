import { useState, useMemo } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { Position, Price, Token } from "@icpswap/swap-sdk";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Trans } from "@lingui/macro";
import { Theme, createTheme } from "@mui/material/styles";
import PositionRangeState from "./PositionRangeState";
import { TokenImage } from "components/Image/Token";

export const customizeTheme = createTheme({
  breakpoints: {
    values: {
      sm: 680,
    },
  },
});

const useStyle = makeStyles((theme: Theme) => ({
  NFTBox: {
    marginRight: "12px",
    borderRadius: "12px",
    background: theme.palette.background.level2,
    width: "300px",
    height: "332px",

    [customizeTheme.breakpoints.down("sm")]: {
      width: "100%",
      height: "332px",
      marginBottom: "20px",
      marginRight: "0px",
    },
  },
  NFTWrapper: {
    width: "300px",
    height: "300px",
    position: "relative",
  },
  currentPrice: {
    height: "52px",
    borderRadius: "12px",
    border: `1px solid ${theme.palette.background.level3}`,
    background: theme.palette.background.level2,
    padding: "0 20px",
  },
  rangeBox: {
    height: "112px",
    borderRadius: "12px",
    border: `1px solid ${theme.palette.background.level3}`,
    background: theme.palette.background.level2,
  },
}));

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

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower: Price<Token, Token> | undefined;
  priceUpper: Price<Token, Token> | undefined;
  quote: Token | undefined;
  base: Token | undefined;
  invert: boolean;
}) => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  };
};

export interface LiquidityInfoProps {
  position: Position | undefined;
  positionId: string | number | bigint | undefined;
  version?: "v2" | "v3";
}

function hasLiquidity(position: Position | undefined) {
  return position?.liquidity?.toString() !== "0";
}

export default function LiquidityInfo({ position, positionId, version }: LiquidityInfoProps) {
  const classes = useStyle();

  const { pool, tickLower, tickUpper } = position || {};
  const { token0, token1, fee: feeAmount } = pool || {};

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const currencyQuote = inverted ? token0 : token1;
  const currencyBase = inverted ? token1 : token0;

  const _tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper);

  const tickAtLimit = useMemo(() => {
    if (!inverted) return _tickAtLimit;

    return {
      [Bound.LOWER]: _tickAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _tickAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_tickAtLimit, inverted]);

  const pairName = useMemo(() => {
    return !!currencyQuote && !!currencyBase ? `${currencyQuote?.symbol} per ${currencyBase?.symbol}` : "--";
  }, [currencyQuote, currencyBase]);

  const outOfRange =
    pool && (tickUpper || tickUpper === 0) && (tickLower || tickLower === 0)
      ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper
      : false;

  const closed = !hasLiquidity(position);

  return (
    <Grid container flexDirection="column">
      <Grid container justifyContent="space-between" alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TokenImage logo={token0?.logo} tokenId={token0?.address} />
          <Box sx={{ width: "32px", height: "32px", position: "relative", left: "-10px" }}>
            <TokenImage logo={token1?.logo} tokenId={token1?.address} />
          </Box>

          <Typography
            sx={{
              fontSize: "28px",
              color: "#fff",
              fontWeight: 500,
              "@media(max-width: 640px)": {
                fontSize: "18px",
              },
            }}
          >
            {token0?.symbol}
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              color: "#fff",
              fontWeight: 500,
              margin: "0 10px",
              "@media(max-width: 640px)": {
                fontSize: "16px",
              },
            }}
          >
            /
          </Typography>
          <Typography
            sx={{
              fontSize: "28px",
              color: "#fff",
              fontWeight: 500,
              "@media(max-width: 640px)": {
                fontSize: "18px",
              },
            }}
          >
            {token1?.symbol}
          </Typography>
        </Box>

        <PositionRangeState outOfRange={outOfRange} closed={closed} />
      </Grid>

      <Grid item xs sx={{ margin: "24px 0 0 0" }}>
        <Grid container alignItems="center" className={classes.currentPrice}>
          <Typography color="text.primary">
            <Trans>Current Price</Trans>
          </Typography>
          <Grid item xs>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Typography
                fontWeight="500"
                color="text.primary"
                sx={{ maxWidth: "190px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
              >
                {!!token1 && !!token0
                  ? inverted
                    ? pool?.priceOf(token1)
                      ? `${pool?.priceOf(token1).toSignificant(6)}`
                      : "--"
                    : pool?.priceOf(token0)
                    ? `${pool?.priceOf(token0).toSignificant(6)}`
                    : "--"
                  : "--"}
              </Typography>
              <SyncAltIcon
                sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }}
                onClick={() => setManuallyInverted(!manuallyInverted)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Box mt="20px">
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography color="text.primary" fontWeight="700">
                Price Range
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: "0 24px" }}>
            <Grid container justifyContent="center" alignItems="center" mt="10px" className={classes.rangeBox}>
              <Box>
                <Grid container justifyContent="center" alignItems="center" flexDirection="column">
                  <Typography fontSize="12px" fontWeight="500">
                    Min Price
                  </Typography>
                  <Typography fontSize="20px" fontWeight="700" color="text.primary" sx={{ margin: "6px 0" }}>
                    {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)}
                  </Typography>
                  <Typography fontSize="12px" fontWeight="500">
                    {pairName}
                  </Typography>
                </Grid>
              </Box>
            </Grid>

            <Grid container justifyContent="center" alignItems="center" mt="8px" className={classes.rangeBox}>
              <Box>
                <Grid container justifyContent="center" alignItems="center" flexDirection="column">
                  <Typography fontSize="12px" fontWeight="500">
                    Max Price
                  </Typography>
                  <Typography fontSize="20px" fontWeight="700" color="text.primary" sx={{ margin: "6px 0" }}>
                    {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)}
                  </Typography>
                  <Typography fontSize="12px" fontWeight="500">
                    {pairName}
                  </Typography>
                </Grid>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
