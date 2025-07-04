import { useState, useMemo } from "react";
import { BoxProps, Typography, useTheme } from "components/Mui";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { useUSDPriceById } from "hooks/index";
import { formatDollarAmount, formatTokenPrice, isUndefinedOrNull } from "@icpswap/utils";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";

export interface PoolCurrentPriceProps {
  pool: Pool | Null;
  token?: Token | Null;
  fontSize?: string;
  sx?: BoxProps["sx"];
  usdValueColor?: string;
  usdValueSize?: string;
  symbolColor?: string;
  symbolSize?: string;
  priceColor?: string;
  priceSize?: string;
  showUsdValue?: boolean;
  showInverted?: boolean;
  onInverted?: (inverted: boolean) => void;
}

export function PoolCurrentPrice({
  pool,
  token: __token,
  showInverted = false,
  fontSize = "12px",
  sx,
  onInverted,
  usdValueColor = "text.secondary",
  usdValueSize,
  priceColor = "text.primary",
  priceSize,
  symbolColor = "text.secondary",
  symbolSize,
  showUsdValue = true,
}: PoolCurrentPriceProps) {
  const theme = useTheme();
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { token0, token1 } = pool || {};

  const baseToken = useMemo(() => {
    if (isUndefinedOrNull(token0) || isUndefinedOrNull(token1)) return undefined;

    if (__token) {
      const anotherToken = __token.equals(token0) ? token1 : token0;
      return manuallyInverted ? anotherToken : __token;
    }

    return manuallyInverted ? token1 : token0;
  }, [__token, token0, token1]);

  const quoteToken = useMemo(() => {
    if (isUndefinedOrNull(token0) || isUndefinedOrNull(token1) || isUndefinedOrNull(baseToken)) return undefined;
    return baseToken.equals(token0) ? token1 : token0;
  }, [baseToken, token0, token1]);

  const baseTokenUSDPrice = useUSDPriceById(baseToken?.address);
  const quoteTokenUSDPrice = useUSDPriceById(quoteToken?.address);

  const price = useMemo(() => {
    if (isUndefinedOrNull(quoteToken) || isUndefinedOrNull(baseToken) || isUndefinedOrNull(pool)) return undefined;

    return manuallyInverted
      ? pool.priceOf(quoteToken).toFixed(quoteToken.decimals)
      : pool.priceOf(baseToken).toFixed(baseToken.decimals);
  }, [pool, quoteToken, manuallyInverted]);

  const label = useMemo(() => {
    if (isUndefinedOrNull(baseToken) || isUndefinedOrNull(quoteToken)) return undefined;

    return manuallyInverted
      ? `${tokenSymbolEllipsis({
          symbol: baseToken.symbol,
        })} per ${tokenSymbolEllipsis({ symbol: quoteToken.symbol })}`
      : `${tokenSymbolEllipsis({ symbol: quoteToken.symbol })} per ${tokenSymbolEllipsis({
          symbol: baseToken.symbol,
        })}`;
  }, [baseToken, quoteToken, manuallyInverted]);

  return (
    <Flex
      gap="0 4px"
      sx={{
        cursor: showInverted ? "pointer" : "default",
        ...sx,
      }}
      onClick={(event) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        if (showInverted) {
          setManuallyInverted(!manuallyInverted);
          if (onInverted) onInverted(!manuallyInverted);
        }
      }}
    >
      {price && label ? (
        <>
          <Typography
            sx={{
              color: priceColor,
              fontSize: priceSize ?? fontSize,
            }}
          >
            {formatTokenPrice(price)}
          </Typography>

          <Typography
            sx={{
              fontSize: symbolSize ?? fontSize,
              color: symbolColor,
            }}
          >
            {label}
          </Typography>
        </>
      ) : (
        <Typography
          sx={{
            fontSize: "12px",
          }}
          component="div"
        >
          --
        </Typography>
      )}

      {baseTokenUSDPrice && quoteTokenUSDPrice && showUsdValue ? (
        <Typography
          sx={{
            fontSize: usdValueSize ?? fontSize,
            color: usdValueColor,
          }}
        >
          ({formatDollarAmount(manuallyInverted ? quoteTokenUSDPrice : baseTokenUSDPrice)})
        </Typography>
      ) : null}

      {showInverted ? (
        <SyncAltIcon
          sx={{
            fontSize: "1rem",
            color: theme.palette.text.secondary,
          }}
        />
      ) : null}
    </Flex>
  );
}
