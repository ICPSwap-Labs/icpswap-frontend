import { Principal } from "@icpswap/dfinity";
import { swapFactory, swapNFT, swapPool, swapPosition } from "@icpswap/actor";
import type {
  ActorIdentity,
  ClaimArgs,
  CreatePoolArgs,
  DecreaseLiquidityArgs,
  DepositAndSwapArgs,
  GetPoolArgs,
  IncreaseLiquidityArgs,
  MintArgs,
  NFTTokenMetadata,
  Null,
  PaginationResult,
  PoolMetadata,
  PositionInfoWithId,
  SwapArgs,
  SwapPoolData,
  TickInfoWithId,
  TickLiquidityInfo,
  UserPositionInfo,
  UserPositionInfoWithId,
  UserPositionInfoWithTokenAmount,
} from "@icpswap/types";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { getPaginationAllData, getPaginationAllDataLimit, usePaginationAllData } from "../useCallData";

export async function createSwapPool(args: CreatePoolArgs) {
  return resultFormat<SwapPoolData>(await (await swapFactory(true)).createPool(args));
}

export async function getSwapPool(args: GetPoolArgs) {
  return resultFormat<SwapPoolData>(await (await swapFactory()).getPool(args)).data;
}

export function useSwapPool(args: GetPoolArgs | undefined): UseQueryResult<SwapPoolData | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPool", args],
    queryFn: async () => {
      if (!args) return undefined;
      return await getSwapPool(args);
    },
    enabled: !!args,
  });
}

export async function getSwapPools() {
  return resultFormat<SwapPoolData[]>(await (await swapFactory()).getPools()).data;
}

export function useSwapPools(): UseQueryResult<SwapPoolData[] | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPools"],
    queryFn: async () => {
      return await getSwapPools();
    },
  });
}

export async function getSwapPoolMetadata(canisterId: string) {
  return resultFormat<PoolMetadata>(await (await swapPool(canisterId)).metadata()).data;
}

export function useSwapPoolMetadata(canisterId: string | Null): UseQueryResult<PoolMetadata | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPoolMetadata", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolMetadata(canisterId);
    },
    enabled: !!canisterId,
  });
}

export async function getSwapTickInfos(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<TickLiquidityInfo>>(
    await (await swapPool(canisterId)).getTickInfos(BigInt(offset), BigInt(limit)),
  ).data;
}

export async function getSwapPoolAllTickInfos(poolId: string, limit = 500) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapTickInfos(poolId, offset, limit);
  };

  return await getPaginationAllData<TickLiquidityInfo>(callback, limit);
}

export function useLiquidityTickInfos(
  canisterId: string | undefined,
  limit?: number,
): UseQueryResult<TickLiquidityInfo[] | undefined, Error> {
  return useQuery({
    queryKey: ["useLiquidityTickInfos", canisterId, limit],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolAllTickInfos(canisterId, limit);
    },
    enabled: !!canisterId,
  });
}

export async function deposit(canisterId: string, token: string, amount: bigint, fee: bigint) {
  return resultFormat<bigint>(await (await swapPool(canisterId, true)).deposit({ token, amount, fee }));
}

export async function depositFrom(canisterId: string, token: string, amount: bigint, fee: bigint) {
  return resultFormat<bigint>(await (await swapPool(canisterId, true)).depositFrom({ token, amount, fee }));
}

export async function mint(canisterId: string, args: MintArgs) {
  return resultFormat<bigint>(await (await swapPool(canisterId, true)).mint(args));
}

export async function increaseLiquidity(poolId: string, args: IncreaseLiquidityArgs) {
  return resultFormat<bigint>(await (await swapPool(poolId, true)).increaseLiquidity(args));
}

export async function decreaseLiquidity(poolId: string, args: DecreaseLiquidityArgs) {
  return resultFormat<{ amount0: bigint; amount1: bigint }>(
    await (await swapPool(poolId, true)).decreaseLiquidity(args),
  );
}

export async function withdraw(poolId: string, token: string, fee: bigint, amount: bigint) {
  return resultFormat<bigint>(await (await swapPool(poolId, true)).withdraw({ token, fee, amount }));
}

export async function quote(poolId: string, args: SwapArgs): Promise<bigint | undefined> {
  const quote_result = await (await swapPool(poolId)).quote(args);
  return resultFormat<bigint>(quote_result).data;
}

export async function swap(poolId: string, args: SwapArgs) {
  return resultFormat<bigint>(await (await swapPool(poolId, true)).swap(args));
}

export async function depositAndSwap(poolId: string, args: DepositAndSwapArgs) {
  return resultFormat<bigint>(await (await swapPool(poolId, true)).depositAndSwap(args));
}

