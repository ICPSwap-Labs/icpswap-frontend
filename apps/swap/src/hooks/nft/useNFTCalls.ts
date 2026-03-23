import { Principal } from "@icp-sdk/core/principal";
import { NFTCanister, NFTCanisterController, swapNFT } from "@icpswap/actor";
import type {
  NFTBatchMintArgs,
  NFTCanisterInfo,
  NFTControllerArgs,
  NFTControllerInfo,
  NFTTokenMetadata,
  NFTTransaction,
  NFTTransferArgs,
  Null,
  PaginationResult,
  StatusResult,
} from "@icpswap/types";
import {
  isAvailablePageArgs,
  isUndefinedOrNull,
  isValidPrincipal,
  pageArgsFormat,
  principalToAccount,
  resultFormat,
} from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { OLD_CANISTER_IDS } from "constants/nft";
import { useCallback, useEffect, useMemo, useState } from "react";

export async function approveForAll(spenderCanisterId: string) {
  const spender = principalToAccount(spenderCanisterId);
  const result = await (await swapNFT(true)).approveForAll({ spender: { address: spender }, approved: true });
  return resultFormat(result);
}

export async function allowanceAll(account: string, spenderCanisterId: string) {
  const spender = principalToAccount(spenderCanisterId);
  return resultFormat<boolean>(await (await swapNFT()).isApproveForAll(account, spender)).data;
}

export function useUserNFTs(
  user: Principal | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTTokenMetadata> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserNFTs", user?.toString(), offset, limit],
    queryFn: async () => {
      if (!user || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<NFTTokenMetadata>>(
        await (await swapNFT()).findTokenList({ principal: user }, BigInt(offset), BigInt(limit)),
      ).data;
    },
    enabled: !!user && isAvailablePageArgs(offset, limit),
  });
}

export async function getSwapNFTTokenURI(tokenId: bigint | number) {
  const { data } = resultFormat<string>(await (await swapNFT()).tokenURI(BigInt(tokenId)));
  return JSON.parse(data ?? "") as { image: string; [key: string]: any };
}

export function useMintNFTCallback(): (canisterId: string, params: NFTBatchMintArgs) => Promise<StatusResult<bigint>> {
  return useCallback(async (canisterId, params) => {
    if (params.count && BigInt(params.count) > 1) {
      return resultFormat<bigint>(await (await NFTCanister(canisterId, true)).mint_batch(params));
    }

    return resultFormat<bigint>(
      await (await NFTCanister(canisterId, true)).mint({
        ...params,
      }),
    );
  }, []);
}

export function useNFTMetadata(
  canisterId: string | undefined | null,
  tokenId: number | bigint | null | undefined,
  reload?: any,
): UseQueryResult<NFTTokenMetadata | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTMetadata", canisterId, tokenId, reload],
    queryFn: async () => {
      if (!canisterId || (!tokenId && tokenId !== 0)) return undefined;
      return resultFormat<NFTTokenMetadata>(await (await NFTCanister(canisterId)).icsMetadata(Number(tokenId))).data;
    },
    enabled: !!canisterId && tokenId !== undefined && tokenId !== null,
  });
}

export function useNFTTransaction(
  canisterId: string,
  tokenIdentifier: string | null | undefined,
  offset: number,
  limit: number,
  reload?: boolean,
): UseQueryResult<PaginationResult<NFTTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTTransaction", canisterId, tokenIdentifier, offset, limit, reload],
    queryFn: async () => {
      if (!canisterId || !tokenIdentifier || !isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTTransaction>>(
        await (await NFTCanister(canisterId)).findTxRecord(tokenIdentifier, BigInt(offset), BigInt(limit)),
      ).data;
    },
    enabled: !!canisterId && !!tokenIdentifier && isAvailablePageArgs(offset, limit),
  });
}

export function useUserNFTTransactions(
  canisterId: string,
  principal: string | Null,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTTransaction> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserNFTTransactions", canisterId, principal, offset, limit],
    queryFn: async () => {
      if (!canisterId || !principal || !isAvailablePageArgs(offset, limit)) return undefined;

      return resultFormat<PaginationResult<NFTTransaction>>(
        await (await NFTCanister(canisterId)).findTokenTxRecord(
          { principal: Principal.fromText(principal) },
          BigInt(offset),
          BigInt(limit),
        ),
      ).data;
    },
    enabled: !!canisterId && !!principal && isAvailablePageArgs(offset, limit),
  });
}

export async function nftTransfer(canisterId: string, params: NFTTransferArgs) {
  return resultFormat<boolean>(await (await NFTCanister(canisterId, true)).transfer(params));
}

export function useNFTTransfer(): (canisterId: string, params: NFTTransferArgs) => Promise<StatusResult<boolean>> {
  return useCallback(
    async (canisterId, params) => resultFormat<boolean>(await (await NFTCanister(canisterId, true)).transfer(params)),
    [],
  );
}

export function useCanisterCycles(canisterId: string): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useCanisterCycles", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).cycleBalance()).data;
    },
    enabled: !!canisterId,
  });
}

