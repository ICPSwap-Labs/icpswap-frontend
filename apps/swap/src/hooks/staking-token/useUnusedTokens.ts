import { SubAccount, Principal } from "@icpswap/dfinity";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { getTokenBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";

export function useUserUnusedTokenByPool(poolId: string | undefined, stakingTokenId: string | undefined) {
  const principal = useAccountPrincipal();

  return useQuery({
    queryKey: ["userUnusedTokenByPool", poolId, stakingTokenId, principal],
    queryFn: async () => {
      if (poolId && principal && stakingTokenId) {
        const result = await getTokenBalance(
          stakingTokenId,
          Principal.fromText(poolId),
          SubAccount.fromPrincipal(principal).toUint8Array(),
        );

        return {
          balance: result.data,
          poolId,
          stakingTokenId,
        };
      }
    },
    enabled: nonUndefinedOrNull(poolId) && nonUndefinedOrNull(principal) && nonUndefinedOrNull(stakingTokenId),
  });
}
