import { useCallback } from "react";
import { Principal } from "@dfinity/principal";
import { tokenAdapter } from "@icpswap/token-adapter";
import { allowance } from "./useAllowance";
import { StatusResult } from "@icpswap/types";

export interface ApproveArgs {
  canisterId: string;
  spender: string;
  value: number | string | bigint;
  account: string | Principal | undefined;
}

export async function approve({ canisterId, spender, value, account }: ApproveArgs) {
  return tokenAdapter.approve({
    canisterId,
    identity: true,
    params: {
      spender: Principal.fromText(spender),
      allowance: BigInt(value),
      subaccount: undefined,
      account: account!,
    },
  });
}

export function useApprove(): (approveParams: ApproveArgs) => Promise<StatusResult<boolean>> {
  return useCallback(async ({ canisterId, spender, value, account }: ApproveArgs) => {
    if (!account)
      return await Promise.resolve({
        status: "err",
        message: "Invalid account",
      } as StatusResult<boolean>);

    const allowedBalance = await allowance({
      canisterId,
      owner: account.toString(),
      spender: spender,
    });

    if (!allowedBalance || allowedBalance === BigInt(0) || BigInt(value) > allowedBalance) {
      return await approve({
        canisterId,
        spender,
        value,
        account,
      });
    } else {
      return await Promise.resolve({
        status: "ok",
        data: true,
        message: "You have approved successfully",
      } as StatusResult<boolean>);
    }
  }, []);
}
