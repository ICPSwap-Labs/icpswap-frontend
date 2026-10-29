import { useDesignVersion } from "hooks/useDesignVersion";
import { useInfoToken, useTokenAnalysis } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { Flex, MainCard, Proportion, TokenImage } from "@icpswap/ui";
import { BigNumber, formatDollarAmount, isUndefinedOrNull, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { Box, Typography, useTheme } from "components/Mui";
import { useTokenSupply } from "hooks/token/calls";
import { useIcpBlocks } from "hooks/useICBlocks";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useICP2CyclesManager } from "store/global/hooks";

export function Icp() {
  const { isClassicDesign } = useDesignVersion();
  const theme = useTheme();

  const { t } = useTranslation();

  const icpTokenInfo = useInfoToken(ICP.address);
  const { data: icpTotalSupply } = useTokenSupply(ICP.address);
  const { data: tokenAnalysis } = useTokenAnalysis(ICP.address);

  const icpToCycles = useICP2CyclesManager();

  const { data: blocksData } = useIcpBlocks();
  const blocks = blocksData?.blocks;
  const secondBlocks = blocksData?.secondBlocks;

  const fdv = useMemo(() => {
    if (isUndefinedOrNull(icpTotalSupply) || isUndefinedOrNull(icpTokenInfo)) return null;

    return formatDollarAmount(
      parseTokenAmount(icpTotalSupply, ICP.decimals).multipliedBy(icpTokenInfo.price).toString(),
    );
  }, [icpTotalSupply, icpTokenInfo]);

  const marketCap = useMemo(() => {
    if (isUndefinedOrNull(tokenAnalysis) || isUndefinedOrNull(icpTokenInfo)) return null;

    return formatDollarAmount(new BigNumber(tokenAnalysis.marketAmount).multipliedBy(icpTokenInfo.price).toString());
  }, [tokenAnalysis, icpTokenInfo]);

  if (isClassicDesign) {
    return (
      <MainCard
        level={3}
        sx={{
          padding: "32px",
          "@media(max-width: 640px)": {
            padding: "16px",
          },
        }}
      >
        <Flex
          gap="0 8px"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: " 16px 0",
              alignItems: "flex-start",
            },
          }}
        >
          <Flex gap="0 8px">
            <TokenImage logo={ICP.logo} size="24px" />

            <Flex gap="0 4px">
              <Typography color="text.primary" fontWeight={500} fontSize="18px">
                ICP
              </Typography>
              <Typography fontSize="12px">(Internet Computer)</Typography>
            </Flex>
          </Flex>

          <Box sx={{ padding: "4px 12px", borderRadius: "30px", background: theme.palette.background.level4 }}>
            <Typography>1 ICP = {icpToCycles || "--"} T Cycles</Typography>
          </Box>
        </Flex>

        <Box sx={{ margin: "30px 0 0 0" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              "@media(max-width: 640px)": {
                gridTemplateColumns: "1fr",
                gap: "24px 0",
              },
            }}
          >
            <Box>
              <Typography>{t("common.price")}</Typography>
              <Flex gap="0 4px" align="flex-end">
                <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
                  {icpTokenInfo ? formatDollarAmount(icpTokenInfo.price) : "--"}
                </Typography>

                <Proportion value={icpTokenInfo?.priceChange24H} fontSize="16px" />
              </Flex>
            </Box>

            <Box>
              <Typography>{t("common.market.cap")}</Typography>
              <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
                {nonUndefinedOrNull(marketCap) ? marketCap : "--"}
              </Typography>
            </Box>

            <Box>
              <Typography>{t("common.fully.diluted.cap")}</Typography>
              <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
                {nonUndefinedOrNull(fdv) ? fdv : "--"}
              </Typography>
            </Box>

            <Box>
              <Typography>{t("common.blocks")}</Typography>
              <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
                {blocks ? new BigNumber(blocks).toFormat() : "--"}
              </Typography>
            </Box>

            <Box>
              <Typography>{t("common.blocks.each.second")}</Typography>
              <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
                {secondBlocks ? new BigNumber(secondBlocks).toFixed(2) : "--"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard
      level={3}
      sx={{
        padding: "0",
        "@media(max-width: 640px)": {
          padding: "0",
        },
      }}
    >
      <Flex
        gap="0 8px"
        justify="space-between"
        sx={{
          padding: "28px",
          borderBottom: "1px solid var(--color-base-300)",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: " 16px 0",
            alignItems: "flex-start",
          },
        }}
      >
        <Flex gap="0 8px">
          <TokenImage logo={ICP.logo} size="24px" />

          <Flex gap="0 4px">
            <Typography color="text.primary" fontWeight={700} fontSize="24px">
              ICP
            </Typography>
            <Typography fontSize="12px">(Internet Computer)</Typography>
          </Flex>
        </Flex>

        <Box
          sx={{
            padding: "8px 0",
            fontFamily: "var(--font-mono, monospace)",
            "& .MuiTypography-root": { fontFamily: "inherit", fontSize: "11px", color: "var(--color-secondary)" },
          }}
        >
          <Typography>1 ICP = {icpToCycles || "--"} T Cycles</Typography>
        </Box>
      </Flex>

      <Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            "& > .ics-metric": { padding: "24px", borderRight: "1px solid var(--color-base-300)", minWidth: 0 },
            "& > .ics-metric:last-child": { borderRight: 0 },
            "& .ics-metric > .MuiTypography-root:first-child": {
              fontSize: "11px",
              letterSpacing: "0.04em",
              lineHeight: 1.6,
            },
            "& .ics-metric > .MuiTypography-root:last-child, & .ics-metric > .MuiBox-root .MuiTypography-root": {
              fontFamily: "var(--font-mono, monospace)",
              fontVariantNumeric: "tabular-nums",
            },
            "@media(max-width: 1100px)": {
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              "& > .ics-metric": { borderBottom: "1px solid var(--color-base-300)" },
            },
            "@media(max-width: 640px)": {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0",
              "& > .ics-metric": { padding: "20px", borderBottom: "1px solid var(--color-base-300)" },
              "& > .ics-metric:nth-of-type(2n)": { borderRight: 0 },
            },
          }}
        >
          <Box className="ics-metric">
            <Typography>{t("common.price")}</Typography>
            <Flex gap="0 4px" align="flex-end">
              <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
                {icpTokenInfo ? formatDollarAmount(icpTokenInfo.price) : "--"}
              </Typography>

              <Proportion value={icpTokenInfo?.priceChange24H} fontSize="16px" />
            </Flex>
          </Box>

          <Box className="ics-metric">
            <Typography>{t("common.market.cap")}</Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {nonUndefinedOrNull(marketCap) ? marketCap : "--"}
            </Typography>
          </Box>

          <Box className="ics-metric">
            <Typography>{t("common.fully.diluted.cap")}</Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {nonUndefinedOrNull(fdv) ? fdv : "--"}
            </Typography>
          </Box>

          <Box className="ics-metric">
            <Typography>{t("common.blocks")}</Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {blocks ? new BigNumber(blocks).toFormat() : "--"}
            </Typography>
          </Box>

          <Box className="ics-metric">
            <Typography>{t("common.blocks.each.second")}</Typography>
            <Typography sx={{ margin: "14px 0 0 0", fontSize: "20px", fontWeight: 500, color: "text.primary" }}>
              {secondBlocks ? new BigNumber(secondBlocks).toFixed(2) : "--"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </MainCard>
  );
}
