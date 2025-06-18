import { useState } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { nonUndefinedOrNull, formatDollarTokenPrice } from "@icpswap/utils";
import { Pool } from "@icpswap/swap-sdk";
import { useUSDPriceById } from "hooks/index";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { Null } from "@icpswap/types";

interface PoolTokensPriceProps {
  pool: Pool | Null;
  width?: string;
}

export function PoolTokensPrice({ pool, width }: PoolTokensPriceProps) {
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
        <Typography color="text.primary" className="text-overflow-ellipsis" sx={{ maxWidth: width }}>
          {nonUndefinedOrNull(token0) && nonUndefinedOrNull(token1) && nonUndefinedOrNull(pool)
            ? manuallyInverted
              ? `1 ${token1.symbol} = ${pool.priceOf(token1).toSignificant(6)} ${token0.symbol}${
                  token1USDPrice ? ` = ${formatDollarTokenPrice(token1USDPrice)}` : ""
                }`
              : `1 ${token0.symbol} = ${pool.priceOf(token0).toSignificant(6)} ${token1.symbol}${
                  token0USDPrice ? ` = ${formatDollarTokenPrice(token0USDPrice)}` : ""
                }`
            : "--"}
        </Typography>

        <SyncAltIcon sx={{ fontSize: "1rem", marginLeft: "6px", cursor: "pointer" }} />
      </Flex>
    </Box>
  ) : null;
}
