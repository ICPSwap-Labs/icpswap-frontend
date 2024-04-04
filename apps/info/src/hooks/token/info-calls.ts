import { useCallback } from "react";
import { Principal } from "@dfinity/principal";
import { TokenInfo } from "types/token";
import { getTokenStandard } from "store/token/cache/hooks";
import { useCallsData, getTokenMetadata, getTokenSupply } from "@icpswap/hooks";
import { TOKEN_STANDARD } from "@icpswap/types";
import TokenDefaultLogo from "assets/images/Token_default_logo.png";
import { getTokenListLogo } from "./useTokenListLogo";

function isICRCToken(canisterId: string) {
  const tokenStandard = getTokenStandard(canisterId);
  return tokenStandard === TOKEN_STANDARD.ICRC1 || tokenStandard === TOKEN_STANDARD.ICRC2;
}

export async function getTokenBaseInfo(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  return Promise.all([
    getTokenSupply(canisterId),
    getTokenMetadata(canisterId),
    isICRCToken(canisterId) ? getTokenListLogo(canisterId) : null,
  ]).then(([supply, metadata, logo]) => {
    if (!metadata) return undefined;

    if (metadata.decimals === undefined || metadata.fee === undefined || !metadata.symbol) return undefined;

    const _logo = isICRCToken(canisterId) ? logo || metadata.logo : metadata.logo;

    return {
      timestamp: undefined,
      totalSupply: supply ?? BigInt(0),
      logo: _logo || TokenDefaultLogo,
      transFee: metadata.fee,
      decimals: metadata.decimals,
      metadata: [],
      name: metadata?.name,
      symbol: metadata?.symbol,
      canisterId,
      _canisterId: Principal.fromText(canisterId),
      standardType: getTokenStandard(canisterId) ?? TOKEN_STANDARD.EXT,
    } as TokenInfo;
  });
}

export async function getTokenInfo(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  return Promise.all([getTokenBaseInfo(canisterId)]).then(([baseInfo]) => {
    if (!baseInfo) return undefined;

    return {
      timestamp: undefined,
      totalSupply: baseInfo?.totalSupply ?? BigInt(0),
      logo: baseInfo.logo,
      transFee: baseInfo.transFee,
      decimals: baseInfo.decimals,
      metadata: [],
      name: baseInfo.name,
      symbol: baseInfo.symbol,
      canisterId,
      _canisterId: Principal.fromText(canisterId),
      standardType: getTokenStandard(canisterId) ?? TOKEN_STANDARD.EXT,
    } as TokenInfo;
  });
}

export function useTokenInfo(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getTokenInfo(canisterId);
    }, [canisterId]),
  );
}
