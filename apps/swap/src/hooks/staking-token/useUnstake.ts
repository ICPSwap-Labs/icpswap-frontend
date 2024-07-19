import { useCallback } from "react";
import { stakingPoolUnstake, stakingPoolWithdraw } from "@icpswap/hooks";
import { useTips, MessageTypes } from "hooks/useTips";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { parseTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { useUpdateStepData } from "store/steps/hooks";

import { useUnstakeSteps } from "./useUnstakeSteps";
import { useRewardTokenWithdrawCall } from "./useRewardTokenWithdrawCall";

export interface UseUnstakeCallbackArgs {
  poolId: string;
  amount: bigint;
  token: Token;
  rewardToken: Token;
  key: string;
}

function useUnstakeCallback() {
  const [openTip] = useTips();
  const stepManager = useUnstakeSteps();
  const updateStepData = useUpdateStepData();

  return useCallback(async ({ poolId, amount, token, key, rewardToken }: UseUnstakeCallbackArgs) => {
    const { status, message, data } = await stakingPoolUnstake(poolId, amount);

    if (status === "err") {
      openTip(`Failed to unstake ${token.symbol}: ${message}`, MessageTypes.error);
      return false;
    }

    updateStepData(key, data);
    stepManager(key, { token, amount, poolId, rewardToken });

    return true;
  }, []);
}

interface UseStakedTokenWithdrawArgs {
  poolId: string;
  amount: bigint;
  token: Token;
}

function useStakedTokenWithdrawCallback() {
  const [openTip] = useTips();

  return useCallback(async ({ poolId, amount, token }: UseStakedTokenWithdrawArgs) => {
    const { status, message } = await stakingPoolWithdraw(poolId, true, amount);

    if (status === "err") {
      openTip(
        `Failed to withdraw ${parseTokenAmount(amount, token.decimals).toFormat()} ${token.symbol}: ${message}`,
        MessageTypes.error,
      );
      return false;
    }

    return true;
  }, []);
}

type UnstakeCallsArgs = {
  token: Token;
  rewardToken: Token;
  amount: bigint;
  poolId: string;
  key: string;
};

function useCalls() {
  const unstake = useUnstakeCallback();
  const withdraw = useStakedTokenWithdrawCallback();
  const withdrawRewardToken = useRewardTokenWithdrawCall();

  return useCallback(
    ({ token, amount, poolId, key, rewardToken }: UnstakeCallsArgs) => {
      const call0 = async () => await unstake({ token, amount, poolId, key, rewardToken });
      const call1 = async () => await withdraw({ token, amount, poolId });
      const call2 = async () => await withdrawRewardToken({ token, key, poolId });

      return [call0, call1, call2];
    },
    [unstake, withdraw, withdrawRewardToken],
  );
}

interface UnstakeCallArgs {
  token: Token;
  rewardToken: Token;
  amount: bigint;
  poolId: string;
}

export function useUnstakeCall() {
  const updateStep = useUnstakeSteps();
  const formatCall = useStepCalls();
  const getCalls = useCalls();

  return useCallback(
    ({ token, amount, poolId, rewardToken }: UnstakeCallArgs) => {
      const key = newStepKey();
      const calls = getCalls({ token, amount, poolId, key, rewardToken });
      const { call, reset, retry } = formatCall(calls, key);

      updateStep(key, { token, amount, poolId, rewardToken });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, updateStep],
  );
}
