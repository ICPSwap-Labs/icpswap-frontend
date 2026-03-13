import { isPrincipal, isValidPrincipal, nonUndefinedOrNull } from "@icpswap/utils";
import { tokenAdapter } from "@icpswap/token-adapter";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export interface GetTokenBalanceArgs {
  canisterId: string;
  address: string | Principal;
  sub?: Uint8Array;
}

export async function getTokenBalance({ canisterId, address, sub }: GetTokenBalanceArgs) {
  const result = await tokenAdapter.balance({
    canisterId,
    params: {
      user: isPrincipal(address)
        ? { principal: address }
        : isValidPrincipal(address)
        ? {
            principal: Principal.fromText(address),
          }
        : { address },
      token: "",
      subaccount: sub ? [...sub] : undefined,
    },
  });

  return result.data;
}

export interface UserTokenBalanceArgs {
  canisterId: string | undefined;
  address: string | Principal | undefined;
  sub?: Uint8Array;
}

export function useTokenBalance({
  canisterId,
  address,
  sub,
}: UserTokenBalanceArgs): UseQueryResult<string | undefined, Error> {
  return useQuery({
    queryKey: ["tokenBalance", canisterId, sub],
    queryFn: async () => {
      if (!address || !canisterId) return undefined;
      const balance = await getTokenBalance({ canisterId, sub, address });
      return balance === undefined ? undefined : balance.toString();
    },
    enabled: nonUndefinedOrNull(address) && nonUndefinedOrNull(canisterId),
  });
}
