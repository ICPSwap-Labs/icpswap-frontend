import { Typography, Box, Button } from "components/Mui";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useToken } from "hooks/index";
import { InfoWrapper, MainCard, TokenImage, Link, ImportToNns } from "components/index";
import Copy, { CopyRef } from "components/Copy";
import { LinkButtons } from "components/info/tokens";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { useICPPrice } from "store/global/hooks";
import {
  parseTokenAmount,
  BigNumber,
  formatDollarTokenPrice,
  formatAmount,
  nonNullArgs,
  formatDollarAmount,
  explorerLink,
  formatIcpAmount,
} from "@icpswap/utils";
import {
  useTokenListTokenInfo,
  useParsedQueryString,
  useInfoToken,
  useTokenAnalysis,
  useTokenSupply,
  useTokenLatestTVL,
} from "@icpswap/hooks";
import { useCanisterInfo } from "hooks/useInternetComputerCalls";
import { Flex, Proportion, TextButton, BreadcrumbsV1, dexScreenerUrl } from "@icpswap/ui";
import { useUpdateTokenStandard, useTokenStandardIsRegistered } from "store/token/cache/hooks";
import { useTokenDexScreener } from "hooks/info";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { useTranslation } from "react-i18next";
import { ICP } from "@icpswap/tokens";

