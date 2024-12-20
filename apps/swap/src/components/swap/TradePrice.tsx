import { useCallback, useState, useMemo } from "react";
import { Price, Token } from "@icpswap/swap-sdk";
import { formatDollarAmount, formatTokenPrice } from "@icpswap/utils";
import { Typography, useTheme, useMediaQuery } from "components/Mui";
import LinkIcon from "assets/images/LinkIcon";
import { TextButton, Flex } from "components/index";
import { INFO_URL } from "constants/index";
import { ReactComponent as SyncAltIcon } from "assets/icons/sync-alt.svg";

export interface TradePriceProps {
  price: Price<Token, Token> | undefined;
  token0?: Token | undefined;
  token0PriceUSDValue?: string | null | undefined | number;
  token1?: Token | undefined;
  token1PriceUSDValue?: string | null | undefined | number;
  poolId?: string | undefined;
  v2?: boolean;
  fontSize?: string;
  color?: string;
  showConvert?: boolean;
  noInfo?: boolean;
}

export function TradePrice({
  price,
  token0,
  token0PriceUSDValue,
  token1,
  token1PriceUSDValue,
  poolId,
  fontSize,
  color,
  showConvert = true,
  noInfo = false,
}: TradePriceProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [showInverted, setShowInverted] = useState(true);

  const formattedPrice = useMemo(() => {
    if (!price) return null;

    return showInverted
      ? price.toFixed(price.quoteCurrency.decimals)
      : price.invert().toFixed(price.baseCurrency.decimals);
  }, [price, showInverted]);

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

  const text = `${`1 ${labelInverted} = ${formattedPrice ? formatTokenPrice(formattedPrice) : "-"}`} ${label}`;

  return (
    <Flex fullWidth justify="space-between">
      <Flex justify="flex-start" align="center">
        <Typography
          onClick={flipPrice}
          sx={{
            cursor: "pointer",
            color: color ?? "text.secondary",
            fontSize,
            ...(matchDownSM ? { fontSize: "12px" } : {}),
          }}
        >
          {text}
        </Typography>
        {usdValue ? (
          <Typography onClick={flipPrice} sx={{ color: color ?? "text.secondary", fontSize, cursor: "pointer" }}>
            ({formatDollarAmount(usdValue)})
          </Typography>
        ) : null}

        {showConvert ? (
          <SyncAltIcon style={{ fontSize: "1rem", margin: "0 0 0 4px", cursor: "pointer" }} onClick={flipPrice} />
        ) : null}
      </Flex>

      {!noInfo ? (
        <TextButton link={`${INFO_URL}/info-swap/pool/details/${poolId}`}>
          Info <LinkIcon />
        </TextButton>
      ) : null}
    </Flex>
  );
}
