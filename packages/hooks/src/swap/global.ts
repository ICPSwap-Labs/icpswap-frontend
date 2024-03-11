import { useCallback } from "react";
import { swapFactory, swapPool, swapNFT, swapPosition } from "@icpswap/actor";
import type {
  SwapPoolData,
  TickLiquidityInfo,
  PoolMetadata,
  GetPoolArgs,
  CreatePoolArgs,
  MintArgs,
  UserPositionInfo,
  DecreaseLiquidityArgs,
  IncreaseLiquidityArgs,
  SwapArgs,
  ClaimArgs,
  NFTTokenMetadata,
  UserPositionInfoWithTokenAmount,
  UserPositionInfoWithId,
  PositionInfoWithId,
  TickInfoWithId,
} from "@icpswap/types";
import {
  useCallsData,
  getPaginationAllData,
  usePaginationAllData,
} from "../useCallData";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import type { ActorIdentity, PaginationResult } from "@icpswap/types";
import { Principal } from "@dfinity/principal";

export async function createSwapPool(
  identity: ActorIdentity,
  args: CreatePoolArgs
) {
  return resultFormat<SwapPoolData>(
    await (await swapFactory(identity)).createPool(args)
  );
}

export async function getSwapPool(args: GetPoolArgs) {
  return resultFormat<SwapPoolData>(await (await swapFactory()).getPool(args))
    .data;
}

export function useSwapPool(args: GetPoolArgs | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!args) return undefined;
      return await getSwapPool(args);
    }, [args])
  );
}

export async function getSwapPools() {
  return resultFormat<SwapPoolData[]>(await (await swapFactory()).getPools())
    .data;
}

export function useSwapPools() {
  return useCallsData(
    useCallback(async () => {
      return await getSwapPools();
    }, [])
  );
}

export async function getSwapPoolMetadata(canisterId: string) {
  return resultFormat<PoolMetadata>(
    await (await swapPool(canisterId)).metadata()
  ).data;
}

export function useSwapPoolMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolMetadata(canisterId!);
    }, [canisterId])
  );
}

export async function getSwapPoolTicks(
  canisterId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<TickLiquidityInfo>>(
    await (
      await swapPool(canisterId)
    ).getTickInfos(BigInt(offset), BigInt(limit))
  ).data;
}

export async function getSwapPoolAllTicks(poolId: string, limit: number = 500) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapPoolTicks(poolId, offset, limit);
  };

  return await getPaginationAllData<TickLiquidityInfo>(callback, limit);
}

export function useLiquidityTicks(
  canisterId: string | undefined,
  limit?: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolAllTicks(canisterId!, limit);
    }, [canisterId, limit])
  );
}

export async function deposit(
  identity: ActorIdentity,
  canisterId: string,
  token: string,
  amount: bigint,
  fee: bigint
) {
  return resultFormat<bigint>(
    await (await swapPool(canisterId, identity)).deposit({ token, amount, fee })
  );
}

export async function depositFrom(
  identity: ActorIdentity,
  canisterId: string,
  token: string,
  amount: bigint,
  fee: bigint
) {
  return resultFormat<bigint>(
    await (
      await swapPool(canisterId, identity)
    ).depositFrom({ token, amount, fee })
  );
}

export async function mint(
  canisterId: string,
  identity: ActorIdentity,
  args: MintArgs
) {
  return resultFormat<bigint>(
    await (await swapPool(canisterId, identity)).mint(args)
  );
}

export async function increaseLiquidity(
  identity: ActorIdentity,
  poolId: string,
  args: IncreaseLiquidityArgs
) {
  return resultFormat<bigint>(
    await (await swapPool(poolId, identity)).increaseLiquidity(args)
  );
}

export async function decreaseLiquidity(
  identity: ActorIdentity,
  poolId: string,
  args: DecreaseLiquidityArgs
) {
  return resultFormat<{ amount0: bigint; amount1: bigint }>(
    await (await swapPool(poolId, identity)).decreaseLiquidity(args)
  );
}

export async function withdraw(
  identity: ActorIdentity,
  poolId: string,
  token: string,
  fee: bigint,
  amount: bigint
) {
  return resultFormat<bigint>(
    await (await swapPool(poolId, identity)).withdraw({ token, fee, amount })
  );
}

export async function quote(poolId: string, args: SwapArgs) {
  return resultFormat<bigint>(await (await swapPool(poolId)).quote(args)).data;
}

export async function swap(
  poolId: string,
  identity: ActorIdentity,
  args: SwapArgs
) {
  return resultFormat<bigint>(
    await (await swapPool(poolId, identity)).swap(args)
  );
}

export async function collect(
  poolId: string,
  identity: ActorIdentity,
  args: ClaimArgs
) {
  return resultFormat<{ amount0: bigint; amount1: bigint }>(
    await (await swapPool(poolId, identity)).claim(args)
  );
}

