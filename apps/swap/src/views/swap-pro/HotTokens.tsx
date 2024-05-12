import { useMemo } from "react";
import { Box, Typography, useTheme, keyframes } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { Trans } from "@lingui/macro";
import HotIcon from "assets/icons/swap-pro/hot.svg";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import type { PublicTokenOverview } from "@icpswap/types";
import { TokenImage } from "components/index";
import { useHistory } from "react-router-dom";
import { ICP, ICS } from "@icpswap/tokens";
import { useInfoAllTokens } from "hooks/info/useInfoTokens";

const animationKeyframes = keyframes`
  0% {
    transform: translate(0);
  }
  100% {
    transform: translate(calc(-100% - 6rem));
  }
`;

interface TokenItemProps {
  tokenInfo: PublicTokenOverview;
}

function TokenItem({ tokenInfo }: TokenItemProps) {
  const history = useHistory();

  const handleTokenClick = () => {
    history.push(`/swap/pro?input=${ICP.address}&output=${tokenInfo.address}`);
  };

  const { result: token } = useTokenInfo(tokenInfo.address);

  return (
    <Box sx={{ display: "flex", gap: "0 4px", cursor: "pointer", alignItems: "center" }} onClick={handleTokenClick}>
      <Typography color="text.primary">#</Typography>
      <TokenImage logo={token?.logo} tokenId={tokenInfo.address} size="16px" />
      <Typography color="text.primary" sx={{ width: "fit-content", textWrap: "nowrap", userSelect: "none" }}>
        {tokenInfo.name}
      </Typography>
    </Box>
  );
}

interface TokensWrapperProps {
  tokensInfo: PublicTokenOverview[];
}

function TokensWrapper({ tokensInfo }: TokensWrapperProps) {
  return (
    <Box
      className="token-wrapper"
      sx={{
        height: "100%",
        alignItems: "center",
        display: "inline-block",
        animationFillMode: "forwards",
        backfaceVisibility: "hidden",
        perspective: "1000px",
        transform: "translateZ(0)",
        animation: `${animationKeyframes} 40s linear infinite`,
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0 16px",
        }}
      >
        {tokensInfo.map((tokenInfo) => (
          <TokenItem key={tokenInfo.address} tokenInfo={tokenInfo} />
        ))}
      </Box>
    </Box>
  );
}

export default function HotTokens() {
  const theme = useTheme() as Theme;
  const infoAllTokens = useInfoAllTokens();

  const tokenList = useMemo(() => {
    const icsInfo = infoAllTokens?.filter((e) => e.address === ICS.address)?.[0];

    const allTokens = infoAllTokens
      ?.filter((e) => e.symbol !== "ICP" && e.address !== ICS.address)
      ?.sort((a, b) => {
        if (a.volumeUSD > b.volumeUSD) return -1;
        if (a.volumeUSD < b.volumeUSD) return 1;
        return 0;
      })
      .slice(0, 20);

    if (icsInfo) {
      allTokens?.unshift(icsInfo);
    }

    return allTokens;
  }, [infoAllTokens]);

  return tokenList ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: "50px",
        height: "40px",
        padding: "0 15px 0 0",
        background: theme.colors.darkPrimaryDark,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          gap: "0 20px",
          padding: "0 15px 0 15px",
          borderRadius: "50px",
          height: "40px",
          background: theme.palette.background.level3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0 6px",
            overflow: "hidden",
          }}
        >
          <img width="20px" height="20px" src={HotIcon} alt="" />
          <Typography sx={{ "@media(max-width: 640px)": { display: "none" } }}>
            <Trans>Hot Tokens</Trans>
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
            flexWrap: "nowrap",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "6rem",
              height: "100%",
              overflow: "hidden",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              "&:hover": {
                "& .token-wrapper": {
                  animationPlayState: "paused",
                },
              },
            }}
          >
            <TokensWrapper tokensInfo={tokenList} />

            <TokensWrapper tokensInfo={tokenList} />

            <TokensWrapper tokensInfo={tokenList} />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "60px",
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Typography color="text.primary">
          <Trans>Tokens</Trans>
        </Typography>
      </Box>
    </Box>
  ) : null;
}
