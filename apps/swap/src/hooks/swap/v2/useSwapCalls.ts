import { useCallback, useEffect, useMemo, useState } from "react";
import {
  swapPositionManager,
  swapPositionManagerV1,
  swapFactory,
  swapRouter,
  swapRecord,
  swapPool,
  swapGraphPool,
} from "actor/swapV2";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";
import { FeeAmount } from "@icpswap/swap-sdk";
import { useStateCallsData } from "hooks/useCallsData";
import { useAccount } from "store/global/hooks";
import {
  PoolInfo,
  PositionResult,
  IncreaseLiquidityParams,
  DecreaseLiquidityParams,
  IncreaseLiquidityResult,
  DecreaseLiquidityResult,
  PoolKey,
  TVLResult,
  MintResult,
  TickLiquidityInfo,
  SwapRecordInfo,
  CollectResult,
  CollectParams,
  VolumeResult,
  SwapPoolRecord,
} from "types/swapv2";
import { Identity, PaginationResult } from "types/global";
import { Principal } from "@dfinity/principal";
import { TOKEN_STANDARD } from "constants/tokens";

export async function getPoolList(): Promise<PoolInfo[]> {
  return await (await swapFactory()).getPoolList();
}

export async function getPoolIds(): Promise<string[]> {
  return await (await swapFactory()).getPoolIds();
}

export async function getPoolTokenStandard(poolId: string, tokenId: string): Promise<TOKEN_STANDARD> {
  return (await (await swapPool(poolId)).getStandard(tokenId)) as TOKEN_STANDARD;
}

export async function getPoolInfoWithNoBalance(poolId: string): Promise<PoolInfo> {
  return await (await swapPool(poolId)).infoWithNoBalance();
}

export function usePoolIds() {
  const call = useCallback(async () => {
    return (await getPoolIds()) as string[];
  }, []);

  return useStateCallsData(call, "usePoolIds", true, false, true);
}

export function usePoolList() {
  const { result: poolIds, loading: poolIdsLoading } = usePoolIds();

  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pools: PoolInfo[] = [];
    let errorNum = 0;

    function trigger() {
      if (poolIds && pools.length === poolIds.length - errorNum) {
        setPools(pools);
        setLoading(false);
      }
    }

    const fetch = async (poolId: string) => {
      let pool = await getPoolInfoWithNoBalance(poolId).catch((err) => {
        console.log(err);
        return null;
      });

      if (!pool) {
        errorNum++;
      } else {
        pools.push(pool);
      }

      trigger();
    };

    if (poolIds && poolIds.length > 0) {
      setLoading(true);
      for (let i = 0; i < poolIds.length; i++) {
        fetch(poolIds[i]);
      }
    }
  }, [poolIds]);

  return useMemo(() => ({ loading: poolIdsLoading || loading, pools }), [loading, pools]);
}

export function usePosition(positionId: string | number | bigint, invalid?: boolean) {
  return useCallsData(
    useCallback(async () => {
      let result = undefined;

      if (!!invalid) {
        result = resultFormat<PositionResult>(
          await (await swapPositionManager()).invalidPositions(BigInt(positionId)),
        ).data;
      } else {
        result = resultFormat<PositionResult>(await (await swapPositionManager()).positions(BigInt(positionId))).data;
      }

      return result;
    }, [positionId]),
  );
}

export async function increaseLiquidity(identity: Identity, params: IncreaseLiquidityParams) {
  return resultFormat<IncreaseLiquidityResult>(await (await swapPositionManager(identity)).increaseLiquidity(params));
}

export async function decreaseLiquidity(identity: Identity, params: DecreaseLiquidityParams) {
  return resultFormat<DecreaseLiquidityResult>(await (await swapPositionManager(identity)).decreaseLiquidity(params));
}

export function useQuoteExactInput(args: string | undefined) {
  const call = useCallback(async () => {
    const { path, amountIn } = JSON.parse(args!) as { path: string; amountIn: string };
    return resultFormat<bigint>(await (await swapRouter()).quoteExactInput(path, amountIn)).data;
  }, [args]);

  return useStateCallsData(call, "quoteExactInputV2", !!args);
}

export function useQuoteUnitPrice(path: string | undefined, amountIn: string | number | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!path || !amountIn || amountIn === "0") return undefined;
      return resultFormat<bigint>(await (await swapRouter()).getUnitPrice(path!, String(amountIn!))).data;
    }, [path, amountIn]),
  );
}

export function useQuoteExactOutput(path: string | undefined, amountOut: string | undefined) {
  const call = useCallback(async () => {
    return resultFormat<bigint>(await (await swapRouter()).quoteExactOutput(path!, String(amountOut!))).data;
  }, [path, amountOut]);

  return useStateCallsData(call, "quoteExactOutputV2", !!path && !!amountOut);
}

export async function exactInputSingle(
  identity: Identity,
  path: string,
  recipient: Principal,
  deadline: bigint | number,
  amountIn: string,
  amountOutMinimum: string,
) {
  return resultFormat<bigint>(
    await (await swapRouter(identity)).exactInput(path, recipient, BigInt(deadline), amountIn, amountOutMinimum),
  );
}

export async function exactOutputSingle(
  identity: Identity,
  path: string,
  recipient: Principal,
  deadline: bigint | number,
  amountOut: string,
  amountInMinimum: string,
) {
  return resultFormat<bigint>(
    await (await swapRouter(identity)).exactOutput(path, recipient, BigInt(deadline), amountOut, amountInMinimum),
  );
}

