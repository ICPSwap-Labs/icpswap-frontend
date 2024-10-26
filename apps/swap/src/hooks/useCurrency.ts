import { useMemo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { TOKEN_STANDARD, WRAPPED_ICP } from "constants/index";
import { TokenInfo } from "types/token";
import { useTokenInfo, useTokensInfo } from "hooks/token/useTokenInfo";
import { getTokenStandard } from "store/token/cache/hooks";
import { ICP } from "@icpswap/tokens";

export enum UseCurrencyState {
  LOADING = "LOADING",
  VALID = "VALID",
  INVALID = "INVALID",
}

export function useToken(tokenId: string | undefined): [UseCurrencyState, Token | undefined] {
  const { result: tokenInfo, loading: queryLoading } = useTokenInfo(tokenId);

  return useMemo(() => {
    if (!tokenId) return [UseCurrencyState.INVALID, undefined];
    if (tokenId === ICP.address) return [UseCurrencyState.VALID, ICP];
    if (tokenId === WRAPPED_ICP.address) return [UseCurrencyState.VALID, WRAPPED_ICP];
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

export function useTokens(tokenIds: (string | undefined)[]): [UseCurrencyState, Token | undefined][] {
  const tokens = useTokensInfo(tokenIds);

  return useMemo(() => {
    return tokenIds.map((tokenId, index) => {
      const [, tokenInfo] = tokens[index];

      if (!tokenInfo || !tokenId) {
        return [UseCurrencyState.INVALID, undefined];
      }

      return [
        UseCurrencyState.VALID,
        new Token({
          address: tokenId,
          decimals: Number(tokenInfo.decimals),
          symbol: tokenInfo.symbol,
          name: tokenInfo.name,
          logo: tokenInfo.logo,
          transFee: Number(tokenInfo.transFee),
          standard: getTokenStandard(tokenInfo.canisterId) ?? TOKEN_STANDARD.ICRC1,
        }),
      ];
    });
  }, [tokens, tokenIds]);
}

export function useCurrencyFromInfo(tokenInfo: TokenInfo | undefined) {
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

export function useCurrenciesFromInfo(tokenInfos: TokenInfo[] | undefined | null) {
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
