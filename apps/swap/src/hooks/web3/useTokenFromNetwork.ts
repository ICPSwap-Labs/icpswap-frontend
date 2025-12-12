import { ERC20Token } from "@icpswap/swap-sdk";
import { useCallback, useMemo } from "react";
import { useSupportedActiveChain, useWeb3CallsData, useActiveChain } from "hooks/web3/index";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "abis/abis";
import { isUndefinedOrNull } from "@icpswap/utils/dist/isUndefinedOrNull";

export function useTokenName(tokenAddress: string | undefined) {
  const { address: account, chainId } = useAccount();

  const { data, isLoading } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}` | undefined,
    chainId,
    functionName: "name",
    args: [],
    query: { enabled: !isUndefinedOrNull(tokenAddress) && !isUndefinedOrNull(account) && !isUndefinedOrNull(chainId) },
  });

  return useMemo(() => {
    return {
      result: data,
      loading: isLoading,
    };
  }, [data, isLoading]);
}

export function useTokenSymbol(tokenAddress: string | undefined) {
  const { address: account, chainId } = useAccount();

  const { data, isLoading } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}` | undefined,
    chainId,
    functionName: "symbol",
    args: [],
    query: { enabled: !isUndefinedOrNull(tokenAddress) && !isUndefinedOrNull(account) && !isUndefinedOrNull(chainId) },
  });

  return useMemo(() => {
    return {
      result: data,
      loading: isLoading,
    };
  }, [data, isLoading]);
}

export function useTokenDecimals(tokenAddress: string | undefined) {
  const { address: account, chainId } = useAccount();

  const { data, isLoading } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}` | undefined,
    chainId,
    functionName: "decimals",
    args: [],
    query: { enabled: !isUndefinedOrNull(tokenAddress) && !isUndefinedOrNull(account) && !isUndefinedOrNull(chainId) },
  });

  return useMemo(() => {
    return {
      result: data,
      loading: isLoading,
    };
  }, [data, isLoading]);
}

export function useTokenLogo(tokenAddress: string | undefined) {
  return useWeb3CallsData<string>(
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
  const chainId = useActiveChain();
  const supportedActiveChain = useSupportedActiveChain();

  // TODO (WEB-1709): reduce this to one RPC call instead of 5
  // TODO: Fix redux-multicall so that these values do not reload.
  const { result: name } = useTokenName(tokenAddress);
  const { result: symbol } = useTokenSymbol(tokenAddress);
  const { result: decimals } = useTokenDecimals(tokenAddress);
  const { result: logo } = useTokenLogo(tokenAddress);

  return useMemo(() => {
    // If the token is on another chain, we cannot fetch it on-chain, and it is invalid.
    if (typeof tokenAddress !== "string" || !tokenAddress) return undefined;

    if ((!decimals && decimals !== 0) || !symbol || !name) {
      return undefined;
    }

    return new ERC20Token({ address: tokenAddress, decimals, name, symbol, logo });
  }, [tokenAddress, chainId, name, symbol, decimals, logo, supportedActiveChain]);
}
