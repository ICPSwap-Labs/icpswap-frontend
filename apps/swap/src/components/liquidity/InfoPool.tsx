import { useMemo } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { Trans } from "@lingui/macro";
import { TokenImage } from "components/index";
import { FeeTierPercentLabel, Flex, Proportion } from "@icpswap/ui";
import { Pool } from "@icpswap/swap-sdk";
import { usePoolApr24h, useAllPoolsTVL } from "@icpswap/hooks";
import { formatDollarAmount, nonNullArgs, calcFee24h } from "@icpswap/utils";
import { useInfoPool } from "hooks/info/useInfoPool";

export interface InfoPoolProps {
  pool: Pool | undefined | null;
}

export function InfoPool({ pool }: InfoPoolProps) {
  const theme = useTheme();

  const { result: allPoolsTVL } = useAllPoolsTVL();
  const { result: infoPool } = useInfoPool(pool?.id);

  const { token0, token1, fee } = useMemo(() => {
    if (!pool) return {};

    const token0 = pool.token0;
    const token1 = pool.token1;
    const fee = pool.fee;

    return {
      token0,
      token1,
      fee,
    };
  }, [pool]);

  const poolTvlUSD = useMemo(() => {
    if (!allPoolsTVL || !pool) return undefined;

    return allPoolsTVL.find((e) => e[0] === pool.id)?.[1];
  }, [allPoolsTVL, pool]);

  const fee24h = calcFee24h(infoPool?.volumeUSD);

  const apr24h = usePoolApr24h({ volumeUSD: infoPool?.volumeUSD, poolTvlUSD });

  return nonNullArgs(token0) && nonNullArgs(token1) && nonNullArgs(fee) ? (
    <Box
      sx={{
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <Flex gap="0 8px">
        <Flex>
          <TokenImage tokenId={token0?.address} logo={token0?.logo} size="24px" />
          <TokenImage tokenId={token1?.address} logo={token1?.logo} size="24px" />
        </Flex>
        <Flex>
          <Typography
            sx={{
              fontSize: "16px",
              color: "text.primary",
            }}
          >
            {token0.symbol}/{token1.symbol}
          </Typography>
        </Flex>
        <Flex>
          <FeeTierPercentLabel feeTier={fee} />
        </Flex>
      </Flex>

      <Flex gap="16px 24px" wrap="wrap" sx={{ margin: "16px 0 0 0", "@media(max-width: 640px)": {} }}>
        <Flex gap="0 6px">
          <Typography>
            <Trans>TVL</Trans>
          </Typography>
          <Typography color="text.primary">{poolTvlUSD ? formatDollarAmount(poolTvlUSD) : "--"}</Typography>
        </Flex>

        <Flex gap="0 6px">
          <Typography>
            <Trans>APR 24H</Trans>
          </Typography>

          <Proportion value={apr24h ? parseFloat(apr24h) : undefined} showArrow={false} />
        </Flex>

        <Flex gap="0 6px">
          <Typography>
            <Trans>Fee 24H</Trans>
          </Typography>
          <Typography color="text.primary">{fee24h ? formatDollarAmount(fee24h) : "--"}</Typography>
        </Flex>

        <Flex gap="0 6px">
          <Typography>
            <Trans>Volume 24H</Trans>
          </Typography>
          <Typography color="text.primary">{infoPool ? formatDollarAmount(infoPool.volumeUSD) : "--"}</Typography>
        </Flex>
      </Flex>
    </Box>
  ) : null;
}
