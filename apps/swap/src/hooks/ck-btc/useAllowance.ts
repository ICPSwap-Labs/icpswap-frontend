import { resultFormat, availableArgsNull } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import { ckBTCActor } from "actor/ckBTC";
import { useCallback } from "react";

export interface AllowanceArgs {
  spender: Principal;
  spenderSub?: number[];
  owner: Principal;
  ownerSub?: number[];
}

export async function allowance({ spender, spenderSub, owner, ownerSub }: AllowanceArgs) {
  const result = await (
    await ckBTCActor(true)
  ).icrc2_allowance({
    account: { owner: owner, subaccount: availableArgsNull<number[]>(ownerSub) },
    spender: { owner: spender, subaccount: availableArgsNull<number[]>(spenderSub) },
  });

  return resultFormat<bigint>(result.allowance).data;
}

export interface useAllowanceArgs {
  spender: string | undefined;
  spenderSub?: number[];
  owner: string | undefined;
  ownerSub?: number[];
}

export function useAllowance({ spender, spenderSub, owner, ownerSub }: useAllowanceArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!spender || !owner) return undefined;
      return await allowance({
        spender: Principal.fromText(spender),
        spenderSub,
        owner: Principal.fromText(owner),
        ownerSub,
      });
    }, [spender, spenderSub, owner, ownerSub]),
  );
}
