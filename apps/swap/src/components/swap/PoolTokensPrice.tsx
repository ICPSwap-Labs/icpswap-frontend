import { useState } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { nonNullArgs, formatDollarAmountV1 } from "@icpswap/utils";
import { Pool } from "@icpswap/swap-sdk";
import { useUSDPriceById } from "hooks/index";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Null } from "@icpswap/types";

interface PoolTokensPriceProps {
  pool: Pool | Null;
}

export function PoolTokensPrice({ pool }: PoolTokensPriceProps) {
  const theme = useTheme();

  const [manuallyInverted, setManuallyInverted] = useState(false);

  const token0 = pool?.token0;
  const token1 = pool?.token1;
  const token0USDPrice = useUSDPriceById(token0?.address);
  const token1USDPrice = useUSDPriceById(token1?.address);

  return pool ? (
    <Box
      sx={{ background: theme.palette.background.level4, padding: "4px 8px", borderRadius: "8px", cursor: "pointer" }}
      onClick={() => setManuallyInverted(!manuallyInverted)}
    >
      <Flex gap="0 4px">
        <Typography color="text.primary">
          {nonNullArgs(token0) && nonNullArgs(token1) && nonNullArgs(pool)
            ? manuallyInverted
              ? `1 ${token1.symbol} = ${pool.priceOf(token1).toSignificant(6)} ${token0.symbol}${
                  token1USDPrice ? ` = ${formatDollarAmountV1({ num: token1USDPrice })}` : ""
                }`
              : `1 ${token0.symbol} = ${pool.priceOf(token0).toSignificant(6)} ${token1.symbol}${
                  token0USDPrice ? ` = ${formatDollarAmountV1({ num: token0USDPrice })}` : ""
                }`
            : "--"}
        </Typography>

        <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} />
      </Flex>
    </Box>
  ) : null;
}
