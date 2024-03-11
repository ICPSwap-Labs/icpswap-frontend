import { useCallback } from "react";
import { useCallsData } from "../useCallData";
import { wrapICP } from "@icpswap/actor";
import {
  resultFormat,
  availableArgsNull,
  isPrincipal,
  isAvailablePageArgs,
} from "@icpswap/utils";
import type {
  PaginationResult,
  WrapUser,
  WrapTransaction,
} from "@icpswap/types";
import { Principal } from "@dfinity/principal";

export async function getWrapTransactions(
  account: string | undefined | Principal,
  offset: number,
  limit: number,
  index: number | undefined
) {
  return await (
    await wrapICP()
  ).wrappedTx({
    user: account
      ? availableArgsNull<WrapUser>(
          isPrincipal(account) ? { principal: account } : { address: account }
        )
      : [],
    offset: availableArgsNull<bigint>(BigInt(offset)),
    limit: availableArgsNull<bigint>(BigInt(limit)),
    index: index ? [BigInt(index)] : [],
  });
}

export function useWrapTransactions(
  account: string | undefined | Principal,
  offset: number,
  limit: number,
  index?: number | undefined
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<WrapTransaction>>(
        await getWrapTransactions(account, offset, limit, index)
      ).data;
    }, [account, index, offset, limit])
  );
}
