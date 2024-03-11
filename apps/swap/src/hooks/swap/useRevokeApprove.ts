import { useEffect, useMemo, useState } from "react";
import type { SwapPoolData } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import { allowance, approve } from "hooks/token/index";
import { resultFormat } from "@icpswap/utils";

export async function revoke(tokenId: string, spender: string, principal: string) {
  return resultFormat<boolean>(
    await approve({
      canisterId: tokenId,
      spender,
      value: 0,
      account: principal,
    }),
  );
}

export interface UseRevokeApproveArgs {
  pools: SwapPoolData[] | undefined;
  tokenId: string | undefined;
}

export interface UseRevokeApproveResult {
  pool: SwapPoolData;
  allowance: bigint | undefined;
}

export function useRevokeApprove({ pools, tokenId }: UseRevokeApproveArgs) {
  const principal = useAccountPrincipal();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<undefined | UseRevokeApproveResult[]>(undefined);

  useEffect(() => {
    async function call() {
      if (principal && !!pools && (pools?.length ?? 0) > 0 && tokenId) {
        setLoading(true);

        const result = await Promise.all(
          pools?.map(async (pool) => {
            return await allowance({
              canisterId: tokenId,
              owner: principal.toString(),
              spender: pool.canisterId.toString(),
            });
          }),
        );

        setResult(result.map((e, index) => ({ allowance: e, pool: pools[index] })));
        setLoading(false);
      }
    }

    call();
  }, [principal, pools, tokenId]);

  return useMemo(() => ({ loading, result }), [result, loading]);
}
