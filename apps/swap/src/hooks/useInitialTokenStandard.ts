import { useEffect, useState, useMemo } from "react";
import { XTC, TOKEN_STANDARD, CAT, MOD, BoomDAO } from "constants/tokens";
import { ckSepoliaUSDC, ckSepoliaETH, ICP, WRAPPED_ICP } from "@icpswap/tokens";
import { getSwapPools } from "@icpswap/hooks";
import type { SwapPoolData } from "@icpswap/types";
import { registerTokens } from "@icpswap/token-adapter";
import { network, NETWORK } from "constants/server";
import { useUpdateTokenStandard, useTokenStandards } from "store/token/cache/hooks";
import { useGlobalTokenList } from "store/global/hooks";
import { usePoolCanisterIdManager, useUpdateAllSwapPools } from "store/swap/hooks";
import { getAllTokenPools } from "hooks/staking-token/index";
import { getAllClaimEvents } from "hooks/token-claim";
import { updateCanisters } from "store/allCanisters";
import { updateTokens } from "store/allTokens";

export const Tokens = [XTC, CAT, MOD, BoomDAO, ckSepoliaUSDC, ckSepoliaETH];

export interface UseInitialTokenStandardArgs {
  fetchGlobalTokensLoading: boolean;
}

export function useInitialTokenStandard({ fetchGlobalTokensLoading }: UseInitialTokenStandardArgs) {
  const [tokensLoading, setTokensLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  const [AllPools, setAllPools] = useState<SwapPoolData[] | undefined>(undefined);

  const updateTokenStandard = useUpdateTokenStandard();
  const updateAllSwapPools = useUpdateAllSwapPools();
  const globalTokenList = useGlobalTokenList();
  const [, updatePoolCanisterId] = usePoolCanisterIdManager();

  useEffect(() => {
    if (network === NETWORK.IC) {
      Promise.all([
        getSwapPools(),
        getAllTokenPools().catch(() => undefined),
        getAllClaimEvents().catch(() => undefined),
      ]).then(([allSwapPools, allTokenPools, allClaimEvents]) => {
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

        allTokenPools?.forEach((pool) => {
          pushStandard(pool.stakingToken.address, pool.stakingToken.standard as TOKEN_STANDARD);
          pushStandard(pool.rewardToken.address, pool.rewardToken.standard as TOKEN_STANDARD);
        });

        allClaimEvents?.forEach((event) => {
          pushStandard(event.tokenCid, event.tokenStandard as TOKEN_STANDARD);
        });

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
          ...(allTokenPools?.map((ele) => [
            ele.canisterId.toString(),
            ele.rewardToken.address,
            ele.stakingToken.address,
          ]) ?? []),
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
    if (globalTokenList && globalTokenList.length > 0) {
      const allTokenStandards = globalTokenList.map((token) => {
        return {
          canisterId: token.canisterId,
          standard: token.standard as TOKEN_STANDARD,
        };
      });

      updateTokenStandard(allTokenStandards);

      setTokensLoading(false);

      const tokenIds = globalTokenList.map((ele) => ele.canisterId);

      updateCanisters(tokenIds);
      updateTokens(tokenIds);
    } else if (!fetchGlobalTokensLoading) {
      setTokensLoading(false);
    }
  }, [globalTokenList, fetchGlobalTokensLoading]);

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
      loading: fetchGlobalTokensLoading || tokensLoading || !updated,
      AllPools,
    };
  }, [tokensLoading, fetchGlobalTokensLoading, updated, AllPools]);
}
