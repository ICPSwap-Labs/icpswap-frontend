import { useCallback } from "react";
import { isPrincipal, isValidPrincipal } from "@icpswap/utils";
import { tokenAdapter } from "@icpswap/token-adapter";
import { Principal } from "@dfinity/principal";
import BigNumber from "bignumber.js";
import { useLatestDataCall } from "../useCallData";

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
  refresh?: boolean | number;
}

export function useTokenBalance({ canisterId, address, sub, refresh }: UserTokenBalanceArgs): {
  result: BigNumber | undefined;
  loading: boolean;
} {
  return useLatestDataCall<BigNumber | undefined>(
    useCallback(async () => {
      if (!address || !canisterId) return undefined;
      const balance = await getTokenBalance({ canisterId, sub, address });
      return balance === undefined ? undefined : new BigNumber(balance.toString());
    }, [address, canisterId, sub]),
    refresh,
  );
}
