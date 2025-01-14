import { Typography } from "@mui/material";
import { Flex, TokenImage } from "components/index";
import { useTheme } from "components/Mui";
import { ICP, ICS, ckBTC, ckETH, ckUSDC, ckUSDT, BOB } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { useCallback } from "react";

const BASE_TOKENS = [ICP, ICS, ckUSDC, ckBTC, ckETH, ckUSDT, BOB];

export interface BaseTokenProps {
  token: Token;
  onTokenClick: (token: Token) => void;
}

export function BaseToken({ token, onTokenClick }: BaseTokenProps) {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (token) {
      onTokenClick(token);
    }
  }, [onTokenClick, token]);

  return (
    <Flex
      sx={{
        padding: "6px 12px 6px 6px",
        border: "1px solid #29314F",
        borderRadius: "50px",
        cursor: "pointer",
        "&:hover": {
          background: theme.palette.background.level3,
        },
      }}
      gap="0 8px"
      onClick={handleClick}
    >
      <TokenImage logo={token.logo} size="24px" />
      <Typography
        sx={{
          color: "text.primary",
          fontWeight: 500,
          fontSize: "16px",
          "@media(max-width: 640px)": {
            fontSize: "14px",
          },
        }}
      >
        {token.symbol}
      </Typography>
    </Flex>
  );
}

export interface BaseTokensProps {
  onTokenClick: (token: Token) => void;
}

export function BaseTokens({ onTokenClick }: BaseTokensProps) {
  return (
    <Flex
      sx={{
        margin: "16px 0 0 0",
        padding: "0 24px",
        "@media(max-width: 640px)": {
          justifyContent: "flex-start",
          padding: "0 16px",
        },
      }}
      gap="12px"
      wrap="wrap"
    >
      {BASE_TOKENS.map((base_token) => (
        <BaseToken key={base_token.address} token={base_token} onTokenClick={onTokenClick} />
      ))}
    </Flex>
  );
}
