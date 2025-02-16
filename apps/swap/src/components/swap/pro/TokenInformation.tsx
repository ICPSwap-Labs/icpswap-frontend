import React, { ReactNode, useMemo, useState } from "react";
import { Box, BoxProps, Typography, useTheme } from "components/Mui";
import { BigNumber, formatDollarAmount, formatAmount, parseTokenAmount, nonNullArgs } from "@icpswap/utils";
import { Flex, Tooltip } from "@icpswap/ui";
import { useTokenSupply, useTokenAnalysis, useTokenListTokenInfo, useInfoToken } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { ChevronDown, ArrowUpRight } from "react-feather";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

import { PoolAndTokenBaseInfo } from "./PoolAndTokenBaseInfo";

interface CardProps {
  padding?: "12px" | "8px";
  title?: ReactNode;
  titleArrow?: boolean;
  children: React.ReactNode;
  fontSize?: "14px" | "12px";
  tips?: ReactNode;
  wrapperSx?: BoxProps["sx"];
}

function Card({ title, titleArrow, padding = "8px", fontSize = "14px", tips, children, wrapperSx }: CardProps) {
  const theme = useTheme();

  return (
    <Box sx={{ background: theme.palette.background.level1, borderRadius: "8px", padding, ...wrapperSx }}>
      {title ? (
        <Flex fullWidth justify="center" gap="0 4px" sx={{ margin: "0 0 8px 0" }}>
          <Typography sx={{ fontSize }}>{title}</Typography>
          {titleArrow ? <ArrowUpRight size={14} color={theme.colors.secondaryMain} /> : null}
          {tips ? <Tooltip iconSize="12px" tips={tips} /> : null}
        </Flex>
      ) : null}
      {children}
    </Box>
  );
}

interface TokenInformationProps {
  token: Token;
  poolId: string | Null;
}

