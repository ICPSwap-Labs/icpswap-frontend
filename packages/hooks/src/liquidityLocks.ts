import { useCallback, useEffect, useMemo, useState } from "react";
import { liquidityLocks } from "@icpswap/actor";
import { Principal } from "@dfinity/principal";
import { resultFormat } from "@icpswap/utils";
import { Pool, Position } from "@icpswap/swap-sdk";
import { Null, type UserPositionInfoWithId } from "@icpswap/types";

import { useCallsData } from "./useCallData";
import { useMultiPositionInfos, useMultiPositionInfosByIds } from "./swap/useMultiPositionInfos";
import { getSinglePoolMultiPositions } from "./swap/useSinglePoolMultiPositions";

export function useLiquidityLockIds(tokenIds: string[] | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenIds) return undefined;

      return resultFormat<
        Array<{
          is_public: boolean;
          alias: [] | [string];
          governance_id: [] | [Principal];
          ledger_id: Principal;
        }>
      >(
        await (
          await liquidityLocks()
        ).getPrincipalAliasByLedgers(tokenIds.map((tokenId) => Principal.fromText(tokenId))),
      ).data;
    }, [tokenIds]),
  );
}

export function useExtraBlackHoleLiquidityLocks(pool: Pool | Null): Position[] | Null {
  const poolId = pool?.id;

  const positionIds: bigint[] | undefined = useMemo(() => {
    if (!poolId) return undefined;
    if (poolId === "wlv64-biaaa-aaaag-qcrlq-cai") return [24, 20, 1].map((e) => BigInt(e));
    return undefined;
  }, [poolId]);

  const { result: positions } = useMultiPositionInfosByIds(poolId, positionIds);

  const multiPositions = useMemo(() => {
    if (!positions || !pool) return null;

    return getSinglePoolMultiPositions({
      pool,
      positionInfos: positions.map((e) => ({
        tickUpper: e.tickUpper,
        tickLower: e.tickLower,
        liquidity: e.liquidity,
      })),
    });
  }, [positions, pool]);

  return useMemo(() => multiPositions, [multiPositions]);
}

export function useExtraBlackHolePositionInfos(poolId: string | Null) {
  const positionIds: bigint[] | undefined = useMemo(() => {
    if (!poolId) return undefined;
    if (poolId === "wlv64-biaaa-aaaag-qcrlq-cai") return [24, 20, 1].map((e) => BigInt(e));
    return undefined;
  }, [poolId]);

  const { result: positions } = useMultiPositionInfosByIds(poolId, positionIds);

  return useMemo(() => {
    if (!positions) return null;

    return positions.map((e, index) => (e ? ({ ...e, id: positionIds[index] } as UserPositionInfoWithId) : null));
  }, [positions]);
}

export function useAllLiquidityLocks(
  tokenIds: string[] | undefined,
  poolId: string | undefined,
  pool: Pool | undefined | null,
): {
  loading: boolean;
  result: [Position[], string, string][] | null;
} {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<null | Array<[UserPositionInfoWithId[], string, string]>>(null);

  const { result: lockIds } = useLiquidityLockIds(tokenIds);

  const ledgerIds = useMemo(() => {
    if (!lockIds) return undefined;
    return lockIds.map(({ governance_id, ledger_id, alias }) => {
      if (alias[0] && alias[0].includes("Governance")) return governance_id[0]?.toString();
      return ledger_id.toString();
    });
  }, [lockIds]);

  const { result: positionInfos } = useMultiPositionInfos(poolId, ledgerIds);

  useEffect(() => {
    if (poolId) {
      setLoading(true);
    }
  }, [poolId]);

  useEffect(() => {
    async function call() {
      if (positionInfos && lockIds) {
        setLoading(true);

        const result = positionInfos
          .map((positionInfos, index) => {
            const alias = lockIds[index].alias[0];

            if (!alias) return undefined;

            return [positionInfos, ledgerIds[index], alias] as [UserPositionInfoWithId[], string, string];
          })
          .filter((e) => !!e) as [UserPositionInfoWithId[], string, string][];

        setResult(
          result.reduce(
            (prev, curr) => {
              const index = prev.findIndex(([, , name]) => name === curr[2]);

              if (index !== -1) {
                const __prev = [...prev];
                const concatValue = [__prev[index][0].concat(curr[0]), curr[1], curr[2]] as [
                  UserPositionInfoWithId[],
                  string,
                  string,
                ];
                __prev.splice(index, 1, concatValue);
                return __prev;
              }

              return prev.concat([curr]);
            },
            [] as Array<[UserPositionInfoWithId[], string, string]>,
          ),
        );
        setLoading(false);
      }

      if (lockIds && lockIds.length === 0) {
        setLoading(false);
      }
    }

    call();
  }, [positionInfos, lockIds, ledgerIds]);

  const extraBlackHolePositions = useExtraBlackHoleLiquidityLocks(pool);

  const multiPositions = useMemo(() => {
    if (!result || !pool) return null;

    return result.map(([positionInfos, principalId, name]) => [
      getSinglePoolMultiPositions({
        pool,
        positionInfos: positionInfos.map((e) => ({
          tickUpper: e.tickUpper,
          tickLower: e.tickLower,
          liquidity: e.liquidity,
        })),
      }),
      principalId,
      name,
    ]) as Array<[Position[], string, string]>;
  }, [result, pool]);

  const allPositions: Array<[Position[], string, string]> | null = useMemo(() => {
    if (!multiPositions) return null;

    return multiPositions.map(([positions, principalId, name]) => {
      if (name === "Black Hole") {
        return [(positions ?? []).concat(extraBlackHolePositions ?? []), principalId, name];
      }

      return [positions, principalId, name];
    }) as Array<[Position[], string, string]>;
  }, [multiPositions, extraBlackHolePositions]);

  return useMemo(
    () => ({
      loading,
      result: allPositions,
    }),
    [allPositions, loading],
  );
}
