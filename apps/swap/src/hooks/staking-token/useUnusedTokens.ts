import { useMemo, useState, useEffect } from "react";
import { useAccountPrincipal } from "store/auth/hooks";
import { Principal } from "@dfinity/principal";
import { getTokenBalance } from "hooks/token/useTokenBalance";
import { SubAccount } from "@dfinity/ledger-icp";

export function useUserUnusedTokenByPool(
  poolId: string | undefined,
  stakingTokenId: string | undefined,
  reload?: boolean | number,
) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ balance: bigint | undefined; poolId: string; stakingTokenId: string } | null>(
    null,
  );
  const principal = useAccountPrincipal();

  useEffect(() => {
    const call = async () => {
      if (poolId && principal && stakingTokenId) {
        const result = await getTokenBalance(
          stakingTokenId,
          Principal.fromText(poolId),
          SubAccount.fromPrincipal(principal).toUint8Array(),
        );

        setData({
          balance: result.data,
          poolId,
          stakingTokenId,
        });
        setLoading(false);
      }
    };

    call();
  }, [poolId, principal, reload, stakingTokenId]);

  return useMemo(() => {
    return {
      loading,
      result: data,
    };
  }, [loading, data]);
}
