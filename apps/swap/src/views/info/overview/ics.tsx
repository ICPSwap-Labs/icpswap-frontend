import { useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { ICP, ICS } from "@icpswap/tokens";
import {
  parseTokenAmount,
  formatAmount,
  formatDollarAmount,
  BigNumber,
  nonUndefinedOrNull,
  formatDollarTokenPrice,
} from "@icpswap/utils";
import { useInfoToken, useTokenAnalysis, useTokenSupply, useTokenBurned } from "@icpswap/hooks";
import { Flex, Proportion } from "@icpswap/ui";
import { TokenImage } from "components/index";
import { useTranslation } from "react-i18next";

import { ICSPriceChart } from "./icsPriceChart";

export function Ics() {
  const { t } = useTranslation();
  const theme = useTheme();

  const infoToken = useInfoToken(ICS.address);
  const icpInfoToken = useInfoToken(ICP.address);
  const { result: tokenSupply } = useTokenSupply(ICS.address);
  const { result: tokenAnalysis } = useTokenAnalysis(ICS.address);
  const { result: tokenBurned } = useTokenBurned(ICS.address);

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
            {tokenAnalysis ? formatAmount(tokenAnalysis.holders.toString()) : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}