export async function getUserUnusedBalance(
  canisterId: string,
  user: Principal
) {
  return resultFormat<{ balance0: bigint; balance1: bigint }>(
    await (await swapPool(canisterId)).getUserUnusedBalance(user)
  ).data;
}

export function useUserUnusedBalance(
  canisterId: string | undefined,
  user: Principal | undefined
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !user) return undefined;
      return await getUserUnusedBalance(canisterId!, user!);
    }, [canisterId, user])
  );
}

export async function getSwapPosition(canisterId: string, tokenId: bigint) {
  return resultFormat<UserPositionInfo>(
    await (await swapPool(canisterId)).getUserPosition(tokenId)
  ).data;
}

export function useSwapPosition(
  canisterId: string | undefined,
  positionId: bigint | undefined
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || (!positionId && positionId !== BigInt(0)))
        return undefined;
      return await getSwapPosition(canisterId!, positionId!);
    }, [canisterId, positionId])
  );
}

export async function getPositionFee(canisterId: string, positionId: bigint) {
  return resultFormat<{ tokensOwed0: bigint; tokensOwed1: bigint }>(
    await (await swapPool(canisterId)).refreshIncome(positionId)
  ).data;
}

export function usePositionFee(
  canisterId: string | undefined,
  positionId: bigint | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || (!positionId && positionId === BigInt(0)))
        return undefined;
      return await getPositionFee(canisterId, positionId!);
    }, [canisterId, positionId]),
    reload
  );
}

export type SwapPoolAllBalance = [
  Principal,
  { balance0: bigint; balance1: bigint },
];

export async function getSwapPoolAllBalance(
  canisterId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<SwapPoolAllBalance>>(
    await (
      await swapPool(canisterId)
    ).allTokenBalance(BigInt(offset), BigInt(limit))
  ).data;
}

export function useSwapPoolAllBalance(
  canisterId: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolAllBalance(canisterId!, offset, limit);
    }, [canisterId, offset, limit])
  );
}

export async function _getSwapPoolAllBalance(
  poolId: string,
  limit: number = 1000
) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapPoolAllBalance(poolId, offset, limit);
  };

  return await getPaginationAllData<SwapPoolAllBalance>(callback, limit);
}

export function _useSwapPoolAllBalance(
  canisterId: string | undefined,
  limit?: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await _getSwapPoolAllBalance(canisterId!, limit);
    }, [canisterId, limit])
  );
}

/*   swap nft */

export async function getUserSwapNFTs(
  principal: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<NFTTokenMetadata>>(
    await (
      await swapNFT()
    ).findTokenList(
      { principal: Principal.fromText(principal) },
      BigInt(offset),
      BigInt(limit)
    )
  ).data;
}

export function useUserSwapNFTs(
  principal: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!principal || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getUserSwapNFTs(principal!, offset, limit);
    }, [principal, offset, limit])
  );
}

export function useUserAllNFTs(principal: string | undefined) {
  const callback = useCallback(
    async (offset: number, limit: number) => {
      if (!principal) return undefined;
      return await getUserSwapNFTs(principal, offset, limit);
    },
    [principal]
  );

  return usePaginationAllData<NFTTokenMetadata>(callback, 2000);
}

export async function getSwapNFTTokenURI(tokenId: bigint | number) {
  const data = resultFormat<string>(
    await (await swapNFT()).tokenURI(BigInt(tokenId))
  ).data;
  return JSON.parse(data ?? "") as { image: string; [key: string]: any };
}

export function useSwapNFTTokenURI(tokenId: bigint | number | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (tokenId === undefined) return undefined;
      return await getSwapNFTTokenURI(tokenId!);
    }, [tokenId])
  );
}

export async function getPositionNFTId(poolId: string, positionId: string) {
  return resultFormat<number>(
    await (await swapNFT()).getTokenId(poolId, positionId)
  ).data;
}

export function usePositionNFTId(
  poolId: string | undefined,
  positionId: string | undefined
) {
  return useCallsData(
    useCallback(async () => {
      if (poolId === undefined || positionId === undefined) return undefined;

      return await getPositionNFTId(poolId, positionId);
    }, [poolId, positionId])
  );
}

/*   swap nft */

/*  swap records */

export async function getSwapUserPositionWithAmount(
  canisterId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<UserPositionInfoWithTokenAmount>>(
    await (
      await swapPool(canisterId)
    ).getUserPositionWithTokenAmount(BigInt(offset), BigInt(limit))
  ).data;
}

export function useSwapUserPositionWithAmount(
  canisterId: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getSwapUserPositionWithAmount(canisterId!, offset, limit);
    }, [canisterId, offset, limit])
  );
}

export async function _getSwapUserPositionsWithAmount(
  poolId: string,
  limit: number = 1000
) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapUserPositionWithAmount(poolId, offset, limit);
  };

  return await getPaginationAllData<UserPositionInfoWithTokenAmount>(
    callback,
    limit
  );
}

export function _useSwapUserPositionsWithAmount(
  canisterId: string | undefined,
  limit?: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await _getSwapUserPositionsWithAmount(canisterId, limit);
    }, [canisterId, limit])
  );
}

