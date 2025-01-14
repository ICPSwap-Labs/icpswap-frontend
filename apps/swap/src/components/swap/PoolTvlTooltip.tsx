import { ReactElement } from "react";
import { Typography, useTheme } from "components/Mui";
import { TokenImage } from "components/index";
import { Tooltip, Flex } from "@icpswap/ui";
import { formatDollarAmount, formatAmount, parseTokenAmount } from "@icpswap/utils";
import type { Null } from "@icpswap/types";
import { usePoolTvlV2 } from "hooks/swap/usePoolTVL";
import { useToken } from "hooks";

interface PoolTvlTooltipProps {
  token0Id: string | Null;
  token1Id: string | Null;
  poolId: string | Null;
  children: ReactElement;
}

export function PoolTvlTooltip({ token0Id, token1Id, poolId, children }: PoolTvlTooltipProps) {
  const theme = useTheme();

  const [, token0] = useToken(token0Id);
  const [, token1] = useToken(token1Id);

  const { token0Tvl, token1Tvl, token0Balance, token1Balance } = usePoolTvlV2({ token0, token1, poolId });

  return (
    <Tooltip
      tips={
        <Flex fullWidth vertical gap="8px 0" align="flex-start">
          <Flex gap="0 6px">
            <TokenImage logo={token0?.logo} size="18px" tokenId={token0Id} />
            <Typography
              sx={{
                color: theme.palette.background.level1,
                fontSize: "12px",
              }}
            >
              {token0Balance && token0
                ? `${formatAmount(parseTokenAmount(token0Balance, token0.decimals).toString())} ${token0.symbol}`
                : "--"}
              {token0Tvl ? ` (${formatDollarAmount(token0Tvl)})` : ""}
            </Typography>
          </Flex>

          <Flex gap="0 6px">
            <TokenImage logo={token1?.logo} size="18px" tokenId={token1Id} />
            <Typography
              sx={{
                color: theme.palette.background.level1,
                fontSize: "12px",
              }}
            >
              {token1Balance && token1
                ? `${formatAmount(parseTokenAmount(token1Balance, token1.decimals).toString())} ${token1.symbol}`
                : "--"}
              {token1Tvl ? ` (${formatDollarAmount(token1Tvl)})` : ""}
            </Typography>
          </Flex>
        </Flex>
      }
    >
      {children}
    </Tooltip>
  );
}
