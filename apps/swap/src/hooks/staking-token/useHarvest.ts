import { useCallback } from "react";
import { stakingPoolHarvest } from "@icpswap/hooks";
import { sleep } from "@icpswap/utils";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { useUpdateStepData } from "store/steps/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useTips, MessageTypes } from "hooks/useTips";

import { useRewardTokenWithdrawCall } from "./useRewardTokenWithdrawCall";
import { useHarvestSteps } from "./useHarvestSteps";

export interface UseHarvestCallbackArgs {
  poolId: string;
  token: Token;
  key: string;
}

function useHarvestCallback() {
  const [openTip] = useTips();
  const updateStepData = useUpdateStepData();
  const stepsManager = useHarvestSteps();

  return useCallback(async ({ poolId, token, key }: UseHarvestCallbackArgs) => {
    const { status, message, data } = await stakingPoolHarvest(poolId);

    if (status === "err") {
      openTip(`Failed to unstake ${token.symbol}: ${message}`, MessageTypes.error);
      return false;
    }

    updateStepData(key, data);
    stepsManager(key, { token, poolId });

    return true;
  }, []);
}

interface UnstakeCallsArgs {
  token: Token;
  poolId: string;
  key: string;
  refresh?: () => void;
}

function useCalls() {
  const harvest = useHarvestCallback();
  const withdraw = useRewardTokenWithdrawCall();

  return useCallback(
    ({ token, key, poolId, refresh }: UnstakeCallsArgs) => {
      const call0 = async () => {
        const harvestResult = await harvest({ token, poolId, key });
        if (harvestResult) {
          withdraw({ token, poolId, key }).then(() => {
            if (refresh) refresh();
          });
        }

        return harvestResult;
      };

      const call1 = async () => {
        await sleep(2000);
        return true;
      };

      return [call0, call1];
    },
    [withdraw, harvest],
  );
}

export interface UnstakeCallArgs {
  token: Token;
  poolId: string;
  refresh?: () => void;
}

export function useHarvestCall() {
  const updateStep = useHarvestSteps();
  const formatCall = useStepCalls();
  const getCalls = useCalls();

  return useCallback(
    ({ token, poolId, refresh }: UnstakeCallArgs) => {
      const key = newStepKey();
      const calls = getCalls({ token, poolId, key, refresh });
      const { call, reset, retry } = formatCall(calls, key);

      updateStep(key, { token, poolId });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, updateStep],
  );
}
