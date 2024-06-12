import { useCallsData } from "@icpswap/hooks";
import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { v1StakingTokenController } from "@icpswap/actor";
import type { StakingPoolControllerPoolInfo, StakingPoolGlobalData } from "types/staking-token-v1/index";
import { Principal } from "@dfinity/principal";

export async function getStakingTokenGlobalData() {
  return resultFormat<StakingPoolGlobalData>(await (await v1StakingTokenController()).getTokenPoolsGlobalData()).data;
}

export function useStakingTokenGlobalData(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await getStakingTokenGlobalData();
    }, []),
    reload,
  );
}

export async function getStakingPoolFromController(canisterId: string) {
  return resultFormat<StakingPoolControllerPoolInfo>(
    await (await v1StakingTokenController()).getPoolInfo(Principal.fromText(canisterId)),
  ).data;
}

export function useStakingPoolInfoFromController(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getStakingPoolFromController(canisterId);
    }, [canisterId]),
  );
}