export async function getSwapPositions(
  canisterId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<UserPositionInfoWithId>>(
    await (
      await swapPool(canisterId)
    ).getUserPositions(BigInt(offset), BigInt(limit))
  ).data;
}

export function useSwapPositions(
  canisterId: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getSwapPositions(canisterId!, offset, limit);
    }, [canisterId, offset, limit])
  );
}

export async function getSwapAllUserPositions(
  poolId: string,
  limit: number = 2000
) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapPositions(poolId, offset, limit);
  };

  return await getPaginationAllData<UserPositionInfoWithId>(callback, limit);
}

export function useSwapAllUserPositions(
  canisterId: string | undefined,
  limit?: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapAllUserPositions(canisterId!, limit);
    }, [canisterId, limit])
  );
}

export async function getSwapPoolPositions(
  canisterId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<PositionInfoWithId>>(
    await (
      await swapPool(canisterId)
    ).getPositions(BigInt(offset), BigInt(limit))
  ).data;
}

export function useSwapPoolPositions(
  canisterId: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getSwapPoolPositions(canisterId!, offset, limit);
    }, [canisterId, offset, limit])
  );
}

export async function getSwapPoolAllPositions(
  poolId: string,
  limit: number = 1000
) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapPoolPositions(poolId, offset, limit);
  };

  return await getPaginationAllData<PositionInfoWithId>(callback, limit);
}

export function useSwapPoolAllPositions(
  canisterId: string | undefined,
  limit?: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapPoolAllPositions(canisterId!, limit);
    }, [canisterId, limit])
  );
}

export async function getSwapTicks(
  canisterId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<TickInfoWithId>>(
    await (await swapPool(canisterId)).getTicks(BigInt(offset), BigInt(limit))
  ).data;
}

export async function getSwapAllTicks(
  canisterId: string,
  limit: number = 1000
) {
  const callback = async (offset: number, limit: number) => {
    return await getSwapTicks(canisterId, offset, limit);
  };

  return await getPaginationAllData<TickInfoWithId>(callback, limit);
}

export function useSwapAllTicks(
  canisterId: string | undefined,
  limit?: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapAllTicks(canisterId!, limit);
    }, [canisterId, limit])
  );
}

export async function getSwapCyclesInfo(canisterId: string) {
  return resultFormat<{ balance: bigint; available: bigint }>(
    await (await swapPool(canisterId)).getCycleInfo()
  ).data;
}

export function useSwapCyclesInfo(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapCyclesInfo(canisterId!);
    }, [canisterId])
  );
}

export async function getSwapTokenAmountState(canisterId: string) {
  return resultFormat<{
    swapFee0Repurchase: bigint;
    token0Amount: bigint;
    token1Amount: bigint;
    swapFee1Repurchase: bigint;
  }>(await (await swapPool(canisterId!)).getTokenAmountState()).data;
}

export function useSwapTokenAmountState(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapTokenAmountState(canisterId!);
    }, [canisterId])
  );
}

/*  swap records */

/* swap positions */
export async function updateUserPositionPoolId(
  poolId: string,
  identity?: ActorIdentity
) {
  return resultFormat<undefined>(
    await (await swapPosition(identity)).addPoolId(poolId)
  );
}

export async function getUserPositionsPools(account: string) {
  return resultFormat<string[]>(
    await (await swapPosition()).getUserPools(account)
  ).data;
}

export function useUserPositionPools(account: string | undefined | null) {
  return useCallsData(
    useCallback(async () => {
      if (!account) return undefined;
      return await getUserPositionsPools(account!);
    }, [account])
  );
}

export async function getSwapUserPositions(poolId: string, principal: string) {
  return resultFormat<UserPositionInfoWithId[]>(
    await (
      await swapPool(poolId)
    ).getUserPositionsByPrincipal(Principal.fromText(principal))
  ).data;
}

export function useSwapUserPositions(
  poolId: string | undefined,
  principal: string | undefined
) {
  return useCallsData(
    useCallback(async () => {
      if (!principal || !poolId) return undefined;
      return await getSwapUserPositions(poolId, principal);
    }, [principal, poolId])
  );
}

export async function approvePosition(
  identity: ActorIdentity,
  poolId: string,
  spender: string,
  index: number | bigint
) {
  return resultFormat<boolean>(
    await (
      await swapPool(poolId, identity)
    ).approvePosition(Principal.fromText(spender), BigInt(index))
  );
}

export async function getSwapPositionOwner(
  poolId: string,
  positionIndex: number | bigint
) {
  return resultFormat<string>(
    await (await swapPool(poolId)).getUserByPositionId(BigInt(positionIndex))
  ).data;
}

export function useSwapPositionOwner(
  poolId: string | undefined,
  positionIndex: number | bigint | undefined
) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId || positionIndex === undefined) return undefined;
      return await getSwapPositionOwner(poolId, positionIndex);
    }, [positionIndex, poolId])
  );
}

/* swap positions */