export function TokenInformation({ token, poolId }: TokenInformationProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [moreInformation, setMoreInformation] = useState(false);

  const { result: tokenListInfo } = useTokenListTokenInfo(token.address);
  const infoToken = useInfoToken(token.address);

  const tokenId = useMemo(() => token?.address, [token]);

  const tokenPrice = useMemo(() => {
    return infoToken?.priceUSD;
  }, [infoToken]);

  const { result: tokenSupply } = useTokenSupply(tokenId);
  const { result: tokenAnalysis } = useTokenAnalysis(tokenId);

  const marketCap = useMemo(() => {
    if (nonNullArgs(tokenAnalysis) && nonNullArgs(tokenPrice)) {
      return new BigNumber(tokenAnalysis.marketAmount).multipliedBy(tokenPrice).toString();
    }
  }, [tokenAnalysis, tokenPrice]);

  const circulating = useMemo(() => {
    if (nonNullArgs(tokenAnalysis) && nonNullArgs(tokenSupply) && nonNullArgs(token)) {
      return `${new BigNumber(
        new BigNumber(tokenAnalysis.marketAmount).dividedBy(parseTokenAmount(tokenSupply, token.decimals)).toFixed(4),
      ).multipliedBy(100)}%`;
    }
  }, [tokenAnalysis, tokenSupply, token]);

  return (
    <>
      <Box
        sx={{
          margin: "18px 0 0 0",
          padding: tokenListInfo && token && tokenListInfo.introduction ? "0 16px" : "0 16px 16px 16px",
        }}
      >
        <PoolAndTokenBaseInfo token={token} poolId={poolId} />

        <Box sx={{ margin: "20px 0 0 0", display: "flex", flexDirection: "column", gap: "8px 0" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <Card title={t("common.total.supply")} fontSize="12px">
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {tokenSupply && token
                  ? formatAmount(parseTokenAmount(tokenSupply.toString(), token.decimals).toNumber())
                  : "--"}
              </Typography>
            </Card>
            <Card
              title={t("common.fdv.usd")}
              fontSize="12px"
              tips={
                <Flex vertical gap="8px 0" align="flex-start">
                  <Typography color="text.tooltip" fontSize={theme.palette.textSize.tooltip} lineHeight="18px">
                    {t("common.fdv.tips")}
                  </Typography>
                  <Typography color="text.tooltip" fontSize={theme.palette.textSize.tooltip} lineHeight="18px">
                    {t("common.fdv.formula")}
                  </Typography>
                </Flex>
              }
            >
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {tokenSupply && token && tokenPrice
                  ? formatDollarAmount(
                      parseTokenAmount(tokenSupply.toString(), token.decimals).multipliedBy(tokenPrice).toString(),
                    )
                  : "--"}
              </Typography>
            </Card>
            <Card title={t("common.circulating.supply")} fontSize="12px" tips={t("swap.pro.circulation.tips")}>
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {nonNullArgs(tokenAnalysis) ? formatAmount(tokenAnalysis.marketAmount) : "--"}
              </Typography>
            </Card>
            <Card
              title={t("common.market.cap")}
              fontSize="12px"
              tips={
                <Flex vertical gap="8px 0" align="flex-start">
                  <Typography color="text.tooltip" fontSize={theme.palette.textSize.tooltip} lineHeight="18px">
                    {t("common.market.cap.tips")}
                  </Typography>
                  <Typography color="text.tooltip" fontSize={theme.palette.textSize.tooltip} lineHeight="18px">
                    {t("common.market.cap.formula")}
                  </Typography>
                </Flex>
              }
            >
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {nonNullArgs(marketCap) ? formatDollarAmount(marketCap) : "--"}
              </Typography>
            </Card>
            <Card
              title={t`Circulating %`}
              fontSize="12px"
              tips={
                <Flex vertical gap="8px 0" align="flex-start">
                  <Typography color="text.tooltip" fontSize={theme.palette.textSize.tooltip} lineHeight="18px">
                    {t("common.circulating.tips")}
                  </Typography>
                  <Typography color="text.tooltip" fontSize={theme.palette.textSize.tooltip} lineHeight="18px">
                    {t("common.circulating.formula")}
                  </Typography>
                </Flex>
              }
            >
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {nonNullArgs(circulating) ? circulating : "--"}
              </Typography>
            </Card>
            <Card title={t`Holders`} fontSize="12px">
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {tokenAnalysis ? formatAmount(tokenAnalysis.holders.toString()) : "--"}
              </Typography>
            </Card>
            <Card title={t("common.volume24h")} fontSize="12px">
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {infoToken ? formatDollarAmount(infoToken.volumeUSD) : "--"}
              </Typography>
            </Card>
            {/* <Card title={t("common.volume7d")} fontSize="12px">
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {infoToken ? formatDollarAmount(infoToken.volumeUSD7d) : "--"}
              </Typography>
            </Card> */}
            <Card title={t`Decimals`} fontSize="12px">
              <Typography color="text.primary" sx={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
                {token ? token.decimals : "--"}
              </Typography>
            </Card>
            <Card title={t("common.transfer.fee")} fontSize="12px">
              <Typography
                color="text.primary"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
                component="div"
              >
                {token ? parseTokenAmount(token.transFee.toString(), token.decimals).toFormat() : "--"}
                <Typography
                  color="text.primary"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    maxWidth: "86px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  (
                  {tokenSupply && token && tokenPrice
                    ? formatDollarAmount(
                        parseTokenAmount(token.transFee.toString(), token.decimals).multipliedBy(tokenPrice).toString(),
                      )
                    : "--"}
                  )
                </Typography>
              </Typography>
            </Card>
          </Box>
        </Box>

        {tokenListInfo && token && tokenListInfo.introduction ? (
          <Box sx={{ margin: "20px 0 0 0" }}>
            <Typography sx={{ fontWeight: 600 }} color="text.primary">
              {t("common.introduction")}
            </Typography>

            <Typography
              sx={{
                margin: "8px 0 0 0",
                fontSize: "12px",
                display: "-webkit-box",
                WebkitLineClamp: moreInformation ? "none" : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "16px",
              }}
            >
              <Typography component="span" sx={{ margin: "0 5px 0 0", color: "text.theme-secondary", fontWeight: 600 }}>
                {token?.symbol}
              </Typography>
              {tokenListInfo.introduction}
            </Typography>
          </Box>
        ) : null}
      </Box>

      {tokenListInfo && token && tokenListInfo.introduction ? (
        <Box
          sx={{
            margin: "12px 0 0 0",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.palette.background.level4,
            cursor: "pointer",
          }}
          onClick={() => setMoreInformation(!moreInformation)}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: 500, margin: "0 3px 0 0" }}>
            {moreInformation ? t("common.less.information") : t("common.more.information")}
          </Typography>
          <ChevronDown style={{ transform: moreInformation ? "rotate(180deg)" : "rotate(0deg)" }} size="16px" />
        </Box>
      ) : null}
    </>
  );
}
