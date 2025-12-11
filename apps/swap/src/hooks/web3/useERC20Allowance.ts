import { ERC20Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { erc20Abi } from "abis/abis";
import { useMemo } from "react";
import { assume0xAddress } from "utils/wagmi";
import { useReadContract } from "wagmi";

export interface UseTokenAllowanceArgs {
  tokenAllowance?: string;
  isSyncing: boolean;
}

export function useERC20TokenAllowance(
  token?: ERC20Token | Null,
  owner?: string | Null,
  spender?: string | Null,
  reload: number | boolean = -1,
): UseTokenAllowanceArgs {
  const queryEnabled = !!owner && !!token?.address && !!spender;

  const { data, isLoading } = useReadContract({
    abi: erc20Abi,
    address: token?.address as `0x${string}` | undefined,
    functionName: "allowance",
    args: queryEnabled ? [assume0xAddress(owner), assume0xAddress(spender)] : undefined,
    query: { enabled: queryEnabled },
    scopeKey: `erc20-allowance-${reload}`,
  });

  const rawAmount = data?.toString(); // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(() => (token && rawAmount ? rawAmount : undefined), [token, rawAmount]);

  return useMemo(() => ({ tokenAllowance: allowance, isSyncing: isLoading }), [data, isLoading]);
}
