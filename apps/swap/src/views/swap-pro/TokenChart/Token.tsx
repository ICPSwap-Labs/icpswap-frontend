import { useContext, useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { TokenImage } from "components/index";
import { MediaLinkIcon, Proportion } from "@icpswap/ui";
import { formatDollarAmount } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import type { PublicTokenOverview, TokenListMetadata } from "@icpswap/types";
import type { TokenInfo } from "types/token";
import { Copy } from "components/Copy/icon";

import { SwapProContext } from "../context";

export interface TokenChartInfoProps {
  infoToken: PublicTokenOverview | undefined;
  tokenInfo: TokenInfo | undefined;
  tokenListInfo: TokenListMetadata | undefined;
}

export default function TokenChartInfo({ tokenInfo, infoToken, tokenListInfo }: TokenChartInfoProps) {
  const theme = useTheme() as Theme;
  const { tokenId } = useContext(SwapProContext);

  const mediaLinks = useMemo(() => {
    if (!tokenListInfo) return undefined;

    const links = [
      { k: "Dashboard", v: `https://dashboard.internetcomputer.org/canister/${tokenId}` },
      { k: "ICScan", v: `https://icscan.io/canister/${tokenId}` },
    ];

    return links.concat(
      (tokenListInfo.mediaLinks ?? []).map((mediaLink) => ({ k: mediaLink.mediaType, v: mediaLink.link })),
    );
  }, [tokenId, tokenListInfo]);

  return (
    <Box sx={{ padding: "16px 16px 0 16px" }}>
      <Box sx={{ display: "flex", gap: "0 47px" }}>
        <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
          <TokenImage size="24px" logo={tokenInfo?.logo} tokenId={tokenId} />
          <Typography color="text.primary" sx={{ fontSize: "18px", fontWeight: 600 }}>
            {tokenInfo ? tokenInfo.symbol : "--"}
          </Typography>
          <Typography color="text.theme_secondary">{tokenId}</Typography>
          <Copy content={tokenId} />
        </Box>

        {mediaLinks ? (
          <Box
            sx={{
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
                style={{ width: "20px", height: "20px" }}
              >
                <MediaLinkIcon k={e.k} size={20} />
              </a>
            ))}
          </Box>
        ) : null}
      </Box>

      <Box sx={{ margin: "10px 0 0 0", display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <Typography color="text.primary" sx={{ fontSize: "30px", fontWeight: 500 }}>
            {infoToken?.priceUSD ? formatDollarAmount(infoToken.priceUSD, 4) : "--"}
          </Typography>
          {infoToken ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              (<Proportion value={infoToken.priceUSDChange} />)
            </Box>
          ) : null}
        </Box>

        <a href={`https://info.icpswap.com/token/details/${tokenId}`} target="_blank" rel="noreferrer">
          <Box
            sx={{
              width: "121px",
              height: "36px",
              borderRadius: "8px",
              background: "#515A81",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography align="center" color="text.primary">
              <Trans>Token Details</Trans>
            </Typography>
          </Box>
        </a>
      </Box>
    </Box>
  );
}
