import { useCallback } from "react";
import { NFTCanister, NFTTradeCanister, NFTCanisterController, NFTTradeStat, NFT_V1 } from "@icpswap/actor";
import { resultFormat, isAvailablePageArgs, isPrincipal, optionalArg } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { Principal } from "@dfinity/principal";
import type {
  PaginationResult,
  NFTCanisterInfo,
  NFTTokenMetadata,
  TradeStateResult,
  TradeTransaction,
  OrderInfo,
  TotalTradeStat,
  NFTTransaction,
} from "@icpswap/types";

// ----------------> NFT Canisters
export async function getNFTCanisters(offset: number, limit: number) {
  return resultFormat<PaginationResult<NFTCanisterInfo>>(
    await (await NFTCanisterController()).findCanister(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useNFTCanisters(offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getNFTCanisters(offset, limit);
    }, [offset, limit]),
  );
}

export async function getUserNFTCanisters(account: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<NFTCanisterInfo>>(
    await (await NFTCanisterController()).findUserCanister(account, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserNFTCanisters(account: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserNFTCanisters(account!, offset, limit);
    }, [offset, limit]),
  );
}

export async function getV1NFTCanisterMetadata(canisterId: string) {
  return resultFormat<NFTCanisterInfo>(await (await NFTCanisterController()).canisterInfo(canisterId)).data;
}

export function useV1NFTCanisterMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      return await getV1NFTCanisterMetadata(canisterId!);
    }, [canisterId]),
    !!canisterId,
  );
}

export async function getNFTCanisterMetadata(canisterId: string) {
  return resultFormat<NFTCanisterInfo>(await (await NFTCanister(canisterId)).canisterInfo()).data;
}

export function useNFTCanisterMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getNFTCanisterMetadata(canisterId!);
    }, [canisterId]),
  );
}

// ----------------> NFT Canisters

// ----------------> NFTs

export type NFTTransactionsArgs = {
  canisterId: string;
  tokenIdentifier: string;
  offset: number;
  limit: number;
};

export async function getNFTTransactions({ canisterId, tokenIdentifier, offset, limit }: NFTTransactionsArgs) {
  return resultFormat<PaginationResult<NFTTransaction>>(
    await (await NFTCanister(canisterId)).findTxRecord(tokenIdentifier, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useNFTTransactions({
  canisterId,
  tokenIdentifier,
  offset,
  limit,
  reload,
}: {
  canisterId?: string;
  tokenIdentifier?: string;
  offset: number;
  limit: number;
  reload?: boolean;
}) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !tokenIdentifier || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getNFTTransactions({
        canisterId: canisterId,
        tokenIdentifier: tokenIdentifier,
        offset,
        limit,
      });
    }, [canisterId, offset, limit, tokenIdentifier]),
    reload,
  );
}

export async function getUserNFTs({
  canisterId,
  offset,
  limit,
  account,
}: {
  canisterId: string;
  offset: number;
  limit: number;
  account: string | Principal;
}) {
  return resultFormat<PaginationResult<NFTTokenMetadata>>(
    await (
      await NFTCanister(canisterId)
    ).findTokenList(
      isPrincipal(account) ? { principal: account } : { address: account },
      BigInt(offset),
      BigInt(limit),
    ),
  ).data;
}

export function useUserNFTs({
  canisterId,
  offset,
  limit,
  account,
  reload,
}: {
  canisterId?: string;
  offset: number;
  limit: number;
  account?: string | Principal;
  reload?: boolean;
}) {
  return useCallsData(
    useCallback(async () => {
      if (!account || (!canisterId && !isAvailablePageArgs(offset, limit))) return undefined;

      return await getUserNFTs({
        canisterId: canisterId,
        offset,
        limit,
        account: account,
      });
    }, [canisterId, account, offset, limit]),
    reload,
  );
}

export async function getNFTs({ canisterId, offset, limit }: { canisterId: string; offset: number; limit: number }) {
  return resultFormat<PaginationResult<NFTTokenMetadata>>(
    await (await NFTCanister(canisterId)).findTokenMarket(["all"], BigInt(offset), BigInt(limit)),
  ).data;
}

export interface useNFTsArgs {
  canisterId?: string;
  offset: number;
  limit: number;
  reload?: boolean;
}

export function useNFTs({ canisterId, offset, limit, reload }: useNFTsArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getNFTs({ canisterId: canisterId, offset, limit });
    }, [canisterId, offset, limit]),
    reload,
  );
}

