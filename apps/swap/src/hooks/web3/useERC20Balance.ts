import { useAccount, useReadContracts } from "wagmi";
import { useMemo } from "react";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { erc20Abi } from "abis/abis";

export function useERC20Balance(contractAddress: string | undefined, reload = -1) {
  const { address: account, chainId } = useAccount();

  const { data, isLoading } = useReadContracts({
    contracts: useMemo(() => {
      if (isUndefinedOrNull(contractAddress) || isUndefinedOrNull(account) || isUndefinedOrNull(chainId))
        return undefined;

      return [
        {
          address: contractAddress as `0x${string}`,
          chainId,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [account],
        },
      ];
    }, [account, chainId, contractAddress]),
    query: { enabled: !!account },
    scopeKey: `erc20-balance-${reload}`,
  });

  return useMemo(() => {
    if (!data || !data[0] || data[0]?.status !== "success")
      return {
        loading: isLoading,
        result: undefined,
      };

    return {
      result: new BigNumber(data[0].result.toString()),
      loading: isLoading,
    };
  }, [data, isLoading]);
}
