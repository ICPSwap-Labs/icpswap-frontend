import { useCallback, useState, useMemo } from "react";
import BigNumber from "bignumber.js";
import { Price, Currency } from "@icpswap/swap-sdk";
import { formatDollarAmount } from "@icpswap/utils";
import { Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import LinkIcon from "assets/images/LinkIcon";
import { TextButton } from "components/index";
import { INFO_URL } from "constants/index";

export interface TradePricePropsNoInfo {
  price: Price<Currency, Currency> | undefined;
  token0?: Currency | undefined;
  token0PriceUSDValue?: string | null | undefined | number;
  token1?: Currency | undefined;
  token1PriceUSDValue?: string | null | undefined | number;
}

export function TradePriceNoInfo({
  price,
  token0,
  token0PriceUSDValue,
  token1,
  token1PriceUSDValue,
}: TradePricePropsNoInfo) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [showInverted, setShowInverted] = useState(true);

  let formattedPrice: string | undefined = "";
  try {
    formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);
  } catch (error) {
    formattedPrice = "0";
  }

  const label = showInverted ? `${price?.quoteCurrency?.symbol}` : `${price?.baseCurrency?.symbol} `;
  const labelInverted = showInverted ? `${price?.baseCurrency?.symbol} ` : `${price?.quoteCurrency?.symbol}`;
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted]);

  const usdValue = useMemo(() => {
    if (!price || !token0 || !token0PriceUSDValue || !token1 || !token1PriceUSDValue) return undefined;

    return showInverted
      ? price.baseCurrency.equals(token0)
        ? token0PriceUSDValue
        : token1PriceUSDValue
      : price.quoteCurrency.equals(token0)
      ? token0PriceUSDValue
      : token1PriceUSDValue;
  }, [price, showInverted, token0, token0PriceUSDValue, token1, token1PriceUSDValue]);

  const text = `${
    `1 ${  labelInverted  } = ${  formattedPrice ? new BigNumber(formattedPrice).toFormat() : "-"}`
  } ${label}`;

  return (
    <Grid container justifyContent="flex-end" alignItems="center">
      <Typography onClick={flipPrice} sx={{ cursor: "pointer", ...(matchDownSM ? { fontSize: "12px" } : {}) }}>
        {text}
      </Typography>
      {usdValue ? (
        <Typography onClick={flipPrice} sx={{ cursor: "pointer" }}>
          ({formatDollarAmount(usdValue)})
        </Typography>
      ) : null}
      <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={flipPrice} />
    </Grid>
  );
}

export interface TradePriceProps {
  price: Price<Currency, Currency> | undefined;
  token0?: Currency | undefined;
  token0PriceUSDValue?: string | null | undefined | number;
  token1?: Currency | undefined;
  token1PriceUSDValue?: string | null | undefined | number;
  poolId: string | undefined;
  v2?: boolean;
}

export default function TradePrice({
  price,
  token0,
  token0PriceUSDValue,
  token1,
  token1PriceUSDValue,
  poolId,
  v2,
}: TradePriceProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [showInverted, setShowInverted] = useState(true);

  let formattedPrice: string | undefined = "";
  try {
    formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);
  } catch (error) {
    formattedPrice = "0";
  }

  const label = showInverted ? `${price?.quoteCurrency?.symbol}` : `${price?.baseCurrency?.symbol} `;
  const labelInverted = showInverted ? `${price?.baseCurrency?.symbol} ` : `${price?.quoteCurrency?.symbol}`;
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted]);

  const usdValue = useMemo(() => {
    if (!price || !token0 || !token0PriceUSDValue || !token1 || !token1PriceUSDValue) return undefined;

    return showInverted
      ? price.baseCurrency.equals(token0)
        ? token0PriceUSDValue
        : token1PriceUSDValue
      : price.quoteCurrency.equals(token0)
      ? token0PriceUSDValue
      : token1PriceUSDValue;
  }, [price, showInverted, token0, token0PriceUSDValue, token1, token1PriceUSDValue]);

  const text = `${
    `1 ${  labelInverted  } = ${  formattedPrice ? new BigNumber(formattedPrice).toFormat() : "-"}`
  } ${label}`;

  return (
    <Grid container>
      <Grid item xs>
        <Grid container justifyContent="flex-start" alignItems="center">
          <Typography onClick={flipPrice} sx={{ cursor: "pointer", ...(matchDownSM ? { fontSize: "12px" } : {}) }}>
            {text}
          </Typography>
          {usdValue ? (
            <Typography onClick={flipPrice} sx={{ cursor: "pointer" }}>
              ({formatDollarAmount(usdValue)})
            </Typography>
          ) : null}
          <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={flipPrice} />
        </Grid>
      </Grid>

      <TextButton link={`${INFO_URL}/swap/${v2 ? "v2/" : ""}pool/details/${poolId}`}>
        Info <LinkIcon />
      </TextButton>
    </Grid>
  );
}
