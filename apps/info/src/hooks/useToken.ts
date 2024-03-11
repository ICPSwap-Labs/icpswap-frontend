import { useMemo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { TOKEN_STANDARD } from "@icpswap/constants";
import { TokenInfo } from "types/token";
import { useTokenInfo } from "hooks/token/index";
import { getTokenStandard } from "store/token/cache/hooks";

export enum UseCurrencyState {
  LOADING = "LOADING",
  VALID = "VALID",
  INVALID = "INVALID",
}

export function useToken(tokenId: string | undefined): [UseCurrencyState, Token | undefined] {
  const { result: tokenInfo, loading: queryLoading } = useTokenInfo(tokenId);

  return useMemo(() => {
    if (!tokenId) return [UseCurrencyState.INVALID, undefined];
    if (!tokenInfo) return [UseCurrencyState.INVALID, undefined];
    if (queryLoading) return [UseCurrencyState.LOADING, undefined];

    return [
      UseCurrencyState.VALID,
      new Token({
        address: tokenId,
        decimals: Number(tokenInfo.decimals),
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        logo: tokenInfo.logo,
        transFee: Number(tokenInfo.transFee),
        standard: getTokenStandard(tokenInfo.canisterId) ?? TOKEN_STANDARD.EXT,
      }),
    ];
  }, [tokenId, tokenInfo, queryLoading]);
}

export function useTokenFromInfo(tokenInfo: TokenInfo | undefined) {
  return useMemo(() => {
    if (!tokenInfo) return undefined;

    return new Token({
      address: tokenInfo.canisterId,
      decimals: Number(tokenInfo.decimals),
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      logo: tokenInfo.logo,
      standard: getTokenStandard(tokenInfo.canisterId) ?? TOKEN_STANDARD.EXT,
    });
  }, [tokenInfo]);
}

export function useTokensFromInfo(tokenInfos: TokenInfo[] | undefined | null) {
  return useMemo(() => {
    if (!tokenInfos) return undefined;

    return tokenInfos.map((tokenInfo) =>
      tokenInfo
        ? new Token({
            address: tokenInfo.canisterId,
            decimals: Number(tokenInfo.decimals),
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            logo: tokenInfo.logo,
            standard: getTokenStandard(tokenInfo.canisterId) ?? TOKEN_STANDARD.EXT,
          })
        : undefined,
    );
  }, [tokenInfos]);
}

export function getTokensFromInfo(tokenInfos: TokenInfo[] | undefined | null) {
  if (!tokenInfos) return undefined;

  return tokenInfos.map((tokenInfo) =>
    tokenInfo
      ? new Token({
          address: tokenInfo.canisterId,
          decimals: Number(tokenInfo.decimals),
          symbol: tokenInfo.symbol,
          name: tokenInfo.name,
          logo: tokenInfo.logo,
          standard: getTokenStandard(tokenInfo.canisterId) ?? TOKEN_STANDARD.EXT,
        })
      : undefined,
  );
}
