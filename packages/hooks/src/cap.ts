import { useCallback } from "react";
import { useCallsData } from "./useCallData";
import { cap, cap_router } from "@icpswap/actor";
import { resultFormat, enumToString } from "@icpswap/utils";
import type { PaginationResult } from "@icpswap/types";
import type { GetTokenContractRootBucketResponse } from "@icpswap/candid";
import { Principal } from "@dfinity/principal";
import type { TokenTransaction, TokenTransType } from "@icpswap/types";

export async function getCapHistorySize(canisterId: string) {
  return await (await cap(canisterId)).size();
}

export function useCapHistorySize(canisterId: string) {
  return useCallsData<bigint>(
    useCallback(async () => await getCapHistorySize(canisterId), [canisterId])
  );
}

function SliceFormat(amount: any) {
  function lebDecode(pipe) {
    let weight = BigInt(1);
    let value = BigInt(0);
    let byte;
    do {
      if (pipe.length < 1) {
        throw new Error("unexpected end of buffer");
      }
      byte = pipe[0];
      pipe = pipe.slice(1);
      value += BigInt(byte & 0x7f).valueOf() * weight;
      weight *= BigInt(128);
    } while (byte >= 0x80);
    return value;
  }

  return amount instanceof Array &&
    !amount.some((value) => typeof value !== "number")
    ? lebDecode(Uint8Array.from(amount))
    : amount;
}

export function detailValueFormat(detailValue: any) {
  if (detailValue.Principal) {
    return detailValue.Principal.toString() as string;
  } else if (detailValue.Float) {
    return detailValue.Float;
  } else if (detailValue.False) {
    return detailValue.False;
  } else if (detailValue.True) {
    return detailValue.True;
  } else if (detailValue.I64) {
    return detailValue.I64;
  } else if (detailValue.U64) {
    return detailValue.U64;
  } else if (detailValue.TokenIdU64) {
    return String(detailValue.TokenIdU64);
  } else if (detailValue.Text) {
    return String(detailValue.Text);
  } else if (detailValue.Slice && detailValue.Slice.length > 0) {
    return SliceFormat(detailValue.Slice);
  }
}

export function detailsFormatter(details: any): { [key: string]: any } {
  let obj = {};
  details.forEach((detail) => {
    obj[detail[0]] = detailValueFormat(detail[1]);
  });
  return obj;
}

export async function getCapTransactions(
  canisterId: string,
  witness: boolean,
  offset: number
) {
  const totalElements = await getCapHistorySize(canisterId!);
  const totalPage =
    parseInt(String(Number(totalElements) / 64)) +
    (Number(totalElements) % 64 === 0 ? 0 : 1);
  const page = parseInt(String(offset / 64)) + 1;

  if (totalPage - page < 0 && totalPage !== 0) {
    return {
      totalElements: Number(totalElements),
      offset,
      limit: 64,
      content: [],
    };
  }

  const result = await (
    await cap(canisterId!)
  ).get_transactions({
    page: totalPage === 0 ? [] : [totalPage + 1 - page - 1],
    witness,
  });

  const transactions: TokenTransaction[] = result.data.map((_data) => {
    const details = detailsFormatter(_data.details);

    return {
      timestamp: details["timestamp"] ?? _data.time * BigInt(1000000),
      hash: details["hash"] ?? "",
      fee: details["fee"],
      from_owner: details["from"] ?? _data.caller.toString() ?? "",
      from_account: "",
      from_sub: undefined,
      to_owner: details["to"] ?? "",
      to_account: "",
      to_sub: undefined,
      transType: enumToString({ [_data.operation]: null } as TokenTransType),
      amount: details["value"] ?? details["amount"] ?? "",
      index: BigInt(0),
      memo: details["memo"] ?? [],
      status: "Complete",
    };
  });

  return {
    totalElements: Number(totalElements),
    offset,
    limit: 64,
    content: transactions.reverse(),
  };
}

export function useCapTransactions(
  canisterId: string | undefined,
  witness: boolean,
  offset: number
) {
  return useCallsData<PaginationResult<TokenTransaction>>(
    useCallback(async () => {
      return await getCapTransactions(canisterId!, witness, offset);
    }, [canisterId, offset]),
    !!canisterId
  );
}

export async function getCapUserTransactions(
  canisterId: string,
  principal: Principal,
  witness: boolean,
  offset: number
) {
  const default_result = await (
    await cap(canisterId!)
  ).get_user_transactions({
    page: [],
    witness,
    user: principal,
  });

  const totalElements = default_result.page * 64 + default_result.data.length;
  const totalPage = default_result.page + 1;
  const page = parseInt(String(offset / 64)) + 1;

  if (totalPage - page < 0 && totalPage !== 0) {
    return {
      totalElements: Number(totalElements),
      offset,
      limit: 64,
      content: [],
    };
  }

  const result = await (
    await cap(canisterId!)
  ).get_user_transactions({
    page: [totalPage === 0 ? 0 : totalPage + 1 - page - 1],
    witness,
    user: principal,
  });

  const transactions: TokenTransaction[] = result.data.map((_data) => {
    const details = detailsFormatter(_data.details);

    return {
      timestamp: details["timestamp"] ?? _data.time * BigInt(1000000),
      hash: details["hash"] ?? "",
      fee: details["fee"] ?? BigInt(0),
      from_owner: details["from"] ?? _data.caller.toString() ?? "",
      from_account: "",
      from_sub: undefined,
      to_owner: details["to"] ?? "",
      to_account: "",
      to_sub: undefined,
      transType: enumToString({ [_data.operation]: null } as TokenTransType),
      amount: details["value"] ?? details["amount"] ?? "",
      index: BigInt(0),
      memo: details["memo"] ?? [],
      status: "Complete",
    };
  });

  return {
    totalElements: totalElements,
    offset,
    limit: 64,
    content: transactions.reverse(),
  };
}

export function useCapUserTransactions(
  canisterId: string | undefined,
  principal: Principal | undefined,
  witness: boolean,
  offset: number
) {
  return useCallsData<PaginationResult<TokenTransaction>>(
    useCallback(async () => {
      return await getCapUserTransactions(
        canisterId!,
        principal!,
        witness,
        offset
      );
    }, [canisterId, offset]),
    !!canisterId && !!principal
  );
}

export async function getCapRootId(canisterId: string, witness?: boolean) {
  const result = resultFormat<GetTokenContractRootBucketResponse>(
    await (
      await cap_router()
    ).get_token_contract_root_bucket({
      canister: Principal.fromText(canisterId),
      witness: witness ?? false,
    })
  ).data;

  return result?.canister && result?.canister[0]
    ? result?.canister[0]
    : undefined;
}

export function useCapRootId(
  canisterId: string | undefined,
  witness?: boolean
) {
  return useCallsData<Principal>(
    useCallback(async () => {
      return await getCapRootId(canisterId!, witness);
    }, [canisterId, witness]),
    !!canisterId
  );
}