export async function depositFromAndSwap(poolId: string, args: DepositAndSwapArgs) {
  const result = await (await swapPool(poolId, true)).depositFromAndSwap(args);
  return resultFormat<bigint>(result);
}

export async function collect(poolId: string, args: ClaimArgs) {
  return resultFormat<{ amount0: bigint; amount1: bigint }>(await (await swapPool(poolId, true)).claim(args));
}

export async function getUserUnusedBalance(canisterId: string, user: Principal) {
  return resultFormat<{ balance0: bigint; balance1: bigint }>(
    await (await swapPool(canisterId)).getUserUnusedBalance(user),
  ).data;
}

export function useUserUnusedBalance(
  canisterId: string | Null,
  user: Principal | Null,
  refresh?: number | boolean,
): UseQueryResult<{ balance0: bigint; balance1: bigint } | undefined, Error> {
  return useQuery({
    queryKey: ["useUserUnusedBalance", canisterId, user?.toString(), refresh],
    queryFn: async () => {
      if (!canisterId || !user) return undefined;
      return await getUserUnusedBalance(canisterId, user);
    },
    enabled: !!canisterId && !!user,
  });
}

export async function getSwapPosition(canisterId: string, tokenId: bigint) {
  return resultFormat<UserPositionInfo>(await (await swapPool(canisterId)).getUserPosition(tokenId)).data;
}

export function useSwapPosition(
  canisterId: string | undefined,
  positionId: bigint | undefined,
): UseQueryResult<UserPositionInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPosition", canisterId, positionId?.toString()],
    queryFn: async () => {
      if (!canisterId || (!positionId && positionId !== BigInt(0))) return undefined;
      return await getSwapPosition(canisterId, positionId!);
    },
    enabled: !!canisterId && (positionId !== undefined || positionId === BigInt(0)),
  });
}

export async function getPositionFee(canisterId: string, positionId: bigint) {
  return resultFormat<{ tokensOwed0: bigint; tokensOwed1: bigint }>(
    await (await swapPool(canisterId)).refreshIncome(positionId),
  ).data;
}

export function usePositionFee(
  canisterId: string | undefined,
  positionId: bigint | undefined,
  refresh?: number | boolean,
): UseQueryResult<{ tokensOwed0: bigint; tokensOwed1: bigint } | undefined, Error> {
  return useQuery({
    queryKey: ["usePositionFee", canisterId, positionId?.toString(), refresh],
    queryFn: async () => {
      if (!canisterId || (!positionId && positionId === BigInt(0))) return undefined;
      return await getPositionFee(canisterId, positionId!);
    },
    enabled: !!canisterId && positionId !== undefined,
  });
}

export async function getPositionsFee(canisterId: string, positionIds: bigint[]) {
  return resultFormat<{
    tokenIncome: Array<[bigint, { tokensOwed0: bigint; tokensOwed1: bigint }]>;
    totalTokensOwed0: bigint;
    totalTokensOwed1: bigint;
  }>(await (await swapPool(canisterId)).batchRefreshIncome(positionIds)).data;
}

export function usePositionsFee(
  canisterId: string | undefined,
  positionIds: bigint[] | undefined,
  refresh?: number | boolean,
): UseQueryResult<
  | {
      tokenIncome: Array<[bigint, { tokensOwed0: bigint; tokensOwed1: bigint }]>;
      totalTokensOwed0: bigint;
      totalTokensOwed1: bigint;
    }
  | undefined,
  Error
> {
  return useQuery({
    queryKey: ["usePositionsFee", canisterId, positionIds, refresh],
    queryFn: async () => {
      if (!canisterId || !positionIds || positionIds.length === 0) return undefined;
      return await getPositionsFee(canisterId, positionIds);
    },
    enabled: !!canisterId && !!positionIds && positionIds.length > 0,
  });
}

export type SwapPoolAllBalance = [Principal, { balance0: bigint; balance1: bigint }];

export async function getSwapPoolAllBalance(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<SwapPoolAllBalance>>(
    await (await swapPool(canisterId)).allTokenBalance(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useSwapPoolAllBalance(
  canisterId: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<SwapPoolAllBalance> | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPoolAllBalance", canisterId, offset, limit],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolAllBalance(canisterId, offset, limit);
    },
    enabled: !!canisterId,
  });
}

export async function _getSwapPoolAllBalance(poolId: string, limit = 1000) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapPoolAllBalance(poolId, offset, limit);
  };

  return await getPaginationAllData<SwapPoolAllBalance>(callback, limit);
}

export function _useSwapPoolAllBalance(
  canisterId: string | undefined,
  limit?: number,
): UseQueryResult<SwapPoolAllBalance[] | undefined, Error> {
  return useQuery({
    queryKey: ["_useSwapPoolAllBalance", canisterId, limit],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await _getSwapPoolAllBalance(canisterId, limit);
    },
    enabled: !!canisterId,
  });
}

