import { useCallback } from "react";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";
import { PaginationResult } from "types/index";
import type { Null, WrapMintArgs, WrapTransaction, WrapWithdrawArgs } from "@icpswap/types";
import { wrapICP as wrapIcpActor } from "@icpswap/actor";

export async function wrapICP(params: WrapMintArgs) {
  return resultFormat<boolean>(await (await wrapIcpActor(true)).mint(params));
}

export async function unwrapICP(params: WrapWithdrawArgs) {
  return resultFormat<boolean>(await (await wrapIcpActor(true)).withdraw(params));
}

export function useUserExchangeRecord(account: string | Null, offset: number, limit: number, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<WrapTransaction>>(
        await (
          await wrapIcpActor()
        ).wrappedTx({
          user: [{ address: account }],
          offset: [BigInt(offset)],
          limit: [BigInt(limit)],
          index: [],
        }),
      ).data;
    }, [account, offset, limit]),
    reload,
  );
}