export function useFeeAmount(feeAmountKeys: (PoolKey | null)[]) {
  return useCallsData(
    useCallback(async () => {
      if (!feeAmountKeys || feeAmountKeys.length === 0 || feeAmountKeys.includes(null)) return undefined;
      return resultFormat<TVLResult[]>(await (await swapPositionManager()).getPoolTVL(feeAmountKeys as PoolKey[])).data;
    }, [feeAmountKeys]),
  );
}

export async function mint(
  identity: Identity,
  token0: string,
  token1: string,
  fee: bigint,
  tickLower: bigint,
  tickUpper: bigint,
  amount0Desired: string,
  amount1Desired: string,
  amount0Min: string,
  amount1Min: string,
  recipient: Principal,
  deadline: bigint,
) {
  return resultFormat<MintResult>(
    await (
      await swapPositionManager(identity)
    ).mint({
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      amount0Desired,
      amount1Desired,
      amount0Min,
      amount1Min,
      recipient,
      deadline,
    }),
  );
}

export function useUserTokens() {
  const account = useAccount();

  return useCallsData(
    useCallback(async () => {
      if (!account) return [];
      return resultFormat<bigint[]>(await (await swapPositionManager()).ownerTokens(account)).data;
    }, [account]),
  );
}

export function useUserV1Tokens() {
  const account = useAccount();

  return useCallsData(
    useCallback(async () => {
      if (!account) return [];
      return resultFormat<bigint[]>(await (await swapPositionManagerV1()).ownerTokens(account)).data;
    }, [account]),
  );
}

export function useUserInvalidTokens() {
  const account = useAccount();

  return useCallsData(
    useCallback(async () => {
      return resultFormat<bigint[]>(await (await swapPositionManager()).ownerInvalidTokens(account)).data;
    }, [account]),
  );
}

export async function getPoolCanisterId(token0CanisterId: string, token1CanisterId: string, fee: FeeAmount) {
  return await (await swapFactory()).getPool(`${token0CanisterId}_${token1CanisterId}_${String(fee)}`);
}

export function usePoolCanisterId(
  token0CanisterId: string | undefined | null,
  token1CanisterId: string | undefined | null,
  fee: FeeAmount | undefined | null,
) {
  return useCallsData(
    useCallback(async () => {
      if (!token0CanisterId || !token1CanisterId || !fee) return undefined;
      return resultFormat<string>(await getPoolCanisterId(token0CanisterId, token1CanisterId, fee)).data;
    }, [token0CanisterId, token1CanisterId, fee]),
  );
}

export function useLiquidityTicks(poolId: string | undefined | null) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return resultFormat<TickLiquidityInfo[]>(await (await swapPool(poolId!)).getTickInfos()).data;
    }, [poolId]),
  );
}

export function useSwapRecord(account: string, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!account || !isAvailablePageArgs(offset, limit)) return undefined;
      return resultFormat<PaginationResult<SwapRecordInfo>>(
        await (await swapRecord()).get(account, BigInt(offset), BigInt(limit)),
      ).data;
    }, [account, offset, limit]),
  );
}

export function useCollectFeesCall(invalid: boolean) {
  return useCallback(
    async (identity: Identity, params: CollectParams) => {
      if (invalid) {
        return resultFormat<CollectResult>(
          await (await swapPositionManager(identity)).collectInInvalidPosition(params),
        );
      }

      return resultFormat<CollectResult>(await (await swapPositionManager(identity)).collect(params));
    },
    [invalid],
  );
}

export function usePoolTotalVolumeCall(poolKey: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!poolKey) return undefined;
      return resultFormat<VolumeResult>(await (await swapPositionManager()).getTotalVolume(poolKey!)).data;
    }, [poolKey]),
  );
}

export function usePositionFeesCall(
  positionId: bigint | string | number | undefined,
  invalid: boolean,
  reload?: boolean,
) {
  return useCallsData(
    useCallback(async () => {
      if (!positionId) return undefined;

      let result = undefined;

      if (invalid) {
        result = resultFormat<CollectResult>(
          await (await swapPositionManager()).refreshInvalidIncome(BigInt(positionId!)),
        ).data;
      } else {
        result = resultFormat<CollectResult>(
          await (await swapPositionManager()).refreshIncome(BigInt(positionId!)),
        ).data;
      }

      return result;
    }, [positionId, invalid]),
    reload,
  );
}

export async function getV2SwapNFTTokenURI(tokenId: bigint | number) {
  const result = resultFormat<string>(await (await swapPositionManager()).tokenURI(BigInt(tokenId))).data;
  const data = JSON.parse(result ?? '""') as { image: string } | "";

  return !!data ? data.image : "";
}

export function useFourListedPools() {
  return useCallsData(
    useCallback(async () => {
      return resultFormat<SwapPoolRecord[]>(await (await swapGraphPool()).getAllPools([])).data;
    }, []),
  );
}

export async function decreaseInvalidLiquidity(identity: Identity, params: DecreaseLiquidityParams) {
  return resultFormat<DecreaseLiquidityResult>(
    await (await swapPositionManager(identity)).decreaseLiquidityInInvalidPosition(params),
  );
}

export async function decreaseV1Liquidity(identity: Identity, params: DecreaseLiquidityParams) {
  return resultFormat<DecreaseLiquidityResult>(await (await swapPositionManagerV1(identity)).decreaseLiquidity(params));
}