export function TokenDetail() {
  const { t } = useTranslation();
  const copyRef = useRef<CopyRef>(null);
  const { id: canisterId } = useParams<{ id: string }>();

  const infoToken = useInfoToken(canisterId);

  const [, token] = useToken(canisterId);

  const icpPrice = useICPPrice();
  const { result: tokenSupply } = useTokenSupply(canisterId);
  const { result: tokenAnalysis } = useTokenAnalysis(canisterId);
  const { result: canisterInfo } = useCanisterInfo(canisterId);
  const { result: tokenListInfo } = useTokenListTokenInfo(canisterId);
  const { result: tokenTVL } = useTokenLatestTVL(canisterId);

  const marketCap = useMemo(() => {
    if (nonNullArgs(tokenAnalysis) && nonNullArgs(infoToken)) {
      return new BigNumber(tokenAnalysis.marketAmount).multipliedBy(infoToken.priceUSD).toString();
    }
  }, [tokenAnalysis, infoToken]);

  // const circulating = useMemo(() => {
  //   if (nonNullArgs(tokenAnalysis) && nonNullArgs(tokenSupply) && nonNullArgs(token)) {
  //     return `${new BigNumber(
  //       new BigNumber(tokenAnalysis.marketAmount).dividedBy(parseTokenAmount(tokenSupply, token.decimals)).toFixed(4),
  //     ).multipliedBy(100)}%`;
  //   }
  // }, [tokenAnalysis, tokenSupply, token]);

  const mediaLinks = useMemo(() => {
    if (!tokenListInfo) return [];
    return (
      tokenListInfo?.mediaLinks.map((mediaLink) => ({
        k: mediaLink.mediaType,
        v: mediaLink.link,
        i: `/images/info/tokens/medias/${mediaLink.mediaType}.svg`,
      })) ?? []
    );
  }, [tokenListInfo]);

  const dexScreenerId = useTokenDexScreener(canisterId);

  const explorers = useMemo(() => {
    return [
      {
        k: "ii",
        l: "ICP Dashboard",
        v: `https://dashboard.internetcomputer.org/canister/${canisterId}`,
        i: "/images/explorer/ii.svg",
      },
      {
        k: "ic-explorer",
        l: "IC Explorer",
        v: `https://www.icexplorer.io/token/details/${canisterId}`,
        i: "/images/explorer/ic-explorer.svg",
      },
      {
        k: "NFTGeek",
        v: `https://t5t44-naaaa-aaaah-qcutq-cai.raw.ic0.app/token/${canisterId}`,
        i: "/images/explorer/NFTGeek.svg",
      },
      {
        k: "ic-house",
        l: "IC.House",
        v: `https://637g5-siaaa-aaaaj-aasja-cai.raw.ic0.app/token/${canisterId}`,
        i: "/images/explorer/ic-house.svg",
      },
    ];
  }, [canisterId]);

  const charts = useMemo(() => {
    return dexScreenerId
      ? [
          {
            k: "dexscreen",
            l: "DEXScreener",
            v: dexScreenerUrl(dexScreenerId),
            i: "/images/info/chart-icon/dexscreen.svg",
          },
          {
            k: "icpswap",
            l: "ICPSwap Info",
            v: `/info-swap/token/details/${canisterId}`,
            i: "/images/info/chart-icon/icpswap.svg",
          },
        ]
      : [
          {
            k: "icpswap",
            l: "ICPSwap Info",
            v: `/info-swap/token/details/${canisterId}`,
            i: "/images/info/chart-icon/icpswap.svg",
          },
        ];
  }, [canisterId, dexScreenerId]);

  // const priceTrackers = useMemo(() => {
  //   return dexScreenerId
  //     ? [
  //         { k: "dexscreen", l: "DEXScreener", v: dexScreenerUrl(dexScreenerId), i: "" },
  //         { k: "icpswap", l: "ICPSwap Info", v: `/info-swap/token/details/${canisterId}`, i: "" },
  //       ]
  //     : [{ k: "icpswap", l: "ICPSwap Info", v: `/info-swap/token/details/${canisterId}`, i: "" }];
  // }, [canisterId, dexScreenerId]);

  const handleCopy = useCallback(() => {
    if (copyRef) copyRef.current?.copy();
  }, [copyRef]);

  return (
    <InfoWrapper>
      <BreadcrumbsV1
        links={[{ label: t("common.tokens"), link: "/info-tokens" }, { label: t("common.token.details") }]}
      />

      <Flex
        sx={{
          margin: "16px 0 0 0",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "10px",
            alignItems: "flex-start",
          },
        }}
        justify="space-between"
        align="flex-end"
      >
        <Box>
          <Flex gap="0 8px">
            <TokenImage logo={token?.logo} size="32px" />
            <Typography color="text.primary" fontWeight={500} fontSize="24px">
              {token?.symbol}
            </Typography>
            <Typography fontSize="20px">({token?.name})</Typography>
          </Flex>

          <Flex gap="0 8px" sx={{ margin: "24px 0 0 0" }} align="flex-end">
            <Typography color="text.primary" fontWeight={500} fontSize="36px">
              {infoToken ? formatDollarTokenPrice(infoToken.priceUSD) : "--"}
            </Typography>
            <Proportion value={infoToken?.priceUSDChange} fontSize="16px" />
          </Flex>

          <Flex gap="0 8px" sx={{ margin: "12px 0 0 0" }}>
            <Typography fontSize="18px">
              {infoToken && icpPrice
                ? `${formatIcpAmount(new BigNumber(infoToken.priceUSD).dividedBy(icpPrice).toString())} ICP`
                : "--"}
            </Typography>
          </Flex>
        </Box>

        <Flex gap="0 8px">
          <Link to={`/swap?input=${ICP.address}&output=${token?.address}`}>
            <Button variant="contained" className="secondary">
              {t("common.buy.token", { symbol: token?.symbol })}
            </Button>
          </Link>

          <ImportToNns tokenId={canisterId}>
            <Button variant="contained">{t("common.nns.token.add")}</Button>
          </ImportToNns>
        </Flex>
      </Flex>

      <Flex fullWidth vertical align="flex-start" gap="16px 0" sx={{ margin: "24px 0 0 0" }}>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            "@media(max-width: 640px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          <MainCard level={3}>
            <Typography fontSize="18px" color="text.primary">
              {t("common.overview")}
            </Typography>

            <Flex sx={{ margin: "24px 0 0 0" }} gap="24px 0" vertical align="flex-start">
              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.total.supply")}</Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  {tokenSupply && token ? parseTokenAmount(tokenSupply, token.decimals).toFormat() : "--"}
                </Typography>
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.circulating.supply")}</Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  {tokenAnalysis ? new BigNumber(tokenAnalysis.marketAmount).toFormat() : "--"}
                </Typography>
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.decimals")}</Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  {token ? token.decimals : "--"}
                </Typography>
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.transfer.fee")}</Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  {token ? parseTokenAmount(token.transFee, token.decimals).toFormat() : "--"}
                </Typography>
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.holders")}</Typography>
                <Flex gap="0 25px">
                  <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                    {tokenAnalysis ? formatAmount(tokenAnalysis.holders.toString()) : "--"}
                  </Typography>

                  <TextButton to={`/info-tokens/holders/${canisterId}`} sx={{ fontSize: "12px" }}>
                    {t("common.more.details")}
                  </TextButton>
                </Flex>
              </Flex>
            </Flex>
          </MainCard>

          <MainCard level={3}>
            <Typography fontSize="18px" color="text.primary">
              {t("common.market")}
            </Typography>

            <Flex sx={{ margin: "24px 0 0 0" }} gap="24px 0" vertical align="flex-start">
              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.fdv")}</Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  {tokenSupply && token && infoToken
                    ? formatDollarAmount(
                        parseTokenAmount(tokenSupply.toString(), token.decimals)
                          .multipliedBy(infoToken.priceUSD)
                          .toString(),
                      )
                    : "--"}
                </Typography>
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.market.cap")}</Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  {nonNullArgs(marketCap) ? formatDollarAmount(marketCap) : "--"}
                </Typography>
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("info.tokens.tvl")}</Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  {tokenTVL ? formatDollarAmount(tokenTVL.tvlUSD) : "--"}
                </Typography>
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.chart")}</Typography>

                <Flex gap="0 8px" wrap="wrap">
                  <LinkButtons linkButtons={charts} />
                </Flex>
              </Flex>
            </Flex>
          </MainCard>

          <MainCard level={3}>
            <Typography fontSize="18px" color="text.primary">
              {t("info.other.info")}
            </Typography>

            <Flex sx={{ margin: "24px 0 0 0" }} gap="24px 0" vertical align="flex-start">
              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.canister.id")}</Typography>

                <Flex gap="0 8px">
                  <Link link={explorerLink(canisterId)}>
                    <Typography sx={{ color: "text.theme-primary", fontSize: "16px" }}>{canisterId}</Typography>
                  </Link>
                  <CopyIcon color="#ffffff" onClick={handleCopy} style={{ cursor: "pointer" }} />
                </Flex>

                <Copy ref={copyRef} hide content={canisterId} />
              </Flex>

              <Flex vertical align="flex-start" gap="8px 0">
                <Typography>{t("common.controllers")}</Typography>
                <Flex vertical gap="8px 0" align="flex-start">
                  {canisterInfo && canisterInfo.controllers
                    ? canisterInfo.controllers.map((e) => {
                        return <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{e}</Typography>;
                      })
                    : "--"}
                </Flex>
              </Flex>

              {/* <Flex vertical align="flex-start" gap="8px 0">
                <Typography>
                  <Trans>Price Trackers</Trans>
                </Typography>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  <LinkButtons linkButtons={priceTrackers} />
                </Typography>
              </Flex> */}
            </Flex>
          </MainCard>
        </Box>

        <MainCard level={3}>
          <Typography sx={{ color: "text.primary", fontSize: "18px", fontWeight: 500 }}>
            {t("common.social.media")}
          </Typography>

          <Flex sx={{ margin: "24px 0 0 0" }} gap="8px" wrap="wrap">
            <LinkButtons linkButtons={mediaLinks} />
          </Flex>
        </MainCard>

        {!!tokenListInfo && tokenListInfo?.introduction ? (
          <MainCard level={3}>
            <Typography sx={{ color: "text.primary", fontSize: "18px", fontWeight: 500 }}>
              {t("common.introduction")}
            </Typography>

            <Flex sx={{ margin: "24px 0 0 0" }} gap="8px" wrap="wrap">
              <Typography sx={{ fontSize: "14px", lineHeight: "20px" }}>{tokenListInfo.introduction}</Typography>
            </Flex>
          </MainCard>
        ) : null}

        <MainCard level={3}>
          <Typography sx={{ color: "text.primary", fontSize: "18px", fontWeight: 500 }}>
            {t("info.tokens.explorers")}
          </Typography>

          <Flex sx={{ margin: "24px 0 0 0" }} gap="8px" wrap="wrap">
            <LinkButtons linkButtons={explorers} />
          </Flex>
        </MainCard>
      </Flex>
    </InfoWrapper>
  );
}

export default function Details() {
  const updateTokenStandard = useUpdateTokenStandard();
  const { id: canisterId } = useParams<{ id: string }>();

  const { standard } = useParsedQueryString() as { standard: TOKEN_STANDARD };

  useEffect(() => {
    if (standard) {
      updateTokenStandard([{ canisterId, standard }]);
    }
  }, [standard, canisterId]);

  const tokenStandardIsRegistered = useTokenStandardIsRegistered(canisterId);

  return tokenStandardIsRegistered ? <TokenDetail /> : null;
}
