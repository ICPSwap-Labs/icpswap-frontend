import { Principal } from "@dfinity/principal";
import { isValidPrincipal } from "@icpswap/utils";
import { useCallback } from "react";
import { useCallsData } from "@icpswap/hooks";
import { tokenAdapter } from "@icpswap/token-adapter";

export interface AllowanceArgs {
  canisterId: string;
  spender: string;
  spenderSub?: number[];
  owner: string;
  ownerSub?: number[];
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
  canisterId: string | undefined;
  spender: string | undefined;
  spenderSub?: number[];
  owner: string | undefined;
  ownerSub?: number[];
}

export function useAllowance({ canisterId, spender, spenderSub, owner, ownerSub }: useAllowanceArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!spender || !owner || canisterId === undefined) return undefined;
      return await allowance({
        spender: spender,
        spenderSub,
        owner: owner,
        ownerSub,
        canisterId,
      });
    }, [spender, spenderSub, owner, ownerSub, canisterId]),
  );
}
