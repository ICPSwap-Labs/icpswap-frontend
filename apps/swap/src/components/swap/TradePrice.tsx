import { useCallback, useState, useMemo } from "react";
import { Price, Token } from "@icpswap/swap-sdk";
import { formatDollarAmount, BigNumber, toSignificantWithGroupSeparator, isNullArgs } from "@icpswap/utils";
import { Typography, Grid, useTheme, useMediaQuery } from "components/Mui";
import LinkIcon from "assets/images/LinkIcon";
import { TextButton } from "components/index";
import { INFO_URL } from "constants/index";
import { ReactComponent as SyncAltIcon } from "assets/icons/sync-alt.svg";
import { useUSDPriceById } from "hooks";
import { Null } from "@icpswap/types";

export interface TradePricePropsNoInfo {
  price: Price<Token, Token> | undefined;
  token0?: Token | undefined;
  token0PriceUSDValue?: string | null | undefined | number;
  token1?: Token | undefined;
  token1PriceUSDValue?: string | null | undefined | number;
  showConvert?: boolean;
  color?: string;
}

export function TradePriceNoInfo({
  price,
  token0,
  token0PriceUSDValue,
  token1,
  token1PriceUSDValue,
  showConvert = true,
  color,
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

  const text = `${`1 ${labelInverted} = ${formattedPrice ? new BigNumber(formattedPrice).toFormat() : "-"}`} ${label}`;

  return (
    <Grid container justifyContent="flex-end" alignItems="center">
      <Typography
        onClick={flipPrice}
        sx={{ cursor: "pointer", color: color ?? "text.secondary", ...(matchDownSM ? { fontSize: "12px" } : {}) }}
      >
        {text}
      </Typography>
      {usdValue ? (
        <Typography onClick={flipPrice} sx={{ color: color ?? "text.secondary", cursor: "pointer" }}>
          &nbsp;({formatDollarAmount(usdValue)})
        </Typography>
      ) : null}
      {showConvert ? (
        <SyncAltIcon style={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={flipPrice} />
      ) : null}
    </Grid>
  );
}

export interface TradePriceProps {
  price: Price<Token, Token> | undefined;
  token0?: Token | undefined;
  token0PriceUSDValue?: string | null | undefined | number;
  token1?: Token | undefined;
  token1PriceUSDValue?: string | null | undefined | number;
  poolId: string | undefined;
  v2?: boolean;
  fontSize?: string;
}

export default function TradePrice({
  price,
  token0,
  token0PriceUSDValue,
  token1,
  token1PriceUSDValue,
  poolId,
  v2,
  fontSize,
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

  const text = `${`1 ${labelInverted} = ${formattedPrice ? new BigNumber(formattedPrice).toFormat() : "-"}`} ${label}`;

  return (
    <Grid container>
      <Grid item xs>
        <Grid container justifyContent="flex-start" alignItems="center">
          <Typography
            onClick={flipPrice}
            sx={{ cursor: "pointer", fontSize, ...(matchDownSM ? { fontSize: "12px" } : {}) }}
          >
            {text}
          </Typography>
          {usdValue ? (
            <Typography onClick={flipPrice} sx={{ fontSize, cursor: "pointer" }}>
              ({formatDollarAmount(usdValue)})
            </Typography>
          ) : null}
          <SyncAltIcon style={{ fontSize: "1rem", margin: "0 0 0 4px", cursor: "pointer" }} onClick={flipPrice} />
        </Grid>
      </Grid>

      <TextButton link={`${INFO_URL}/swap/${v2 ? "v2/" : ""}pool/details/${poolId}`}>
        Info <LinkIcon />
      </TextButton>
    </Grid>
  );
}

export interface TradePriceV2Props {
  price: string | Null;
  token0: Token | Null;
  token1: Token | Null;
  showConvert?: boolean;
  color?: string;
}

export function TradePriceV2({ price, token0, token1, showConvert = true, color }: TradePriceV2Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [showInverted, setShowInverted] = useState(true);

  const token0USDPrice = useUSDPriceById(token0?.address);
  const token1USDPrice = useUSDPriceById(token1?.address);

  const formattedPrice = price
    ? showInverted
      ? toSignificantWithGroupSeparator(price)
      : toSignificantWithGroupSeparator(new BigNumber(1).dividedBy(price).toString())
    : undefined;

  const label = showInverted ? `${token1?.symbol}` : `${token0?.symbol} `;
  const labelInverted = showInverted ? `${token0?.symbol} ` : `${token1?.symbol}`;
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted]);

  const usdValue = useMemo(() => {
    if (
      isNullArgs(price) ||
      isNullArgs(token0) ||
      isNullArgs(token0USDPrice) ||
      isNullArgs(token1) ||
      isNullArgs(token1USDPrice)
    )
      return undefined;

    return showInverted ? token0USDPrice : token1USDPrice;
  }, [price, showInverted, token0, token0USDPrice, token1, token1USDPrice]);

  const text = `${`1 ${labelInverted} = ${formattedPrice ? new BigNumber(formattedPrice).toFormat() : "-"}`} ${label}`;

  return (
    <Grid container justifyContent="flex-end" alignItems="center">
      <Typography
        onClick={flipPrice}
        sx={{ cursor: "pointer", color: color ?? "text.secondary", ...(matchDownSM ? { fontSize: "12px" } : {}) }}
      >
        {text}
      </Typography>
      {usdValue ? (
        <Typography onClick={flipPrice} sx={{ color: color ?? "text.secondary", cursor: "pointer" }}>
          &nbsp;({formatDollarAmount(usdValue)})
        </Typography>
      ) : null}
      {showConvert ? (
        <SyncAltIcon style={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} onClick={flipPrice} />
      ) : null}
    </Grid>
  );
}
