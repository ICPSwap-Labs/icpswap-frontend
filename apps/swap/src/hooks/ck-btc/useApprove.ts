import { resultFormat, availableArgsNull } from "@icpswap/utils";
import { StatusResult } from "@icpswap/types";
import { Principal } from "@dfinity/principal";
import { ckBtcActor } from "@icpswap/actor";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useCallback } from "react";
import { ckBTC_MINTER_ID } from "@icpswap/constants";

import { useAllowance } from "./useAllowance";

export interface ApproveArgs {
  spender: Principal;
  amount: string | number | bigint;
  expected_allowance?: bigint;
  spenderSub?: number[];
}

export async function approve({ spender, amount, expected_allowance, spenderSub }: ApproveArgs) {
  return resultFormat<bigint>(
    await (
      await ckBtcActor(true)
    ).icrc2_approve({
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: BigInt(amount),
      spender: { owner: spender, subaccount: availableArgsNull<number[]>(spenderSub) },
      expires_at: availableArgsNull<bigint>(expected_allowance),
      expected_allowance: availableArgsNull<bigint>(expected_allowance),
    }),
  );
}

export interface useApproveArgs {
  spender: string | undefined;
  spenderSub?: number[];
}

export interface useApproveCallbackArgs {
  amount: string | number | bigint;
  expected_allowance?: bigint;
}

export function useApprove() {
  const principal = useAccountPrincipalString();

  const spender = ckBTC_MINTER_ID;

  const { result: allowance } = useAllowance({ spender, owner: principal });

  return useCallback(
    async ({ amount, expected_allowance }: useApproveCallbackArgs) => {
      if (!spender)
        return {
          status: "err",
          message: "No spender!",
        } as StatusResult<bigint>;

      if (!allowance || allowance < BigInt(amount)) {
        return await approve({ spender: Principal.fromText(spender), amount, expected_allowance });
      }

      return {
        status: "ok",
        message: "No need to approve",
      } as StatusResult<bigint>;
    },
    [allowance, spender],
  );
}
