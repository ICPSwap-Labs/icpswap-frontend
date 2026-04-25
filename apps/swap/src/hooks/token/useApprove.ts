import { Principal } from "@icp-sdk/core/principal";
import { type TOKEN_STANDARD, tokenAdapter } from "@icpswap/token-adapter";
import type { NumberType, StatusResult } from "@icpswap/types";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { allowance } from "hooks/token/useAllowance";
import { useCallback } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

export interface ApproveArgs {
  canisterId: string;
  spender: string;
  value: number | string | bigint;
  account: string | Principal;
  standard?: TOKEN_STANDARD;
}

export async function approve({ canisterId, spender, value, account, standard }: ApproveArgs) {
  if (nonUndefinedOrNull(standard)) {
    const adapter = tokenAdapter.getAdapterByName(standard);

    return adapter.approve({
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
  return useCallback(async ({ canisterId, spender, value, account, standard }: ApproveArgs) => {
    if (!account) {
      return await Promise.resolve({
        status: "err",
        message: "Invalid account",
      } as StatusResult<boolean>);
    }

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
        standard,
      });
    }
    return await Promise.resolve({
      status: "ok",
      data: true,
      message: "You have approved successfully",
    } as StatusResult<boolean>);
  }, []);
}

export type UserTokenApproveArgs = {
  tokenId: string;
  spender: string;
  amount: NumberType;
};

export type UserTokenApprove = ReturnType<typeof useUserTokenApprove>;

export function useUserTokenApprove(): ({
  tokenId,
  spender,
  amount,
}: UserTokenApproveArgs) => Promise<StatusResult<boolean>> {
  const principal = useAccountPrincipalString();

  return useCallback(
    async ({ tokenId, spender, amount }: UserTokenApproveArgs) => {
      if (!principal) {
        return await Promise.resolve({
          status: "err",
          message: "Invalid user",
        } as StatusResult<boolean>);
      }

      const allowedBalance = await allowance({
        canisterId: tokenId,
        owner: principal.toString(),
        spender,
      });

      if (!allowedBalance || allowedBalance === BigInt(0) || BigInt(amount.toString()) > allowedBalance) {
        return await approve({
          canisterId: tokenId,
          spender,
          value: amount.toString(),
          account: principal,
        });
      }

      return await Promise.resolve({
        status: "ok",
        data: true,
        message: "You have approved successfully",
      } as StatusResult<boolean>);
    },
    [principal],
  );
}
