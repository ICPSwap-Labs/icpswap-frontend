import { useMemo } from "react";
import { useGlobalTokenList } from "store/global/hooks";

export function useTokenInSNS(tokenId: string | undefined) {
  const globalTokenList = useGlobalTokenList();

  return useMemo(() => {
    if (!tokenId || !globalTokenList) return undefined;

    const token = globalTokenList.filter((token) => token.canisterId === tokenId)[0];

    if (!token) return false;

    const snsConfig = token.configs.find((c) => c.name === "SNS");

    if (!snsConfig) return false;

    return snsConfig.value === "true";
  }, [tokenId, globalTokenList]);
}
