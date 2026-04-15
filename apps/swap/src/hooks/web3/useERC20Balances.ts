import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { erc20Abi } from "abis/abis";
import { type MultiCallResult, useMultiCall } from "hooks/web3/useMultiCall";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export interface ERC20BalanceResult {
  tokenAddress?: string;
  balance?: BigNumber;
  success: boolean;
}

/**
 * Batch reads ERC20 balances for a single owner by multicall.
 * Returned order always matches the input tokenAddresses order.
 */
export function useERC20Balances(
  tokenAddresses: (string | undefined | null)[],
  owner?: string | null,
  reload: number | string | boolean = -1,
) {
  const { address: account } = useAccount();

  const targetOwner = owner ?? account;

  const validTokens = useMemo(() => {
    return tokenAddresses
      .map((tokenAddress, index) => ({ tokenAddress, index }))
      .filter(({ tokenAddress }) => !isUndefinedOrNull(tokenAddress));
  }, [tokenAddresses]);

  const contracts = useMemo(() => {
    if (!targetOwner || !validTokens.length) return undefined;

    return validTokens.map(({ tokenAddress }) => ({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [targetOwner],
    }));
  }, [targetOwner, validTokens]);

  const { data, isLoading } = useMultiCall<MultiCallResult<bigint>>(contracts, {
    enabled: !!targetOwner && validTokens.length > 0,
    allowFailure: true,
    reload,
  });

  const result = useMemo<ERC20BalanceResult[]>(() => {
    const balances: ERC20BalanceResult[] = tokenAddresses.map((tokenAddress) => ({
      tokenAddress: tokenAddress ?? undefined,
      balance: undefined,
      success: false,
    }));

    validTokens.forEach(({ index }, validTokenIndex) => {
      const callResult = data[validTokenIndex];
      if (!callResult || callResult.status !== "success") {
        balances[index] = {
          tokenAddress: balances[index]?.tokenAddress,
          balance: undefined,
          success: false,
        };
        return;
      }

      balances[index] = {
        tokenAddress: balances[index]?.tokenAddress,
        balance: new BigNumber(callResult.result.toString()),
        success: true,
      };
    });

    return balances;
  }, [data, tokenAddresses, validTokens]);

  return useMemo(
    () => ({
      result,
      loading: isLoading,
    }),
    [result, isLoading],
  );
}
