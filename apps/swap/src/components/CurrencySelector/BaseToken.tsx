import { Flex, TokenImage } from "components/index";
import { useTheme, Typography } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { useCallback } from "react";
import { useToken } from "hooks";

const BASE_TOKEN_IDS = [
  "ryjl3-tyaaa-aaaaa-aaaba-cai", // ICP
  "ca6gz-lqaaa-aaaaq-aacwa-cai", // ICS
  "xevnm-gaaaa-aaaar-qafnq-cai", // ckUSDC,
  "mxzaz-hqaaa-aaaar-qaada-cai", // ckBTC,
  "ss2fx-dyaaa-aaaar-qacoq-cai", // ckETH,
  "cngnf-vqaaa-aaaar-qag4q-cai", // ckUSDT,
  "7pail-xaaaa-aaaas-aabmq-cai", // BOB
  "oj6if-riaaa-aaaaq-aaeha-cai", // ALICE
  "k45jy-aiaaa-aaaaq-aadcq-cai", // MOTOKO
];

export interface BaseTokenProps {
  token_id: string;
  onTokenClick: (token: Token) => void;
}

export function BaseToken({ token_id, onTokenClick }: BaseTokenProps) {
  const theme = useTheme();

  const [, token] = useToken(token_id);

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
      <TokenImage logo={token?.logo} size="24px" />
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
        {token?.symbol}
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
      {BASE_TOKEN_IDS.map((base_token_id) => (
        <BaseToken key={base_token_id} token_id={base_token_id} onTokenClick={onTokenClick} />
      ))}
    </Flex>
  );
}
