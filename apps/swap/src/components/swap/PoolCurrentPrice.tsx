import { useState, useMemo } from "react";
import { BoxProps, Typography, useTheme } from "components/Mui";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { useUSDPriceById } from "hooks/index";
import { formatDollarAmount } from "@icpswap/utils";

export interface PoolCurrentPriceProps {
  pool: Pool | Null;
  token?: Token | Null;
  showInverted?: boolean;
  fontSize?: string;
  sx?: BoxProps["sx"];
}

export function PoolCurrentPrice({
  pool,
  token: __token,
  showInverted = false,
  fontSize = "12px",
  sx,
}: PoolCurrentPriceProps) {
  const theme = useTheme();
  const [manuallyInverted, setManuallyInverted] = useState(false);

  const { token0, token1 } = pool || {};

  const token = useMemo(() => {
    if (__token) return __token;
    if (!token0 || !token1) return undefined;

    return manuallyInverted ? token1 : token0;
  }, [__token, token0, token1, manuallyInverted]);

  const token0USDPrice = useUSDPriceById(token0?.address);
  const token1USDPrice = useUSDPriceById(token1?.address);

  const price = useMemo(() => {
    if (!token || !pool) return undefined;
    return pool.priceOf(token);
  }, [pool, token]);

  const label = useMemo(() => {
    if (!token0 || !token1) return undefined;
    return manuallyInverted ? `${token1.symbol} per ${token0.symbol}` : `${token0.symbol} per ${token1.symbol}`;
  }, [token0, token1, manuallyInverted]);

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
            {price?.toSignificant()}
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

      {token0USDPrice && token1USDPrice ? (
        <Typography
          sx={{
            fontSize,
          }}
        >
          ({formatDollarAmount(manuallyInverted ? token1USDPrice : token0USDPrice)})
        </Typography>
      ) : null}

      {showInverted ? (
        <SyncAltIcon
          sx={{
            fontSize: "14px",
            color: theme.palette.text.secondary,
          }}
        />
      ) : null}
    </Flex>
  );
}