export function useCanisterUserNFTCount(
  canisterId: string,
  account: string | Null,
  reload?: boolean | number,
): UseQueryResult<bigint | undefined, Error> {
  return useQuery({
    queryKey: ["useCanisterUserNFTCount", canisterId, account, reload],
    queryFn: async () => {
      if (!canisterId || !account) return undefined;
      return resultFormat<bigint>(await (await NFTCanister(canisterId)).ownerNFTCount({ address: account })).data;
    },
    enabled: !!canisterId && !!account,
  });
}

export function useNFTCanisterList(
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTControllerInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTCanisterList", offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findCanister(BigInt(offset), BigInt(limit)),
      ).data;
    },
    enabled: isAvailablePageArgs(offset, limit),
  });
}

export function useUserCanisterList(
  account: string | Null,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTControllerInfo> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserCanisterList", account, offset, limit],
    queryFn: async () => {
      if (!isAvailablePageArgs(offset, limit) || isUndefinedOrNull(account)) return undefined;
      return resultFormat<PaginationResult<NFTControllerInfo>>(
        await (await NFTCanisterController()).findUserCanister(account, BigInt(offset), BigInt(limit)),
      ).data;
    },
    enabled: isAvailablePageArgs(offset, limit) && !isUndefinedOrNull(account),
  });
}

export async function createCanister(values: NFTControllerArgs): Promise<StatusResult<string>> {
  return resultFormat<string>(await (await NFTCanisterController(true)).create(values));
}

export async function setCanisterLogo(canisterId: string, logo: string) {
  return resultFormat<boolean>(await (await NFTCanister(canisterId, true)).setLogo(logo));
}

export async function setCanisterLogoInController(canisterId: string, logo: string) {
  return resultFormat<boolean>(await (await NFTCanisterController(true)).setLogo(logo, canisterId));
}

export function useCanisterMetadata(
  canisterId: string,
): UseQueryResult<NFTControllerInfo | NFTCanisterInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useCanisterMetadata", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      if (OLD_CANISTER_IDS.includes(canisterId))
        return resultFormat<NFTControllerInfo>(await (await NFTCanisterController()).canisterInfo(canisterId)).data;
      return resultFormat<NFTCanisterInfo>(await (await NFTCanister(canisterId)).canisterInfo()).data;
    },
    enabled: !!canisterId,
  });
}

export async function getCanisterLogo(canisterId: string) {
  // The there canisters doesn't has info method in canister
  if (OLD_CANISTER_IDS.includes(canisterId))
    return resultFormat<NFTControllerInfo>(await (await NFTCanisterController()).canisterInfo(canisterId)).data?.image;
  return resultFormat<NFTCanisterInfo>(await (await NFTCanister(canisterId)).canisterInfo()).data?.image;
}

export function useCanisterLogo(canisterId: string): UseQueryResult<string | undefined, Error> {
  return useQuery({
    queryKey: ["useCanisterLogo", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getCanisterLogo(canisterId);
    },
    enabled: !!canisterId,
  });
}
export async function getCanisterNFTs(canisterId: string, address: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<NFTTokenMetadata>>(
    await (await NFTCanister(canisterId)).findTokenList(
      isValidPrincipal(address) ? { principal: Principal.fromText(address) } : { address },
      BigInt(offset),
      BigInt(limit),
    ),
  ).data;
}

export function useCanisterNFTList(
  canisterId: string,
  principal: string | Null,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTTokenMetadata> | undefined, Error> {
  return useQuery({
    queryKey: ["useCanisterNFTList", canisterId, principal, offset, limit],
    queryFn: async () => {
      if (!canisterId || !principal || !isAvailablePageArgs(offset, limit)) return undefined;
      return getCanisterNFTs(canisterId, principal, offset, limit);
    },
    enabled: !!canisterId && !!principal && isAvailablePageArgs(offset, limit),
  });
}

export function useCanisterNFTs(canister: string | Null, account: string | Null, page: number) {
  const LIMIT = 100;

  const [loading, setLoading] = useState<boolean>(false);
  const [nfts, setNFTs] = useState<null | Array<NFTTokenMetadata>>(null);
  const [totalElements, setTotalElements] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(canister) || isUndefinedOrNull(account)) return;

      setLoading(true);

      const [offset] = pageArgsFormat(page, LIMIT);

      const nftsResult = await getCanisterNFTs(canister, account, offset, LIMIT);

      if (nftsResult) {
        const nfts = nftsResult.content;
        setNFTs(nfts);
        setTotalElements(Number(nftsResult.totalElements));
      }

      setLoading(false);
    }

    call();
  }, [canister, account, page]);

  const hasMore = useMemo(() => {
    if (isUndefinedOrNull(totalElements) || isUndefinedOrNull(nfts)) return true;

    return totalElements !== nfts.length;
  }, [totalElements, nfts]);

  return useMemo(() => ({ nfts, loading, hasMore }), [nfts, loading, hasMore]);
}

export function useNFTMintInfo(): UseQueryResult<[bigint, bigint, string, string] | undefined, Error> {
  return useQuery({
    queryKey: ["useNFTMintInfo"],
    queryFn: async () => {
      return resultFormat<[bigint, bigint, string, string]>(await (await NFTCanisterController()).feeInfo()).data;
    },
  });
}

export async function getSwapNFTStat() {
  return resultFormat<[bigint, bigint]>(await (await swapNFT()).getNftStat()).data;
}
