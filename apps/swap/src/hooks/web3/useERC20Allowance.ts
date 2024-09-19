import { useCallsData } from "@icpswap/hooks";
import { ERC20Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useERC20Contract } from "hooks/web3/useContract";
import { useCallback, useMemo } from "react";

export interface UseTokenAllowanceArgs {
  tokenAllowance?: string;
  isSyncing: boolean;
}

export function useERC20TokenAllowance(
  token?: ERC20Token | Null,
  owner?: string | Null,
  spender?: string | Null,
  reload?: number | boolean,
): UseTokenAllowanceArgs {
  const contract = useERC20Contract(token?.address, false);

  // If there is no allowance yet, re-check next observed block.
  // This guarantees that the tokenAllowance is marked isSyncing upon approval and updated upon being synced.
  // const [blocksPerFetch, setBlocksPerFetch] = useState<1>();
  const { result, loading } = useCallsData<string>(
    useCallback(async () => {
      if (!owner || !spender) return undefined;
      const allowance = await contract?.allowance(owner, spender);
      return allowance?.toString();
    }, [owner, spender, contract]),
    reload,
  );

  const rawAmount = result?.toString(); // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(() => (token && rawAmount ? rawAmount : undefined), [token, rawAmount]);

  return useMemo(() => ({ tokenAllowance: allowance, isSyncing: loading }), [allowance, loading]);
}
