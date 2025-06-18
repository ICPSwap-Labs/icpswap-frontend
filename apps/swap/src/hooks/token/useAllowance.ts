import { Principal } from "@dfinity/principal";
import { isUndefinedOrNull, isValidPrincipal } from "@icpswap/utils";
import { useCallback } from "react";
import { useCallsData } from "@icpswap/hooks";
import { tokenAdapter } from "@icpswap/token-adapter";
import { Null } from "@icpswap/types";

export interface AllowanceArgs {
  canisterId: string;
  spender: string;
  spenderSub?: number[] | Null;
  owner: string;
  ownerSub?: number[] | Null;
}

export async function allowance({ canisterId, owner, spender, spenderSub, ownerSub }: AllowanceArgs) {
  return (
    await tokenAdapter.allowance({
      canisterId,
      params: {
        spender: Principal.fromText(spender),
        owner: isValidPrincipal(owner) ? { principal: Principal.fromText(owner) } : { address: owner },
        spenderSub,
        subaccount: ownerSub,
      },
    })
  ).data;
}

export interface useAllowanceArgs {
  canisterId: string | Null;
  spender: string | Null;
  spenderSub?: number[];
  owner: string | Null;
  ownerSub?: number[];
  refresh?: number;
}

export function useAllowance({ canisterId, spender, spenderSub, owner, ownerSub, refresh }: useAllowanceArgs) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(spender) || isUndefinedOrNull(owner) || isUndefinedOrNull(canisterId)) return undefined;

      return await allowance({
        spender,
        spenderSub,
        owner,
        ownerSub,
        canisterId,
      });
    }, [spender, spenderSub, owner, ownerSub, canisterId]),
    refresh,
  );
}