/*   swap nft */

export async function getUserSwapNFTs(principal: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<NFTTokenMetadata>>(
    await (await swapNFT()).findTokenList({ principal: Principal.fromText(principal) }, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useUserSwapNFTs(
  principal: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<NFTTokenMetadata> | undefined, Error> {
  return useQuery({
    queryKey: ["useUserSwapNFTs", principal, offset, limit],
    queryFn: async () => {
      if (!principal || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserSwapNFTs(principal, offset, limit);
    },
    enabled: !!principal && isAvailablePageArgs(offset, limit),
  });
}

export function useUserAllNFTs(principal: string | undefined) {
  const callback = useCallback(
    async (offset: number, limit: number) => {
      if (!principal) return undefined;
      return await getUserSwapNFTs(principal, offset, limit);
    },
    [principal],
  );

  return usePaginationAllData<NFTTokenMetadata>(callback, 2000);
}

export async function getSwapNFTTokenURI(tokenId: bigint | number) {
  const data = resultFormat<string>(await (await swapNFT()).tokenURI(BigInt(tokenId))).data;
  return JSON.parse(data ?? "") as { image: string; [key: string]: any };
}

export function useSwapNFTTokenURI(
  tokenId: bigint | number | undefined,
): UseQueryResult<{ image: string; [key: string]: any } | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapNFTTokenURI", tokenId],
    queryFn: async () => {
      if (tokenId === undefined) return undefined;
      return await getSwapNFTTokenURI(tokenId);
    },
    enabled: tokenId !== undefined,
  });
}

export async function getPositionNFTId(poolId: string, positionId: string) {
  return resultFormat<number>(await (await swapNFT()).getTokenId(poolId, positionId)).data;
}

export function usePositionNFTId(
  poolId: string | undefined,
  positionId: string | undefined,
): UseQueryResult<number | undefined, Error> {
  return useQuery({
    queryKey: ["usePositionNFTId", poolId, positionId],
    queryFn: async () => {
      if (poolId === undefined || positionId === undefined) return undefined;

      return await getPositionNFTId(poolId, positionId);
    },
    enabled: poolId !== undefined && positionId !== undefined,
  });
}

/*   swap nft */

/*  swap records */

// Get the token amounts of each liquidity position
// Suggested limit is 40, if limit is beyond 40, maybe the backend will return error
export async function getSwapUserPositionWithAmount(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<UserPositionInfoWithTokenAmount>>(
    await (await swapPool(canisterId)).getUserPositionWithTokenAmount(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useSwapUserPositionWithAmount(
  canisterId: string | Null,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<UserPositionInfoWithTokenAmount> | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapUserPositionWithAmount", canisterId, offset, limit],
    queryFn: async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getSwapUserPositionWithAmount(canisterId, offset, limit);
    },
    enabled: !!canisterId && isAvailablePageArgs(offset, limit),
  });
}

export async function getSwapPositions(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<UserPositionInfoWithId>>(
    await (await swapPool(canisterId)).getUserPositions(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useSwapPositions(
  canisterId: string | Null,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<UserPositionInfoWithId> | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPositions", canisterId, offset, limit],
    queryFn: async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getSwapPositions(canisterId, offset, limit);
    },
    enabled: !!canisterId && isAvailablePageArgs(offset, limit),
  });
}

export async function getSwapAllUserPositions(poolId: string, limit = 2000) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapPositions(poolId, offset, limit);
  };

  return await getPaginationAllData<UserPositionInfoWithId>(callback, limit);
}

export function useSwapAllUserPositions(
  canisterId: string | undefined,
  limit?: number,
): UseQueryResult<UserPositionInfoWithId[] | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapAllUserPositions", canisterId, limit],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapAllUserPositions(canisterId, limit);
    },
    enabled: !!canisterId,
  });
}

export async function getSwapPoolPositions(canisterId: string, offset: number, limit: number) {
  return resultFormat<PaginationResult<PositionInfoWithId>>(
    await (await swapPool(canisterId)).getPositions(BigInt(offset), BigInt(limit)),
  ).data;
}

export function useSwapPoolPositions(
  canisterId: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<PaginationResult<PositionInfoWithId> | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPoolPositions", canisterId, offset, limit],
    queryFn: async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getSwapPoolPositions(canisterId, offset, limit);
    },
    enabled: !!canisterId && isAvailablePageArgs(offset, limit),
  });
}

export async function getSwapPoolAllPositions(poolId: string, limit = 1000) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapPoolPositions(poolId, offset, limit);
  };

  return await getPaginationAllData<PositionInfoWithId>(callback, limit);
}

