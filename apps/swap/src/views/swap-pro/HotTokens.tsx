import { Box, Typography, useTheme, keyframes } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { Trans } from "@lingui/macro";
import { ReactComponent as HotIcon } from "assets/icons/swap-pro/hot.svg";
import { useAllTokenIds } from "store/token/cache/hooks";
import { useTokensInfo, TokenInfoState } from "hooks/token/useTokenInfo";
import { useMemo } from "react";
import { TokenInfo } from "types/token";
import { TokenImage } from "components/index";

const animationKeyframes = keyframes`
  0% {
    transform: translate(0);
  }
  100% {
    transform: translate(calc(-100% - 6rem));
  }
`;

interface TokenItemProps {
  tokenInfo: TokenInfo;
}

function TokenItem({ tokenInfo }: TokenItemProps) {
  return (
    <Box sx={{ display: "flex", gap: "0 4px", cursor: "pointer", alignItems: "center" }}>
      <Typography color="text.primary">#</Typography>
      <TokenImage logo={tokenInfo.logo} tokenId={tokenInfo.canisterId} size="16px" />
      <Typography color="text.primary" sx={{ width: "fit-content", textWrap: "nowrap", userSelect: "none" }}>
        {tokenInfo.name}
      </Typography>
    </Box>
  );
}

interface TokensWrapperProps {
  tokensInfo: TokenInfo[];
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
        animation: `${animationKeyframes} 60s linear infinite`,
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
        {(tokensInfo.filter((e) => !!e) as TokenInfo[]).map((tokenInfo) => (
          <TokenItem key={tokenInfo.canisterId} tokenInfo={tokenInfo} />
        ))}
      </Box>
    </Box>
  );
}

export default function HotTokens() {
  const theme = useTheme() as Theme;

  const allTokenIds = useAllTokenIds();
  const allTokensInfo = useTokensInfo(allTokenIds);

  const validTokensInfo = useMemo(() => {
    return allTokensInfo
      .filter((e) => e[0] === TokenInfoState.EXISTS)
      .map((e) => e[1])
      .slice(0, 50)
      .filter((e) => !!e) as TokenInfo[];
  }, [allTokensInfo]);

  return (
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
          <HotIcon />
          <Typography>
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
            <TokensWrapper tokensInfo={validTokensInfo} />

            <TokensWrapper tokensInfo={validTokensInfo} />

            <TokensWrapper tokensInfo={validTokensInfo} />
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
  );
}
