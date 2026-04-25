import { Principal } from "@icpswap/dfinity";
import { NFTTradeCanister } from "@icpswap/actor";
import type { NFTSaleArgs, Null, PaginationResult, StatusResult } from "@icpswap/types";
import { isAvailablePageArgs, optionalArg, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { CANISTER_NAMES, getCanisterId } from "constants/index";
import { useCallback } from "react";
import type { TradeOrder, TxRecord } from "types";
import { AdapterName, NFTs, NFTsTrade, TradeAdapterName } from "utils/nft/index";

export interface AllowanceArgs {
  canisterId: string;
  account: string;
  spenderCanisterId: string;
  tokenIdentifier: string;
}

export async function allowance({ canisterId, account, spenderCanisterId, tokenIdentifier }: AllowanceArgs) {
  return (
    await NFTs.allowance({
      adapterName: AdapterName.ICPSwap,
      canisterId,
      params: {
        spender: Principal.fromText(spenderCanisterId),
        token: tokenIdentifier,
        owner: { address: account },
      },
    })
  ).data;
}

export interface ApproveArgs {
  canisterId: string;
  tokenIdentifier: string;
  account: string;
}

export async function approve({ canisterId, tokenIdentifier, account }: ApproveArgs) {
  const spenderCanisterId = getCanisterId(CANISTER_NAMES.NFTTrade);

  const allowanceBalance = await allowance({ canisterId, tokenIdentifier, spenderCanisterId, account });

  if (allowanceBalance !== BigInt(1)) {
    await NFTs.approve({
      canisterId,
      adapterName: AdapterName.ICPSwap,
      params: {
        spender: Principal.fromText(spenderCanisterId),
        token: tokenIdentifier,
        subaccount: [],
        allowance: BigInt(1),
      },
    });
  }

  return true;
}

export async function sell(params: NFTSaleArgs): Promise<StatusResult<boolean | undefined>> {
  return await NFTsTrade.sale({
    adapterName: TradeAdapterName.ICPSwap,
    params,
  });
}

export async function getTradeOrders(
  canisterId: string | null | undefined,
  name: string | null,
  user: string | null,
  token: number | null,
  offset: number,
  limit: number,
  sort: string,
  desc = false,
) {
  return resultFormat<PaginationResult<TradeOrder>>(
    await (
      await NFTTradeCanister()
    ).findOrderPage(
      optionalArg<string>(canisterId),
      optionalArg<string>(name),
      optionalArg<string>(user),
      optionalArg<number>(token),
      BigInt(offset),
      BigInt(limit),
      sort,
      desc,
    ),
  ).data;
}

export function useNFTTradeOrder(
  canisterId: string | null | undefined,
  name: string | null,
  user: string | null,
  token: number | null,
  offset: number,
  limit: number,
  sort: string,
  desc = false,
): UseQueryResult<PaginationResult<TradeOrder> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTTradeOrder", canisterId, name, user, token, offset, limit, sort, desc],
    queryFn: async () => {
      if (!sort || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getTradeOrders(canisterId, name, user, token, offset, limit, sort, desc);
    },
    enabled: !!sort && isAvailablePageArgs(offset, limit),
  });
}

export function useNFTBuyCallback() {
  return useCallback(async (canisterId: string, tokenIndex: bigint | string | number) => {
    return await NFTsTrade.buy({
      params: { nftCid: canisterId, tokenIndex: Number(tokenIndex) },
      adapterName: TradeAdapterName.ICPSwap,
    });
  }, []);
}

export async function cancel(canisterId: string, tokenIndex: number | bigint) {
  return await NFTsTrade.revoke({
    params: { nftCid: canisterId, tokenIndex: Number(tokenIndex) },
    adapterName: TradeAdapterName.ICPSwap,
  });
}

export function useTradeTxList(
  canisterId: string | null | undefined,
  name: string | null | undefined,
  tokenIndex: number | null,
  offset: number,
  limit: number,
  sort: string,
  desc: boolean,
): UseQueryResult<PaginationResult<TxRecord> | undefined, Error> {
  return useQuery({
    queryKey: ["useTradeTxList", canisterId, name, tokenIndex, offset, limit, sort, desc],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<TxRecord>>(
        await (
          await NFTTradeCanister()
        ).findTxPage(
          optionalArg<string>(canisterId),
          optionalArg<string>(name),
          optionalArg<number>(tokenIndex),
          BigInt(offset),
          BigInt(limit),
          sort,
          desc,
        ),
      ).data;
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export function useUserTradeTxList(
  account: string | Null,
  canisterId: string | Null,
  name: string | Null,
  offset: number,
  limit: number,
  sort: string,
  desc: boolean,
): UseQueryResult<PaginationResult<TxRecord> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserTradeTxList", account, canisterId, name, offset, limit, sort, desc],
    queryFn: async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<TxRecord>>(
        await (
          await NFTTradeCanister()
        ).findUserTxPage(
          account,
          optionalArg<string>(canisterId),
          optionalArg<string>(name),
          BigInt(offset),
          BigInt(limit),
          sort,
          desc,
        ),
      ).data;
    },
    enabled: !!account && isAvailablePageArgs(offset, limit),
  });
}

export function useNFTRecommend(
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<TradeOrder> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTRecommend", offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<TradeOrder>>(
        await (await NFTTradeCanister()).findRecommend(BigInt(offset), BigInt(limit)),
      ).data;
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export function useNFTOrderInfo(
  canisterId: string | undefined,
  tokenIndex: number | bigint | undefined,
  reload?: boolean,
): UseQueryResult<TradeOrder | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTOrderInfo", canisterId, tokenIndex, reload],
    queryFn: async () => {
      if (!canisterId || !tokenIndex) return undefined;
      return resultFormat<TradeOrder>(await (await NFTTradeCanister()).getOrder(canisterId, Number(tokenIndex))).data;
    },
    enabled: !!canisterId && !!tokenIndex,
  });
}

export async function checkPayment(tx: string) {
  return resultFormat<boolean>(await (await NFTTradeCanister()).checkPayment(tx));
}
