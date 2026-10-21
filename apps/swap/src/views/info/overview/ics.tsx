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
import { Box, Typography } from "components/Mui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ICSPriceChart } from "./icsPriceChart";

export function Ics() {
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

  return (
    <Box
      className="ics-token-overview tabular-nums"
      sx={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "minmax(0, 1fr) 300px",
        gap: "16px",
        "@media(max-width: 960px)": {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      <Flex
        sx={{
          background:
            "radial-gradient(ellipse at 10% 0%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 55%), var(--color-base-100)",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid color-mix(in srgb, var(--color-base-content) 8%, transparent)",
          minWidth: 0,
          boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-base-content) 3%, transparent)",
          "@media(max-width: 640px)": {
            padding: "20px 16px",
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
              <Typography sx={{ color: "text.primary", fontWeight: 600, fontSize: "22px", letterSpacing: "-0.035em" }}>
                ICS
              </Typography>
              <Typography sx={{ fontSize: "12px", paddingBottom: "2px" }}>ICPSwap Token</Typography>
            </Flex>
          </Flex>

          {infoToken && icpInfoToken ? (
            <Typography
              sx={{
                fontSize: "12px",
                fontVariantNumeric: "tabular-nums",
                background: "var(--color-base-200)",
                borderRadius: "8px",
                padding: "8px 10px",
              }}
            >
              1 ICS = {new BigNumber(infoToken.price).dividedBy(icpInfoToken.price).toFormat(5)} ICP
            </Typography>
          ) : null}
        </Flex>

        <Flex justify="space-between" fullWidth sx={{ margin: "24px 0 0 0" }}>
          <Flex gap="0 8px" align="flex-end">
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 600,
                fontSize: "36px",
                letterSpacing: "-0.05em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {infoToken ? formatDollarTokenPrice(infoToken.price) : "--"}
            </Typography>

            <Proportion value={infoToken?.priceChange24H} />
          </Flex>
        </Flex>

        <Box sx={{ margin: "24px 0 0 0", width: "100%", minWidth: 0 }}>
          <ICSPriceChart />
        </Box>
      </Flex>

      <Flex
        vertical
        align="stretch"
        sx={{
          height: "100%",
          background: "var(--color-base-100)",
          borderRadius: "20px",
          border: "1px solid color-mix(in srgb, var(--color-base-content) 8%, transparent)",
          gap: "0",
          overflow: "hidden",
          padding: "8px",
          justifyContent: "space-between",
          "& > .MuiBox-root": {
            padding: "22px",
            borderBottom: "1px solid color-mix(in srgb, var(--color-base-content) 6%, transparent)",
          },
          "& > .MuiBox-root:last-child": {
            borderBottom: 0,
          },
          "@media(max-width: 960px)": {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            "& > .MuiBox-root": { padding: "20px", border: 0 },
          },
          "@media(max-width: 420px)": {
            gridTemplateColumns: "1fr",
            "& > .MuiBox-root": { padding: "18px" },
          },
        }}
      >
        <Flex vertical gap="10px 0" align="flex-start">
          <Typography fontSize="12px">{t("common.market.cap")}</Typography>
          <Typography
            fontSize="24px"
            fontWeight={600}
            color="text.primary"
            sx={{ letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}
          >
            {marketCap ? formatDollarAmount(marketCap) : "--"}
          </Typography>
        </Flex>

        <Flex vertical gap="10px 0" align="flex-start">
          <Typography fontSize="12px">{t("common.fully.diluted.cap")}</Typography>
          <Typography
            fontSize="24px"
            fontWeight={600}
            color="text.primary"
            sx={{ letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}
          >
            {fdv ? formatDollarAmount(fdv) : "--"}
          </Typography>
        </Flex>

        <Flex
          vertical
          gap="10px 0"
          align="flex-start"
          sx={{
            background: "linear-gradient(100deg, color-mix(in srgb, var(--color-error) 6%, transparent), transparent)",
            borderRadius: "12px",
          }}
        >
          <Typography fontSize="12px" sx={{ color: "var(--color-error)" }}>
            {t("common.amount.burned")}
          </Typography>
          <Flex vertical gap="8px" align="flex-start">
            <Flex gap="4px">
              <Typography
                fontSize="24px"
                fontWeight={600}
                color="text.primary"
                sx={{ letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}
              >
                {tokenBurned ? new BigNumber(tokenBurned).toFormat(2) : "--"}
              </Typography>
              <TokenImage logo={ICS.logo} tokenId={ICS.address} size="20px" />
            </Flex>
            <Typography fontSize="12px">
              ~
              {tokenBurned && infoToken
                ? formatDollarAmount(new BigNumber(tokenBurned).multipliedBy(infoToken.price).toString())
                : "--"}
            </Typography>
          </Flex>
        </Flex>

        <Flex vertical gap="10px 0" align="flex-start">
          <Typography fontSize="12px">Holders</Typography>
          <Typography
            fontSize="24px"
            fontWeight={600}
            sx={{ color: "var(--color-primary)", letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}
          >
            {tokenAnalysis ? formatAmount(tokenAnalysis.holders) : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}
