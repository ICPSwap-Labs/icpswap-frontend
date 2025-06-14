import { useMemo } from "react";
import { Typography, Box, useTheme, BoxProps } from "components/Mui";
import { TokenImage } from "components/index";
import { FeeTierPercentLabel, Flex, Proportion } from "@icpswap/ui";
import { Pool } from "@icpswap/swap-sdk";
import { usePoolAPR, useInfoPool } from "@icpswap/hooks";
import { formatDollarAmount, nonUndefinedOrNull, calcPoolFees } from "@icpswap/utils";
import { PoolTvlTooltip } from "components/swap";
import { useTranslation } from "react-i18next";
import { TokenPairName } from "components/TokenPairName";
import { useMediaQuery640 } from "hooks/theme";

export interface InfoPoolProps {
  pool: Pool | undefined | null;
  wrapperSx?: BoxProps["sx"];
  noPoolDetails?: boolean;
}

export function InfoPool({ pool, wrapperSx, noPoolDetails = false }: InfoPoolProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const down640 = useMediaQuery640();

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

  const fee24h = calcPoolFees(infoPool?.volumeUSD24H);

  const apr24h = usePoolAPR({ volumeUSD: infoPool?.volumeUSD24H, tvlUSD: infoPool?.tvlUSD });

  return nonUndefinedOrNull(token0) && nonUndefinedOrNull(token1) && nonUndefinedOrNull(fee) ? (
    <Box
      sx={{
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "12px",
        padding: "16px",
        ...wrapperSx,
      }}
    >
      {noPoolDetails ? null : (
        <Flex gap="0 8px">
          <Flex>
            <TokenImage tokenId={token0?.address} logo={token0?.logo} size="24px" />
            <TokenImage tokenId={token1?.address} logo={token1?.logo} size="24px" />
          </Flex>

          <TokenPairName
            symbol0={token0.symbol}
            symbol1={token1.symbol}
            sx={{
              fontSize: "16px",
              color: "text.primary",
            }}
            width={down640 ? "180px" : "220px"}
          />
          <Flex>
            <FeeTierPercentLabel feeTier={fee} />
          </Flex>
        </Flex>
      )}

      <Flex
        gap="16px 24px"
        wrap="wrap"
        sx={{ margin: noPoolDetails ? "0" : "16px 0 0 0", "@media(max-width: 640px)": {} }}
      >
        <Flex gap="0 6px">
          <Typography>{t("common.tvl")}</Typography>

          <PoolTvlTooltip token0Id={token0.address} token1Id={token1.address} poolId={pool?.id}>
            <Typography
              color="text.primary"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                textDecorationColor: theme.colors.darkTextSecondary,
                textDecorationStyle: "dashed",
              }}
            >
              {infoPool?.tvlUSD ? formatDollarAmount(infoPool.tvlUSD) : "--"}
            </Typography>
          </PoolTvlTooltip>
        </Flex>

        <Flex gap="0 6px">
          <Typography>{t("common.apr24h")}</Typography>

          <Proportion value={apr24h ? parseFloat(apr24h) : undefined} showArrow={false} />
        </Flex>

        <Flex gap="0 6px">
          <Typography>{t("common.fee24h")}</Typography>
          <Typography color="text.primary">{fee24h ? formatDollarAmount(fee24h) : "--"}</Typography>
        </Flex>

        <Flex gap="0 6px">
          <Typography>{t("common.volume24h")}</Typography>
          <Typography color="text.primary">{infoPool ? formatDollarAmount(infoPool.volumeUSD24H) : "--"}</Typography>
        </Flex>
      </Flex>
    </Box>
  ) : null;
}
