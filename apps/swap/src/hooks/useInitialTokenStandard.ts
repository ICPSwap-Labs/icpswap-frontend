import { useEffect, useState, useMemo } from "react";
import { XTC, TOKEN_STANDARD, CAT, MOD, BoomDAO } from "constants/tokens";
import { ckSepoliaUSDC, ckSepoliaETH, ICP, WRAPPED_ICP } from "@icpswap/tokens";
import { getSwapPools } from "@icpswap/hooks";
import type { SwapPoolData } from "@icpswap/types";
import { registerTokens } from "@icpswap/token-adapter";
import { network, NETWORK } from "constants/server";
import { useUpdateTokenStandard, useTokenStandards } from "store/token/cache/hooks";
import { usePoolCanisterIdManager, useUpdateAllSwapPools } from "store/swap/hooks";
import { updateCanisters } from "store/allCanisters";
import { updateTokens } from "store/allTokens";

export const Tokens = [XTC, CAT, MOD, BoomDAO, ckSepoliaUSDC, ckSepoliaETH];

export function useInitialTokenStandard() {
  const [updated, setUpdated] = useState(false);

  const [AllPools, setAllPools] = useState<SwapPoolData[] | undefined>(undefined);

  const updateTokenStandard = useUpdateTokenStandard();
  const updateAllSwapPools = useUpdateAllSwapPools();
  const [, updatePoolCanisterId] = usePoolCanisterIdManager();

  useEffect(() => {
    if (network === NETWORK.IC) {
      Promise.all([getSwapPools()]).then(([allSwapPools]) => {
        const allTokenStandards: { [canisterId: string]: TOKEN_STANDARD } = {};

        const pushStandard = (canisterId: string, standard: TOKEN_STANDARD) => {
          if (allTokenStandards[canisterId]) {
            if (allTokenStandards[canisterId] === TOKEN_STANDARD.ICRC1 && standard === TOKEN_STANDARD.ICRC2) {
              allTokenStandards[canisterId] = TOKEN_STANDARD.ICRC2;
            }
          } else {
            allTokenStandards[canisterId] = standard;
          }
        };

        allSwapPools?.forEach((pool) => {
          pushStandard(pool.token0.address, pool.token0.standard as TOKEN_STANDARD);

          pushStandard(pool.token1.address, pool.token1.standard as TOKEN_STANDARD);

          setAllPools(allSwapPools);

          updatePoolCanisterId({ key: pool.key, id: pool.canisterId.toString() });
        });

        const __allTokenStandards = Object.keys(allTokenStandards).map((canisterId) => ({
          canisterId,
          standard: allTokenStandards[canisterId],
        }));

        registerTokens(__allTokenStandards);
        updateTokenStandard(__allTokenStandards);
        updateAllSwapPools(allSwapPools);

        const allCanisterIds = [
          ...(allSwapPools?.map((ele) => [ele.canisterId.toString(), ele.token0.address, ele.token1.address]) ?? []),
        ].reduce((prev, curr) => {
          return prev.concat(curr);
        }, [] as string[]);

        updateCanisters(allCanisterIds);
        updateTokens(Object.keys(allTokenStandards));

        setUpdated(true);
      });
    } else {
      setUpdated(true);
    }
  }, []);

  useEffect(() => {
    if (network === NETWORK.IC) {
      Tokens.forEach((token) => {
        updateTokenStandard([
          {
            canisterId: token.address,
            standard: token.standard as TOKEN_STANDARD,
          },
        ]);
      });

      const tokenIds = Tokens.map((ele) => ele.address);
      updateCanisters(tokenIds);
      updateTokens(tokenIds);
    }

    registerTokens([
      { canisterId: WRAPPED_ICP.address, standard: WRAPPED_ICP.standard as TOKEN_STANDARD },
      { canisterId: ICP.address, standard: ICP.standard as TOKEN_STANDARD },
    ]);
  }, []);

  // All token's standards, includes the local cached tokens
  const tokenStandards = useTokenStandards();
  useEffect(() => {
    if (tokenStandards) {
      const allStandards = Object.keys(tokenStandards).map((key) => ({
        canisterId: key,
        standard: tokenStandards[key],
      }));

      registerTokens(allStandards);
    }
  }, [tokenStandards]);

  return useMemo(() => {
    return {
      loading: !updated,
      AllPools,
    };
  }, [updated, AllPools]);
}