export function useSwapPoolAllPositions(
  canisterId: string | undefined,
  limit?: number,
): UseQueryResult<PositionInfoWithId[] | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPoolAllPositions", canisterId, limit],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolAllPositions(canisterId, limit);
    },
    enabled: !!canisterId,
  });
}

export async function getSwapTicks(canisterId: string, offset: number, limit: number) {
  const result = await (await swapPool(canisterId)).getTicks(BigInt(offset), BigInt(limit));
  return resultFormat<PaginationResult<TickInfoWithId>>(result).data;
}

export async function getSwapAllTicks(canisterId: string, limit = 1000) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapTicks(canisterId, offset, limit);
  };

  return await getPaginationAllDataLimit<TickInfoWithId>(callback, limit);
}

export function useSwapAllTicks(
  canisterId: string | undefined,
  limit?: number,
): UseQueryResult<TickInfoWithId[] | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapAllTicks", canisterId, limit],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapAllTicks(canisterId, limit);
    },
    enabled: !!canisterId,
  });
}

export async function getSwapCyclesInfo(canisterId: string) {
  return resultFormat<{ balance: bigint; available: bigint }>(await (await swapPool(canisterId)).getCycleInfo()).data;
}

export function useSwapCyclesInfo(
  canisterId: string | undefined,
): UseQueryResult<{ balance: bigint; available: bigint } | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapCyclesInfo", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapCyclesInfo(canisterId);
    },
    enabled: !!canisterId,
  });
}

export async function getSwapTokenAmountState(canisterId: string) {
  return resultFormat<{
    swapFee0Repurchase: bigint;
    token0Amount: bigint;
    token1Amount: bigint;
    swapFee1Repurchase: bigint;
  }>(await (await swapPool(canisterId)).getTokenAmountState()).data;
}

export function useSwapTokenAmountState(canisterId: string | undefined): UseQueryResult<
  | {
      swapFee0Repurchase: bigint;
      token0Amount: bigint;
      token1Amount: bigint;
      swapFee1Repurchase: bigint;
    }
  | undefined,
  Error
> {
  return useQuery({
    queryKey: ["useSwapTokenAmountState", canisterId],
    queryFn: async () => {
      if (!canisterId) return undefined;
      return await getSwapTokenAmountState(canisterId);
    },
    enabled: !!canisterId,
  });
}

/*  swap records */

/* swap positions */
export async function updateUserPositionPoolId(poolId: string, identity?: ActorIdentity) {
  return resultFormat<undefined>(await (await swapPosition(identity)).addPoolId(poolId));
}

export async function getUserPositionsPools(account: string) {
  return resultFormat<string[]>(await (await swapPosition()).getUserPools(account)).data;
}

export function useUserPositionPools(account: string | undefined | null): UseQueryResult<string[] | undefined, Error> {
  return useQuery({
    queryKey: ["useUserPositionPools", account],
    queryFn: async () => {
      if (!account) return undefined;
      return await getUserPositionsPools(account);
    },
    enabled: !!account,
  });
}

export async function getSwapUserPositions(poolId: string, principal: string) {
  return resultFormat<UserPositionInfoWithId[]>(
    await (await swapPool(poolId)).getUserPositionsByPrincipal(Principal.fromText(principal)),
  ).data;
}

export function useSwapUserPositions(
  poolId: string | Null,
  principal: string | Null,
  refresh?: boolean | number,
): UseQueryResult<UserPositionInfoWithId[] | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapUserPositions", poolId, principal, refresh],
    queryFn: async () => {
      if (!principal || !poolId) return undefined;
      return await getSwapUserPositions(poolId, principal);
    },
    enabled: !!principal && !!poolId,
  });
}

export async function approvePosition(poolId: string, spender: string, index: number | bigint) {
  return resultFormat<boolean>(
    await (await swapPool(poolId, true)).approvePosition(Principal.fromText(spender), BigInt(index)),
  );
}

export async function getSwapPositionOwner(poolId: string, positionIndex: number | bigint) {
  return resultFormat<string>(await (await swapPool(poolId)).getUserByPositionId(BigInt(positionIndex))).data;
}

export function useSwapPositionOwner(
  poolId: string | undefined,
  positionIndex: number | bigint | undefined,
  refresh?: number,
): UseQueryResult<string | undefined, Error> {
  return useQuery({
    queryKey: ["useSwapPositionOwner", poolId, positionIndex, refresh],
    queryFn: async () => {
      if (!poolId || positionIndex === undefined) return undefined;
      return await getSwapPositionOwner(poolId, positionIndex);
    },
    enabled: !!poolId && positionIndex !== undefined,
  });
}

/* swap positions */
