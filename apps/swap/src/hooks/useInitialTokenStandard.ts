import { useEffect, useState, useMemo } from "react";
import { XTC, TOKEN_STANDARD, WRAPPED_ICP, ICP, CAT, MOD, BoomDAO, ICX, NUA, SONIC, ckTestUSD } from "constants/tokens";
import { network, NETWORK } from "constants/server";
import { useUpdateTokenStandard, useTokenStandards } from "store/token/cache/hooks";
import { useGlobalTokenList } from "store/global/hooks";
import { usePoolCanisterIdManager } from "store/swap/hooks";
import { getSwapPools } from "@icpswap/hooks";
import { registerTokens } from "@icpswap/token-adapter";
import { getAllTokenPools } from "hooks/staking-token/index";
import { getAllClaimEvents } from "hooks/token-claim";
import { updateCanisters } from "store/allCanisters";
import type { SwapPoolData } from "@icpswap/types";

export const Tokens = [XTC, CAT, MOD, BoomDAO, ICX, NUA, SONIC, ckTestUSD];

export interface UseInitialTokenStandardArgs {
  fetchGlobalTokensLoading: boolean;
}

export function useInitialTokenStandard({ fetchGlobalTokensLoading }: UseInitialTokenStandardArgs) {
  const [tokensLoading, setTokensLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  const [AllPools, setAllPools] = useState<SwapPoolData[] | undefined>(undefined);

  const updateTokenStandard = useUpdateTokenStandard();

  const globalTokenList = useGlobalTokenList();

  const [, updatePoolCanisterId] = usePoolCanisterIdManager();

  useEffect(() => {
    if (network === NETWORK.IC) {
      Promise.all([
        getSwapPools(),
        getAllTokenPools().catch(() => undefined),
        getAllClaimEvents().catch(() => undefined),
      ]).then(([allSwapPools, allTokenPools, allClaimEvents]) => {
        allTokenPools?.forEach((pool) => {
          updateTokenStandard({
            canisterId: pool.stakingToken.address,
            standard: pool.stakingToken.standard as TOKEN_STANDARD,
          });

          updateTokenStandard({
            canisterId: pool.rewardToken.address,
            standard: pool.rewardToken.standard as TOKEN_STANDARD,
          });
        });

        allClaimEvents?.forEach((event) => {
          updateTokenStandard({
            canisterId: event.tokenCid,
            standard: event.tokenStandard as TOKEN_STANDARD,
          });
        });

        allSwapPools?.forEach((pool) => {
          updateTokenStandard({
            canisterId: pool.token0.address,
            standard: pool.token0.standard as TOKEN_STANDARD,
          });

          updateTokenStandard({
            canisterId: pool.token1.address,
            standard: pool.token1.standard as TOKEN_STANDARD,
          });

          setAllPools(allSwapPools);

          updatePoolCanisterId({ key: pool.key, id: pool.canisterId.toString() });
        });

        updateCanisters(
          [
            ...(allSwapPools?.map((ele) => [ele.canisterId.toString(), ele.token0.address, ele.token1.address]) ?? []),
            ...(allTokenPools?.map((ele) => [
              ele.canisterId.toString(),
              ele.rewardToken.address,
              ele.stakingToken.address,
            ]) ?? []),
          ].reduce((prev, curr) => {
            return prev.concat(curr);
          }, [] as string[]),
        );

        setUpdated(true);
      });
    } else {
      setUpdated(true);
    }
  }, []);

  useEffect(() => {
    if (globalTokenList && globalTokenList.length > 0) {
      globalTokenList.forEach((token) => {
        updateTokenStandard({
          canisterId: token.canisterId,
          standard: token.standard as TOKEN_STANDARD,
        });
      });
      setTokensLoading(false);

      updateCanisters(globalTokenList.map((ele) => ele.canisterId));
    } else if (!fetchGlobalTokensLoading) {
      setTokensLoading(false);
    }
  }, [globalTokenList, fetchGlobalTokensLoading]);

  useEffect(() => {
    if (network === NETWORK.IC) {
      Tokens.forEach((token) => {
        updateTokenStandard({
          canisterId: token.address,
          standard: token.standard as TOKEN_STANDARD,
        });
      });

      updateCanisters(Tokens.map((ele) => ele.address));
    }

    registerTokens({ canisterIds: [WRAPPED_ICP.address], standard: WRAPPED_ICP.standard as TOKEN_STANDARD });
    registerTokens({ canisterIds: [ICP.address], standard: ICP.standard as TOKEN_STANDARD });
  }, []);

  const tokenStandards = useTokenStandards();

  useEffect(() => {
    if (tokenStandards) {
      Object.keys(tokenStandards).forEach((key) => {
        registerTokens({ canisterIds: [key], standard: tokenStandards[key] });
      });
    }
  }, [tokenStandards]);

  return useMemo(() => {
    return {
      loading: fetchGlobalTokensLoading || tokensLoading || !updated,
      AllPools,
    };
  }, [tokensLoading, fetchGlobalTokensLoading, updated, AllPools]);
}
