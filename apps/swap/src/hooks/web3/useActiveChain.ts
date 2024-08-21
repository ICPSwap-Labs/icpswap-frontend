import { useWeb3React } from "@web3-react/core";
import { DEFAULT_CHAIN_ID, SUPPORTED_CHAINS } from "constants/web3";
import { useMemo } from "react";

export function useActiveChain(): number | undefined {
  const { chainId } = useWeb3React();

  return chainId ?? DEFAULT_CHAIN_ID;
}

export function useSupportedActiveChain() {
  const chainId = useActiveChain();

  return useMemo(() => {
    if (!chainId) return undefined;

    return SUPPORTED_CHAINS.includes(chainId);
  }, [chainId, SUPPORTED_CHAINS]);
}
