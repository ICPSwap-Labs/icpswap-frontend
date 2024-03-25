import { useCallback } from "react";
import { Principal } from "@dfinity/principal";
import { tokenAdapter } from "@icpswap/token-adapter";
import { ResultStatus, StatusResult } from "@icpswap/types";
import { allowance } from "./useAllowance";

export interface ApproveArgs {
  canisterId: string;
  spender: string;
  value: number | string | bigint;
  account: string | Principal | undefined;
}

export async function approve({ canisterId, spender, value, account }: ApproveArgs) {
  if (!account) {
    return { status: ResultStatus.ERROR, data: undefined, message: "No account" };
  }

  return tokenAdapter.approve({
    canisterId,
    identity: true,
    params: {
      spender: Principal.fromText(spender),
      allowance: BigInt(value),
      subaccount: undefined,
      account,
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
      spender,
    });

    if (!allowedBalance || allowedBalance === BigInt(0) || BigInt(value) > allowedBalance) {
      return await approve({
        canisterId,
        spender,
        value,
        account,
      });
    }
    return await Promise.resolve({
      status: "ok",
      data: true,
      message: "You have approved successfully",
    } as StatusResult<boolean>);
  }, []);
}
