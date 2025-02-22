import { useContext, useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery, Button } from "components/Mui";
import { TokenImage, Link } from "components/index";
import { MediaLinkIcon, Proportion } from "@icpswap/ui";
import { formatDollarTokenPrice } from "@icpswap/utils";
import type { PublicTokenOverview, TokenListMetadata } from "@icpswap/types";
import { Copy } from "components/Copy/icon";
import { TokenListIdentifying } from "components/TokenListIdentifying";
import { ICP } from "@icpswap/tokens";
import { SwapProContext } from "components/swap/pro";
import { useTranslation } from "react-i18next";

import { TokenChartsViewSelector } from "./TokenChartsViewSelector";

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
  infoToken: PublicTokenOverview | undefined;
  tokenListInfo: TokenListMetadata | undefined;
}

export default function TokenChartInfo({ infoToken, tokenListInfo }: TokenChartInfoProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { token } = useContext(SwapProContext);

  const tokenId = useMemo(() => {
    return token?.address;
  }, [token]);

  const mediaLinks = useMemo(() => {
    if (!tokenListInfo) return undefined;

    const links = [
      { k: "Dashboard", v: `https://dashboard.internetcomputer.org/canister/${tokenId}` },
      tokenId ? { k: "DexScreener", v: `https://dexscreener.com/icp/${tokenId}` } : undefined,
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
            <Typography color="text.theme-secondary">{tokenId}</Typography>
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
            {infoToken ? formatDollarTokenPrice(infoToken.priceUSD) : "--"}
          </Typography>
          {infoToken ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              (<Proportion value={infoToken.priceUSDChange} />)
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
          {!matchDownSM ? <TokenChartsViewSelector /> : null}

          <Link to={`/liquidity/add/${ICP.address}/${tokenId}?path=${window.btoa("/swap/pro")}`}>
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
