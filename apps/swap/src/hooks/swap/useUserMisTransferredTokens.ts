import { useEffect, useMemo, useState } from "react";
import { getTokenBalance, useSwapPools } from "@icpswap/hooks";
import { swapPool } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";

export interface useUserMisTransferredTokensArgs {
  tokenId: string | undefined;
}

export type MisTransferredResult = {
  poolId: string;
  balance: bigint;
  tokenAddress: string;
  token0Address: string;
  token1Address: string;
};

export function useUserMisTransferredTokens({ tokenId }: useUserMisTransferredTokensArgs) {
  const [loading, setLoading] = useState(true);
  const [misTransferred, setMisTransferred] = useState<MisTransferredResult[]>([]);

  const { result: allSwapPools } = useSwapPools();
  const principal = useAccountPrincipal();

  useEffect(() => {
    async function call() {
      if (tokenId && principal && !!allSwapPools && allSwapPools.length > 0) {
        setLoading(true);

        const result = await Promise.all(
          allSwapPools.map(async (pool) => {
            const sub = SubAccount.fromPrincipal(principal).toUint8Array();
            return await getTokenBalance({ canisterId: tokenId, address: pool.canisterId.toString(), sub });
          }),
        );

        setMisTransferred(
          result.map((ele, index) => {
            const pool = allSwapPools[index];
            const poolId = pool.canisterId.toString();

            return {
              poolId,
              balance: ele ?? BigInt(0),
              tokenAddress: tokenId,
              token0Address: pool.token0.address,
              token1Address: pool.token1.address,
            };
          }),
        );
        setLoading(false);
      }
    }

    call();
  }, [allSwapPools, tokenId, principal]);

  return useMemo(() => ({ loading, result: misTransferred }), [loading, misTransferred]);
}

export async function withdrawMisTransferredToken(poolId: string, tokenId: string, standard: string) {
  return resultFormat<bigint>(
    await (
      await swapPool(poolId, true)
    ).withdrawMistransferBalance({
      address: tokenId,
      standard,
    }),
  );
}
