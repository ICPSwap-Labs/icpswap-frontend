import { useCallback, useEffect, useMemo, useState } from "react";
import { liquidityLocks } from "@icpswap/actor";
import { Principal } from "@dfinity/principal";
import { resultFormat } from "@icpswap/utils";
import { Pool, Position } from "@icpswap/swap-sdk";
import { type UserPositionInfoWithId } from "@icpswap/types";

import { useCallsData } from "./useCallData";
import { useMultiPositionInfos } from "./swap/useMultiPositionInfos";
import { getSinglePoolMultiPositions } from "./swap/useSinglePoolMultiPositions";

export function useLiquidityLockIds(tokenIds: string[] | undefined) {
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

  const governanceIds = useMemo(() => {
    if (!lockIds) return undefined;

    return lockIds.map(({ governance_id, ledger_id, alias }) => {
      if (alias[0] && alias[0].includes("Governance")) return governance_id[0]?.toString();
      return ledger_id.toString();
    });
  }, [lockIds]);

  const { result: positionInfos } = useMultiPositionInfos(poolId, governanceIds);

  useEffect(() => {
    async function call() {
      if (positionInfos && lockIds) {
        setLoading(true);

        const result = positionInfos
          .map((positionInfos, index) => {
            const alias = lockIds[index].alias[0];

            if (!alias) return undefined;

            return [positionInfos, lockIds[index].governance_id.toString(), alias] as [
              UserPositionInfoWithId[],
              string,
              string,
            ];
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
  }, [positionInfos]);

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

  return useMemo(
    () => ({
      loading,
      result: multiPositions,
    }),
    [multiPositions, loading],
  );
}
