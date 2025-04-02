import { useState, useMemo } from "react";
import { Typography, Grid, Box, makeStyles, Theme } from "components/Mui";
import { formatTickPrice } from "utils/swap/formatTickPrice";
import useIsTickAtLimit from "hooks/swap/useIsTickAtLimit";
import { Bound } from "constants/swap";
import { Position, getPriceOrderingFromPositionForUI, useInverter } from "@icpswap/swap-sdk";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { TokenImage } from "components/Image/Token";
import { PositionRangeState } from "components/swap/index";
import { usePositionState } from "hooks/liquidity";
import { useTranslation } from "react-i18next";

const useStyle = makeStyles((theme: Theme) => ({
  NFTBox: {
    marginRight: "12px",
    borderRadius: "12px",
    background: theme.palette.background.level2,
    width: "300px",
    height: "332px",
    "@media(max-width: 680px)": {
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

export interface LiquidityInfoProps {
  position: Position | undefined;
  positionId: string | number | bigint | undefined;
  version?: "v2" | "v3";
}

export default function LiquidityInfo({ position }: LiquidityInfoProps) {
  const { t } = useTranslation();
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

  const positionState = usePositionState(position);

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

        <PositionRangeState state={positionState} />
      </Grid>

      <Grid item xs sx={{ margin: "24px 0 0 0" }}>
        <Grid container alignItems="center" className={classes.currentPrice}>
          <Typography color="text.primary">{t("common.current.price")}</Typography>
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
                {t("common.price.range")}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: "0 24px" }}>
            <Grid container justifyContent="center" alignItems="center" mt="10px" className={classes.rangeBox}>
              <Box>
                <Grid container justifyContent="center" alignItems="center" flexDirection="column">
                  <Typography fontSize="12px" fontWeight="500">
                    {t("common.min.price")}
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
                    {t("common.max.price")}
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
