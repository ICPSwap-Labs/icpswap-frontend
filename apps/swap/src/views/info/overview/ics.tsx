import { useDesignVersion } from "hooks/useDesignVersion";
import { useInfoToken, useTokenAnalysis, useTokenBurned, useTokenSupply } from "@icpswap/hooks";
import { ICP, ICS } from "@icpswap/tokens";
import { Flex, Proportion } from "@icpswap/ui";
import {
  BigNumber,
  formatAmount,
  formatDollarAmount,
  formatDollarTokenPrice,
  nonUndefinedOrNull,
  parseTokenAmount,
} from "@icpswap/utils";
import { TokenImage } from "components/index";
import { Box, Typography, useTheme } from "components/Mui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ICSPriceChart } from "./icsPriceChart";

export function Ics() {
  const { isClassicDesign } = useDesignVersion();
  const theme = useTheme();

  const { t } = useTranslation();

  const infoToken = useInfoToken(ICS.address);
  const icpInfoToken = useInfoToken(ICP.address);
  const { data: tokenSupply } = useTokenSupply(ICS.address);
  const { data: tokenAnalysis } = useTokenAnalysis(ICS.address);
  const { data: tokenBurned } = useTokenBurned(ICS.address);

  const marketCap = useMemo(() => {
    if (nonUndefinedOrNull(tokenAnalysis) && nonUndefinedOrNull(infoToken)) {
      return new BigNumber(tokenAnalysis.marketAmount).multipliedBy(infoToken.price).toString();
    }
  }, [tokenAnalysis, infoToken]);

  const fdv = useMemo(() => {
    if (nonUndefinedOrNull(tokenSupply) && nonUndefinedOrNull(infoToken)) {
      return parseTokenAmount(tokenSupply, ICS.decimals).multipliedBy(infoToken.price).toString();
    }
  }, [tokenSupply, infoToken]);

  if (isClassicDesign) {
    return (
      <Box
        sx={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: "1fr 320px",
          "@media(max-width: 640px)": {
            gridTemplateColumns: "1fr",
            gap: "20px",
          },
        }}
      >
        <Flex
          sx={{
            background: theme.palette.background.level3,
            padding: "32px",
            borderTopLeftRadius: "24px",
            borderBottomLeftRadius: "24px",
            "@media(max-width: 640px)": {
              borderTopRightRadius: "24px",
              borderBottomRightRadius: "24px",
              padding: "16px",
            },
          }}
          vertical
          align="flex-start"
        >
          <Flex
            justify="space-between"
            fullWidth
            sx={{
              "@media(max-width: 640px)": {
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px 0",
              },
            }}
          >
            <Flex gap="0 12px">
              <TokenImage size="36px" logo={ICS.logo} tokenId={ICS.address} />

              <Flex align="flex-end" gap="0 8px">
                <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "24px" }}>ICS</Typography>
                <Typography sx={{ fontSize: "16px" }}>ICPSwap Token</Typography>
              </Flex>
            </Flex>

            {infoToken && icpInfoToken ? (
              <Typography>
                1 ICS = {new BigNumber(infoToken.price).dividedBy(icpInfoToken.price).toFormat(5)} ICP
              </Typography>
            ) : null}
          </Flex>

          <Flex justify="space-between" fullWidth sx={{ margin: "16px 0 0 0" }}>
            <Flex gap="0 8px" align="flex-end">
              <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "32px" }}>
                {infoToken ? formatDollarTokenPrice(infoToken.price) : "--"}
              </Typography>

              <Proportion value={infoToken?.priceChange24H} />
            </Flex>
          </Flex>

          <Box sx={{ margin: "32px 0 0 0", width: "100%" }}>
            <ICSPriceChart />
          </Box>
        </Flex>

        <Flex
          vertical
          align="stretch"
          sx={{
            height: "100%",
            background: theme.palette.background.level4,
            borderTopRightRadius: "24px",
            borderBottomRightRadius: "24px",
            gap: "40px 0",
            padding: "32px",
            "@media(max-width: 640px)": {
              borderTopLeftRadius: "24px",
              borderBottomLeftRadius: "24px",
              padding: "16px",
            },
          }}
        >
          <Flex vertical gap="16px 0" align="flex-start">
            <Typography fontSize="16px">{t("common.market.cap")}</Typography>
            <Typography fontSize="28px" fontWeight={500} color="text.primary">
              {marketCap ? formatDollarAmount(marketCap) : "--"}
            </Typography>
          </Flex>

          <Flex vertical gap="16px 0" align="flex-start">
            <Typography fontSize="16px">{t("common.fully.diluted.cap")}</Typography>
            <Typography fontSize="28px" fontWeight={500} color="text.primary">
              {fdv ? formatDollarAmount(fdv) : "--"}
            </Typography>
          </Flex>

          <Flex vertical gap="16px 0" align="flex-start">
            <Typography fontSize="16px">{t("common.amount.burned")}</Typography>
            <Flex vertical gap="8px" align="flex-start">
              <Flex gap="4px">
                <Typography fontSize="28px" fontWeight={500} color="text.primary">
                  {tokenBurned ? new BigNumber(tokenBurned).toFormat(2) : "--"}
                </Typography>
                <TokenImage logo={ICS.logo} tokenId={ICS.address} size="20px" />
              </Flex>
              <Typography fontSize="16px">
                ~
                {tokenBurned && infoToken
                  ? formatDollarAmount(new BigNumber(tokenBurned).multipliedBy(infoToken.price).toString())
                  : "--"}
              </Typography>
            </Flex>
          </Flex>

          <Flex vertical gap="16px 0" align="flex-start">
            <Typography fontSize="16px">Holders</Typography>
            <Typography fontSize="28px" fontWeight={500} color="text.primary">
              {tokenAnalysis ? formatAmount(tokenAnalysis.holders) : "--"}
            </Typography>
          </Flex>
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      className="ics-token-overview"
      sx={{
        width: "100%",
        minWidth: 0,
        border: "1px solid var(--color-base-300)",
        borderRadius: "8px",
        overflow: "hidden",
        background: "var(--color-base-100)",
      }}
    >
      <Flex
        justify="space-between"
        fullWidth
        sx={{
          padding: "32px",
          gap: "24px",
          borderBottom: "1px solid var(--color-base-300)",
          "@media(max-width: 640px)": { padding: "24px 20px", flexDirection: "column", alignItems: "flex-start" },
        }}
      >
        <Flex gap="0 16px">
          <TokenImage size="44px" logo={ICS.logo} tokenId={ICS.address} />
          <Box>
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 700,
                fontSize: "32px",
                letterSpacing: "-0.055em",
                lineHeight: 1,
              }}
            >
              ICS
            </Typography>
            <Typography sx={{ fontSize: "12px", marginTop: "9px", letterSpacing: "0.03em" }}>ICPSwap Token</Typography>
          </Box>
        </Flex>
        <Flex vertical align="flex-end" gap="12px" sx={{ "@media(max-width: 640px)": { alignItems: "flex-start" } }}>
          <Flex gap="0 12px" align="center">
            <Typography
              sx={{
                color: "var(--color-primary)",
                fontWeight: 500,
                fontSize: "36px",
                letterSpacing: "-0.06em",
                fontFamily: "var(--font-mono, monospace)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {infoToken ? formatDollarTokenPrice(infoToken.price) : "--"}
            </Typography>
            <Proportion value={infoToken?.priceChange24H} />
          </Flex>
          {infoToken && icpInfoToken ? (
            <Typography
              sx={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", fontVariantNumeric: "tabular-nums" }}
            >
              1 ICS = {new BigNumber(infoToken.price).dividedBy(icpInfoToken.price).toFormat(5)} ICP
            </Typography>
          ) : null}
        </Flex>
      </Flex>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          borderBottom: "1px solid var(--color-base-300)",
          background: "var(--color-base-200)",
          "& > .MuiBox-root": { padding: "24px", borderRight: "1px solid var(--color-base-300)", minWidth: 0 },
          "& > .MuiBox-root:last-child": { borderRight: 0 },
          "@media(max-width: 960px)": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            "& > .MuiBox-root": { padding: "22px", borderBottom: "1px solid var(--color-base-300)" },
            "& > .MuiBox-root:nth-of-type(2n)": { borderRight: 0 },
            "& > .MuiBox-root:nth-of-type(n+3)": { borderBottom: 0 },
          },
          "@media(max-width: 420px)": {
            gridTemplateColumns: "1fr",
            "& > .MuiBox-root": { borderRight: 0, padding: "20px", borderBottom: "1px solid var(--color-base-300)" },
            "& > .MuiBox-root:nth-of-type(n+3)": { borderBottom: "1px solid var(--color-base-300)" },
            "& > .MuiBox-root:last-child": { borderBottom: 0 },
          },
        }}
      >
        <Flex vertical gap="14px" align="flex-start">
          <Typography fontSize="11px" sx={{ letterSpacing: "0.055em" }}>
            {t("common.market.cap")}
          </Typography>
          <Typography
            fontSize="24px"
            fontWeight={500}
            color="text.primary"
            sx={{
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-mono, monospace)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {marketCap ? formatDollarAmount(marketCap) : "--"}
          </Typography>
        </Flex>
        <Flex vertical gap="14px" align="flex-start">
          <Typography fontSize="11px" sx={{ letterSpacing: "0.055em" }}>
            {t("common.fully.diluted.cap")}
          </Typography>
          <Typography
            fontSize="24px"
            fontWeight={500}
            color="text.primary"
            sx={{
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-mono, monospace)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fdv ? formatDollarAmount(fdv) : "--"}
          </Typography>
        </Flex>
        <Flex
          vertical
          gap="14px"
          align="flex-start"
          sx={{ background: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
        >
          <Typography fontSize="11px" sx={{ color: "var(--color-primary)", letterSpacing: "0.055em" }}>
            {t("common.amount.burned")}
          </Typography>
          <Flex vertical gap="8px" align="flex-start">
            <Flex gap="6px">
              <Typography
                fontSize="24px"
                fontWeight={500}
                sx={{
                  color: "var(--color-primary)",
                  letterSpacing: "-0.04em",
                  fontFamily: "var(--font-mono, monospace)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {tokenBurned ? new BigNumber(tokenBurned).toFormat(2) : "--"}
              </Typography>
              <TokenImage logo={ICS.logo} tokenId={ICS.address} size="16px" />
            </Flex>
            <Typography fontSize="11px" sx={{ fontFamily: "var(--font-mono, monospace)" }}>
              ~
              {tokenBurned && infoToken
                ? formatDollarAmount(new BigNumber(tokenBurned).multipliedBy(infoToken.price).toString())
                : "--"}
            </Typography>
          </Flex>
        </Flex>
        <Flex vertical gap="14px" align="flex-start">
          <Typography fontSize="11px" sx={{ letterSpacing: "0.055em" }}>
            Holders
          </Typography>
          <Typography
            fontSize="24px"
            fontWeight={500}
            sx={{
              color: "var(--color-secondary)",
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-mono, monospace)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {tokenAnalysis ? formatAmount(tokenAnalysis.holders) : "--"}
          </Typography>
        </Flex>
      </Box>
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          padding: "28px 32px 20px",
          "@media(max-width: 640px)": { padding: "24px 16px 16px" },
        }}
      >
        <ICSPriceChart />
      </Box>
    </Box>
  );
}
