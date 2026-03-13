import { NFTCanister, NFTTradeCanister, NFTCanisterController, NFTTradeStat, NFT_V1 } from "@icpswap/actor";
import { resultFormat, isAvailablePageArgs, isPrincipal, optionalArg } from "@icpswap/utils";
import { Principal } from "@icp-sdk/core/principal";
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
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

// ----------------> NFT Canisters
export async function getNFTCanisters(offset: number, limit: number) {
  return resultFormat<PaginationResult<NFTCanisterInfo>>(
    await (await NFTCanisterController()).findCanister(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useNFTCanisters(
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTCanisterInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTCanisters", offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getNFTCanisters(offset, limit);
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export async function getUserNFTCanisters(account: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<NFTCanisterInfo>>(
    await (await NFTCanisterController()).findUserCanister(account, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserNFTCanisters(
  account: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTCanisterInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserNFTCanisters", account, offset, limit],
    queryFn: async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserNFTCanisters(account, offset, limit);
    },
    enabled: !!account && isAvailablePageArgs(offset, limit),
  });
}

export async function getV1NFTCanisterMetadata(canisterId: string) {
  return resultFormat<NFTCanisterInfo>(await (await NFTCanisterController()).canisterInfo(canisterId)).data;
}

export function useV1NFTCanisterMetadata(
  canisterId: string | undefined,
): UseQueryResult<NFTCanisterInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useV1NFTCanisterMetadata", canisterId],
    queryFn: async () => {
      return await getV1NFTCanisterMetadata(canisterId!);
    },
    enabled: !!canisterId,
  });
}

export async function getNFTCanisterMetadata(canisterId: string) {
  return resultFormat<NFTCanisterInfo>(await (await NFTCanister(canisterId)).canisterInfo()).data;
}

export function useNFTCanisterMetadata(
  canisterId: string | undefined,
): UseQueryResult<NFTCanisterInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTCanisterMetadata", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getNFTCanisterMetadata(canisterId);
    },
    enabled: !!canisterId,
  });
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
}): UseQueryResult<PaginationResult<NFTTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTTransactions", canisterId, tokenIdentifier, offset, limit, reload],
    queryFn: async () => {
      if (!canisterId || !tokenIdentifier || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getNFTTransactions({
        canisterId,
        tokenIdentifier,
        offset,
        limit,
      });
    },
    enabled: !!canisterId && !!tokenIdentifier && isAvailablePageArgs(offset, limit),
  });
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
}): UseQueryResult<PaginationResult<NFTTokenMetadata> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserNFTs", canisterId, offset, limit, account, reload],
    queryFn: async () => {
      if (!account || (!canisterId && !isAvailablePageArgs(offset, limit))) return undefined;

      return await getUserNFTs({
        canisterId: canisterId!,
        offset,
        limit,
        account,
      });
    },
    enabled: !!account && (!!canisterId || isAvailablePageArgs(offset, limit)),
  });
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

export function useNFTs({
  canisterId,
  offset,
  limit,
  reload,
}: useNFTsArgs): UseQueryResult<PaginationResult<NFTTokenMetadata> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTs", canisterId, offset, limit, reload],
    queryFn: async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getNFTs({ canisterId, offset, limit });
    },
    enabled: !!canisterId && isAvailablePageArgs(offset, limit),
  });
}

export async function getNFTsStat(offset: number, limit: number) {
  return resultFormat<PaginationResult<TradeStateResult>>(
    await (await NFTTradeStat()).findCanisterStat(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useNFTsStat(
  offset: number,
  limit: number,
  reload?: boolean,
): UseQueryResult<PaginationResult<TradeStateResult> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTsStat", offset, limit, reload],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getNFTsStat(offset, limit);
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export async function getNFTStat(canisterId: string) {
  return resultFormat<[bigint, bigint]>(await (await NFTCanister(canisterId)).getNftStat()).data;
}

export function useNFTStat(
  canisterId: string | undefined,
  reload?: boolean,
): UseQueryResult<[bigint, bigint] | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTStat", canisterId, reload],
    queryFn: async () => {
      if (!canisterId) return undefined;

      return await getNFTStat(canisterId);
    },
    enabled: !!canisterId,
  });
}

export async function getV1NFTStat(canisterId: string) {
  const _result = await (await NFT_V1(canisterId)).getNftStat();
  const result: [bigint, bigint] = [BigInt(0), _result.holderAmount];
  return resultFormat<[bigint, bigint]>(result).data;
}

export function useV1NFTStat(canisterId: string | undefined): UseQueryResult<[bigint, bigint] | undefined, Error> {
  return useQuery({
    queryKey: ["useV1NFTStat", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getV1NFTStat(canisterId);
    },
    enabled: !!canisterId,
  });
}

export async function getNFTMetadata(canisterId: string, tokenId: number) {
  return resultFormat<NFTTokenMetadata>(await (await NFTCanister(canisterId)).icsMetadata(Number(tokenId))).data;
}

export function useNFTMetadata(
  canisterId: string | undefined,
  tokenId: number | undefined,
  reload?: boolean,
): UseQueryResult<NFTTokenMetadata | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTMetadata", canisterId, tokenId, reload],
    queryFn: async () => {
      if (!canisterId || (tokenId !== 0 && !tokenId)) return undefined;
      return await getNFTMetadata(canisterId, tokenId!);
    },
    enabled: !!canisterId && (tokenId === 0 || !!tokenId),
  });
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
}: NFTTradeTransactionsArgs): UseQueryResult<PaginationResult<TradeTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTTradeTransactions", canisterId, name, tokenIndex, offset, limit, sort, desc, reload],
    queryFn: async () => {
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
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
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
}: NFTUserTradeTransactionsArgs): UseQueryResult<PaginationResult<TradeTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserNFTTradeTransactions", account, canisterId, name, offset, limit, sort, desc, reload],
    queryFn: async () => {
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
    },
    enabled: !!account && isAvailablePageArgs(offset, limit),
  });
}

export async function getTradeOrder(canisterId: string, tokenIndex: number) {
  return resultFormat<OrderInfo>(await (await NFTTradeCanister()).getOrder(canisterId!, tokenIndex)).data;
}

export function useTradeOrder(
  canisterId: string,
  tokenIndex: number,
  reload?: boolean,
): UseQueryResult<OrderInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useTradeOrder", canisterId, tokenIndex, reload],
    queryFn: async () => {
      if (!canisterId || (tokenIndex === undefined && tokenIndex !== 0)) return undefined;
      return await getTradeOrder(canisterId, tokenIndex);
    },
    enabled: !!canisterId && (tokenIndex !== undefined || tokenIndex === 0),
  });
}

export async function getNFTTradeData() {
  return resultFormat<TotalTradeStat>(await (await NFTTradeCanister()).getStat()).data;
}

export function useNFTTradeData(): UseQueryResult<TotalTradeStat | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTTradeData"],
    queryFn: async () => {
      return await getNFTTradeData();
    },
  });
}
// ----------------> NFT Trade
