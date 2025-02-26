import { useState, useMemo } from "react";
import { BoxProps, Typography, useTheme } from "components/Mui";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { useUSDPriceById } from "hooks/index";
import { formatDollarAmount, formatTokenPrice, isNullArgs } from "@icpswap/utils";

export interface PoolCurrentPriceProps {
  pool: Pool | Null;
  token?: Token | Null;
  showInverted?: boolean;
  fontSize?: string;
  sx?: BoxProps["sx"];
  onInverted?: (inverted: boolean) => void;
}

export function PoolCurrentPrice({
  pool,
  token: __token,
  showInverted = false,
  fontSize = "12px",
  sx,
  onInverted,
}: PoolCurrentPriceProps) {
  const theme = useTheme();
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { token0, token1 } = pool || {};

  const baseToken = useMemo(() => {
    if (isNullArgs(token0) || isNullArgs(token1)) return undefined;

    if (__token) {
      const anotherToken = __token.equals(token0) ? token1 : token0;
      return manuallyInverted ? anotherToken : __token;
    }

    return manuallyInverted ? token1 : token0;
  }, [__token, token0, token1]);

  const quoteToken = useMemo(() => {
    if (isNullArgs(token0) || isNullArgs(token1) || isNullArgs(baseToken)) return undefined;
    return baseToken.equals(token0) ? token1 : token0;
  }, [baseToken, token0, token1]);

  const baseTokenUSDPrice = useUSDPriceById(baseToken?.address);
  const quoteTokenUSDPrice = useUSDPriceById(quoteToken?.address);

  const price = useMemo(() => {
    if (isNullArgs(quoteToken) || isNullArgs(baseToken) || isNullArgs(pool)) return undefined;

    return manuallyInverted
      ? pool.priceOf(quoteToken).toFixed(quoteToken.decimals)
      : pool.priceOf(baseToken).toFixed(baseToken.decimals);
  }, [pool, quoteToken, manuallyInverted]);

  const label = useMemo(() => {
    if (isNullArgs(baseToken) || isNullArgs(quoteToken)) return undefined;

    return manuallyInverted
      ? `${baseToken.symbol} per ${quoteToken.symbol}`
      : `${quoteToken.symbol} per ${baseToken.symbol}`;
  }, [baseToken, quoteToken, manuallyInverted]);

  return (
    <Flex
      gap="0 4px"
      sx={{
        cursor: showInverted ? "pointer" : "default",
        ...sx,
      }}
      onClick={() => {
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
              color: "text.primary",
              fontSize,
            }}
          >
            {formatTokenPrice(price)}
          </Typography>

          <Typography
            sx={{
              fontSize,
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

      {baseTokenUSDPrice && quoteTokenUSDPrice ? (
        <Typography
          sx={{
            fontSize,
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
