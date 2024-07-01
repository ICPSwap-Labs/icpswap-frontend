import { ERC20Token } from "@icpswap/swap-sdk";
import { useCallback, useMemo } from "react";
import { useERC20Contract } from "hooks/web3/useContract";
import { useCallsData } from "@icpswap/hooks";
import { useWeb3React } from "@web3-react/core";

export function useTokenName(tokenAddress: string | undefined) {
  const contract = useERC20Contract(tokenAddress, false);

  return useCallsData<string>(
    useCallback(async () => {
      if (!tokenAddress || !contract) return undefined;
      return await contract.name();
    }, [tokenAddress, contract]),
  );
}

export function useTokenSymbol(tokenAddress: string | undefined) {
  const contract = useERC20Contract(tokenAddress, false);

  return useCallsData<string>(
    useCallback(async () => {
      if (!tokenAddress || !contract) return undefined;
      return await contract.symbol();
    }, [tokenAddress, contract]),
  );
}

export function useTokenDecimals(tokenAddress: string | undefined) {
  const contract = useERC20Contract(tokenAddress, false);

  return useCallsData<number>(
    useCallback(async () => {
      if (!tokenAddress || !contract) return undefined;
      return await contract.decimals();
    }, [tokenAddress, contract]),
  );
}

export function useTokenLogo(tokenAddress: string | undefined) {
  return useCallsData<string>(
    useCallback(async () => {
      if (!tokenAddress) return undefined;
      return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
    }, [tokenAddress]),
  );
}

/**
 * Returns a Token from the tokenAddress.
 * Returns null if token is loading or null was passed.
 * Returns undefined if tokenAddress is invalid or token does not exist.
 */
export function useTokenFromActiveNetwork(tokenAddress: string | undefined): ERC20Token | undefined {
  const { chainId } = useWeb3React();

  // TODO (WEB-1709): reduce this to one RPC call instead of 5
  // TODO: Fix redux-multicall so that these values do not reload.
  const { result: name } = useTokenName(tokenAddress);
  const { result: symbol } = useTokenSymbol(tokenAddress);
  const { result: decimals } = useTokenDecimals(tokenAddress);
  const { result: logo } = useTokenLogo(tokenAddress);

  return useMemo(() => {
    // If the token is on another chain, we cannot fetch it on-chain, and it is invalid.
    if (typeof tokenAddress !== "string" || !tokenAddress) return undefined;
    if (!chainId) return undefined;

    if ((!decimals && decimals !== 0) || !symbol || !name) {
      return undefined;
    }

    return new ERC20Token({ address: tokenAddress, decimals, name, symbol, logo });
  }, [tokenAddress, chainId, name, symbol, decimals, logo]);
}
