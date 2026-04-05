import type { Token } from "@icpswap/swap-sdk";
import type { InfoTokenRealTimeDataResponse, Null, TokenListMetadata } from "@icpswap/types";
import { MediaLinkIcon, Proportion } from "@icpswap/ui";
import { formatDollarTokenPrice } from "@icpswap/utils";
import { Copy } from "components/Copy/icon";
import { Link, TokenImage } from "components/index";
import { Box, Button, Typography, useTheme } from "components/Mui";
import { PriceAlertsIcon } from "components/PriceAlerts";
import { useSwapProStore } from "components/swap/pro";
import { TokenChartsViewSelector } from "components/swap/pro/TokenChart/TokenChartsViewSelector";
import { TokenListIdentifying } from "components/TokenListIdentifying";
import { useMediaQuerySM } from "hooks/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface MediasProps {
  mediaLinks: undefined | { k: string; v: string }[];
}

function Medias({ mediaLinks }: MediasProps) {
  const theme = useTheme();

  return mediaLinks ? (
    <Box
      sx={{
        width: "fit-content",
        borderRadius: "60px",
        border: `1px solid ${theme.colors.border0}`,
        display: "flex",
        alignItems: "center",
        height: "30px",
        padding: "0 24px",
        gap: "0 10px",
      }}
    >
      {mediaLinks.map((e) => (
        <a
          key={e.k}
          href={e.v}
          target="_blank"
          rel="noreferrer"
          aria-label={e.k}
          style={{ width: "20px", height: "20px", textDecoration: "none" }}
        >
          <MediaLinkIcon k={e.k} size={20} />
        </a>
      ))}
    </Box>
  ) : null;
}

export interface TokenChartInfoProps {
  infoToken: InfoTokenRealTimeDataResponse | undefined;
  tokenListInfo: TokenListMetadata | undefined;
  inputToken: Token | Null;
  outputToken: Token | Null;
}

export function TokenChartInfo({ infoToken, tokenListInfo, inputToken, outputToken }: TokenChartInfoProps) {
  const { t } = useTranslation();
  const matchDownSM = useMediaQuerySM();
  const { token } = useSwapProStore();

  const tokenId = useMemo(() => {
    return token?.address;
  }, [token]);

  const mediaLinks = useMemo(() => {
    if (!tokenListInfo) return undefined;

    const links = [
      { k: "Dashboard", v: `https://dashboard.internetcomputer.org/canister/${tokenId}` },
      { k: "Explorer", v: `https://www.icexplorer.io/token/details/${tokenId}` },
    ] as {
      k: string;
      v: string;
    }[];

    return links
      .concat((tokenListInfo.mediaLinks ?? []).map((mediaLink) => ({ k: mediaLink.mediaType, v: mediaLink.link })))
      .filter((e) => !!e);
  }, [tokenId, tokenListInfo]);

  return (
    <Box
      sx={{
        padding: "16px 16px 0 16px",
        "@media(max-width: 640px)": {
          padding: "0px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "0 47px",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "0 5px",
            alignItems: "center",
            "@media(max-width: 640px)": {
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px 0",
            },
          }}
        >
          <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
            <TokenImage size="24px" logo={token?.logo} tokenId={tokenId} />
            <Typography color="text.primary" sx={{ fontSize: "18px", fontWeight: 600 }}>
              {token ? token.symbol : "--"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
            <Link to={`/info-swap/token/details/${tokenId}`}>
              <Typography color="text.theme-secondary">{tokenId}</Typography>
            </Link>
            <Copy content={tokenId} />
          </Box>
        </Box>

        {!matchDownSM ? (
          <Box sx={{ display: "flex", gap: "0 10px" }}>
            <Medias mediaLinks={mediaLinks} />
            <TokenListIdentifying tokenId={tokenId} />
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          margin: "20px 0 0 0",
          display: "flex",
          justifyContent: "space-between",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "8px 0",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <Typography color="text.primary" sx={{ fontSize: "30px", fontWeight: 500 }}>
            {infoToken ? formatDollarTokenPrice(infoToken.price) : "--"}
          </Typography>
          {infoToken ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              (<Proportion value={infoToken.priceChange24H} />)
            </Box>
          ) : null}
        </Box>

        {matchDownSM ? (
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Medias mediaLinks={mediaLinks} />
            <TokenListIdentifying tokenId={tokenId} />
          </Box>
        ) : null}

        <Box sx={{ display: "flex", gap: "0 10px" }}>
          <PriceAlertsIcon tokenId={tokenId} />

          {!matchDownSM ? <TokenChartsViewSelector /> : null}

          <Link link={`/liquidity/add/${inputToken?.address}/${outputToken?.address}`}>
            <Button className="secondary" variant="contained">
              {t("swap.add.liquidity")}
            </Button>
          </Link>

          <a
            href={`/info-tokens/details/${tokenId}`}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button className="secondary" variant="contained">
              {t("common.token.details")}
            </Button>
          </a>
        </Box>
      </Box>
    </Box>
  );
}
