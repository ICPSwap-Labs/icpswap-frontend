import { Principal } from "@icp-sdk/core/principal";
import { ckBtcActor } from "@icpswap/actor";
import { optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export interface AllowanceArgs {
  spender: Principal;
  spenderSub?: number[];
  owner: Principal;
  ownerSub?: number[];
}

export async function allowance({ spender, spenderSub, owner, ownerSub }: AllowanceArgs) {
  const result = await (await ckBtcActor(true)).icrc2_allowance({
    account: { owner, subaccount: optionalArg<number[]>(ownerSub) },
    spender: { owner: spender, subaccount: optionalArg<number[]>(spenderSub) },
  });

  return resultFormat<bigint>(result.allowance).data;
}

export interface useAllowanceArgs {
  spender: string | undefined;
  spenderSub?: number[];
  owner: string | undefined;
  ownerSub?: number[];
}

export function useAllowance({
  spender,
  spenderSub,
  owner,
  ownerSub,
}: useAllowanceArgs): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["ckBtcUseAllowance", spender, spenderSub, owner, ownerSub],
    queryFn: async () => {
      if (!spender || !owner) return undefined;
      return await allowance({
        spender: Principal.fromText(spender),
        spenderSub,
        owner: Principal.fromText(owner),
        ownerSub,
      });
    },
    enabled: !!spender && !!owner,
  });
}