export async function getNFTsStat(offset: number, limit: number) {
  return resultFormat<PaginationResult<TradeStateResult>>(
    await (await NFTTradeStat()).findCanisterStat(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useNFTsStat(offset: number, limit: number, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getNFTsStat(offset, limit);
    }, [offset, limit]),
    reload,
  );
}

export async function getNFTStat(canisterId: string) {
  return resultFormat<[bigint, bigint]>(await (await NFTCanister(canisterId)).getNftStat()).data;
}

export function useNFTStat(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;

      return await getNFTStat(canisterId);
    }, [canisterId]),
    reload,
  );
}

export async function getV1NFTStat(canisterId: string) {
  const _result = await (await NFT_V1(canisterId)).getNftStat();
  const result: [bigint, bigint] = [BigInt(0), _result.holderAmount];
  return resultFormat<[bigint, bigint]>(result).data;
}

export function useV1NFTStat(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getV1NFTStat(canisterId!);
    }, [canisterId]),
  );
}

export async function getNFTMetadata(canisterId: string, tokenId: number) {
  return resultFormat<NFTTokenMetadata>(await (await NFTCanister(canisterId)).icsMetadata(Number(tokenId))).data;
}

export function useNFTMetadata(canisterId: string | undefined, tokenId: number | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || (tokenId !== 0 && !tokenId)) return undefined;
      return await getNFTMetadata(canisterId, tokenId!);
    }, [canisterId, tokenId]),
    reload,
  );
}

// ----------------> NFTs

// ----------------> NFT Trade
export type NFTTradeTransactionsArgs = {
  canisterId?: string | undefined;
  name?: string;
  tokenIndex?: number | bigint;
  offset: number;
  limit: number;
  sort: string;
  desc: boolean;
  reload?: boolean;
};

export async function getNFTTradeTransactions({
  canisterId,
  name,
  tokenIndex,
  offset,
  limit,
  sort,
  desc,
}: NFTTradeTransactionsArgs) {
  return resultFormat<PaginationResult<TradeTransaction>>(
    await (
      await NFTTradeCanister()
    ).findTxPage(
      optionalArg<string>(canisterId),
      optionalArg<string>(name),
      optionalArg<number>(Number(tokenIndex)),
      BigInt(offset),
      BigInt(limit),
      sort,
      desc,
    ),
  ).data;
}

export function useNFTTradeTransactions({
  canisterId,
  name,
  tokenIndex,
  offset,
  limit,
  sort,
  desc,
  reload,
}: NFTTradeTransactionsArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;

      return await getNFTTradeTransactions({
        canisterId,
        offset,
        limit,
        sort,
        desc,
        tokenIndex,
        name,
      });
    }, [canisterId, name, tokenIndex, limit, offset, sort, desc]),
    reload,
  );
}

export type NFTUserTradeTransactionsArgs = {
  account: string;
  canisterId?: string | undefined;
  name?: string;
  offset: number;
  limit: number;
  sort: string;
  desc: boolean;
  reload?: boolean;
};

export async function getUserNFTTradeTransactions({
  account,
  canisterId,
  name,
  offset,
  limit,
  sort,
  desc,
}: NFTUserTradeTransactionsArgs) {
  return resultFormat<PaginationResult<TradeTransaction>>(
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
}

export function useUserNFTTradeTransactions({
  account,
  canisterId,
  name,
  offset,
  limit,
  sort,
  desc,
  reload,
}: NFTUserTradeTransactionsArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getUserNFTTradeTransactions({
        account,
        canisterId,
        offset,
        limit,
        sort,
        desc,
        name,
      });
    }, [account, canisterId, name, limit, offset, sort, desc]),
    reload,
  );
}

export async function getTradeOrder(canisterId: string, tokenIndex: number) {
  return resultFormat<OrderInfo>(await (await NFTTradeCanister()).getOrder(canisterId!, tokenIndex)).data;
}

export function useTradeOrder(canisterId: string, tokenIndex: number, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || (!tokenIndex && tokenIndex !== 0)) return undefined;
      return await getTradeOrder(canisterId, tokenIndex);
    }, [canisterId, tokenIndex]),
    reload,
  );
}

export async function getNFTTradeData() {
  return resultFormat<TotalTradeStat>(await (await NFTTradeCanister()).getStat()).data;
}

export function useNFTTradeData() {
  return useCallsData(
    useCallback(async () => {
      return await getNFTTradeData();
    }, []),
  );
}
// ----------------> NFT Trade
