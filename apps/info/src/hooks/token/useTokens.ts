import { Token } from "@icpswap/swap-sdk";
import { useMemo, useEffect, useState } from "react";
import { getTokensFromInfo } from "hooks/useToken";
import { getTokenInfo } from "hooks/token/info-calls";
import { TokenInfo } from "types";

export function useTokens(tokenIds: string[] | undefined): { [key: string]: Token | undefined } | undefined {
  const [loading, setLoading] = useState(false);

  const [tokens, setTokens] = useState<{ [key: string]: Token }>({} as { [key: string]: Token });

  useEffect(() => {
    async function call() {
      if (tokenIds) {
        setLoading(true);

        const tokenInfos = await Promise.all(
          tokenIds.map(async (id) => {
            const tokenInfo = await getTokenInfo(id);
            return tokenInfo;
          }),
        );
        const tokens = getTokensFromInfo(tokenInfos.filter((info) => !!info) as TokenInfo[]);

        const _tokens: { [key: string]: Token } = {};

        tokens?.forEach((token) => {
          if (token) {
            _tokens[token.address] = token;
          }
        });

        setTokens(_tokens);
        setLoading(false);
      }
    }

    call();
  }, [tokenIds]);

  return useMemo(() => {
    if (loading) return undefined;

    return tokens;
  }, [loading, tokens]);
}
