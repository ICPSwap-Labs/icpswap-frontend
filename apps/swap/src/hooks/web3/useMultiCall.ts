import { isUndefinedOrNull } from "@icpswap/utils";
import { useMemo } from "react";
import { assume0xAddress } from "utils/wagmi";
import { mainnet } from "viem/chains";
import { useAccount, useReadContracts } from "wagmi";

const MULTICALL_ADDRESS = {
  [mainnet.id]: "0xcA11bde05977b3631167028862bE2a173976CA11",
};

interface MultiCallOptions {
  enabled?: boolean;
  allowFailure?: boolean;
  reload?: number | string | boolean;
}

type MultiCallContract = {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args?: readonly unknown[];
};

type UseReadContractsReturn = ReturnType<typeof useReadContracts>;

export type MultiCallResult<T> = { status: "success"; result: T } | { status: "failure"; error: Error };

type UseMultiCallReturn<TData> = Omit<UseReadContractsReturn, "data"> & {
  data: TData[];
};

/**
 * Execute multiple view calls in a single multicall request.
 */
export function useMultiCall<TData = unknown>(
  contracts?: readonly MultiCallContract[],
  options: MultiCallOptions = {},
): UseMultiCallReturn<TData> {
  const { chainId } = useAccount();

  const { enabled = true, allowFailure = true, reload = -1 } = options;

  const calls = useMemo(() => {
    if (!chainId || !contracts?.length) return undefined;

    return contracts.map((contract) => ({
      ...contract,
      chainId,
    }));
  }, [contracts, chainId]);

  const hasMultiCallAddress = !isUndefinedOrNull(chainId) && !isUndefinedOrNull(MULTICALL_ADDRESS[chainId]);

  const result = useReadContracts({
    contracts: calls,
    allowFailure,
    multicallAddress: hasMultiCallAddress && chainId ? assume0xAddress(MULTICALL_ADDRESS[chainId]) : undefined,
    query: {
      enabled: enabled && !!calls?.length,
    },
    scopeKey: `multicall-${reload}`,
  });

  return useMemo<UseMultiCallReturn<TData>>(
    () => ({
      ...result,
      data: (result.data ?? []) as TData[],
    }),
    [result],
  );
}
