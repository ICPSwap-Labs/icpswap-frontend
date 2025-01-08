import { useMemo } from "react";
import { Box, Typography, useTheme, keyframes } from "components/Mui";
import { Trans } from "@lingui/macro";
import HotIcon from "assets/icons/swap-pro/hot.svg";
import { useToken } from "hooks/index";
import type { PublicTokenOverview } from "@icpswap/types";
import { TokenImage } from "components/index";
import { useHistory } from "react-router-dom";
import { ICP, ICS } from "@icpswap/tokens";
import { useInfoAllTokens } from "@icpswap/hooks";
import { Proportion } from "@icpswap/ui";

const animationKeyframes = keyframes`
  0% {
    transform: translate(0);
  }
  100% {
    transform: translate(calc(-100% - 6rem));
  }
`;

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 1.5L3.05275 2.15134C3.12914 3.09464 3.85625 3.85527 4.79515 3.97408L5 4L4.79515 4.02592C3.85625 4.14473 3.12914 4.90536 3.05275 5.84866L3 6.5L2.94725 5.84866C2.87086 4.90536 2.14375 4.14473 1.20485 4.02592L1 4L1.20485 3.97408C2.14375 3.85527 2.87086 3.09464 2.94725 2.15134L3 1.5Z"
        fill="#FFD24C"
      />
      <path
        d="M4 9.5L4.1183 10.9608C4.15649 11.4324 4.52005 11.8127 4.9895 11.8721L6 12L4.9895 12.1279C4.52005 12.1873 4.15649 12.5676 4.1183 13.0392L4 14.5L3.8817 13.0392C3.84351 12.5676 3.47995 12.1873 3.0105 12.1279L2 12L3.0105 11.8721C3.47995 11.8127 3.84351 11.4324 3.8817 10.9608L4 9.5Z"
        fill="#FFD24C"
      />
      <path
        d="M9 2L9.68077 4.50717C10.0527 5.87709 11.1229 6.94725 12.4928 7.31923L15 8L12.4928 8.68077C11.1229 9.05275 10.0527 10.1229 9.68077 11.4928L9 14L8.31923 11.4928C7.94725 10.1229 6.87709 9.05275 5.50717 8.68077L3 8L5.50717 7.31923C6.87709 6.94725 7.94725 5.87709 8.31923 4.50717L9 2Z"
        fill="#FFD24C"
      />
    </svg>
  );
}

interface TokenItemProps {
  tokenInfo: PublicTokenOverview;
  index: number;
}

function TokenItem({ tokenInfo, index }: TokenItemProps) {
  const history = useHistory();

  const handleTokenClick = () => {
    history.push(`/swap/pro?input=${ICP.address}&output=${tokenInfo.address}`);
  };

  const [, token] = useToken(tokenInfo.address);

  return (
    <Box sx={{ display: "flex", gap: "0 4px", cursor: "pointer", alignItems: "center" }} onClick={handleTokenClick}>
      <Typography sx={{ color: index === 0 ? "#FFD24C" : "text.primary", whiteSpace: "nowrap" }}>
        #{index + 1}
      </Typography>
      <TokenImage logo={token?.logo} tokenId={tokenInfo.address} size="16px" />
      <Typography
        sx={{
          width: "fit-content",
          textWrap: "nowrap",
          userSelect: "none",
          color: index === 0 ? "#FFD24C" : "text.primary",
        }}
      >
        {tokenInfo.name}
      </Typography>
      {index === 0 ? <StarIcon /> : null}
      <Proportion value={tokenInfo.priceUSDChange} fontSize="12px" />
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
        {tokensInfo.map((tokenInfo, index) => (
          <TokenItem key={tokenInfo.address} tokenInfo={tokenInfo} index={index} />
        ))}
      </Box>
    </Box>
  );
}

export default function HotTokens() {
  const theme = useTheme();
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
        // padding: "0 15px 0 0",
        // background: theme.colors.darkPrimaryDark,
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

      {/* <Box
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
      </Box> */}
    </Box>
  ) : null;
}
