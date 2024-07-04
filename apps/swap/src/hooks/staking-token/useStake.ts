import { useCallback } from "react";
import { stakingPoolDeposit, stakingPoolDepositFrom, stakingTokenStake } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { useTips, MessageTypes } from "hooks/useTips";
import { t } from "@lingui/macro";
import { isUseTransferByStandard } from "utils/token/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getSteps } from "components/stake/StakeStep";
import { useStepContentManager, useUpdateStepData } from "store/steps/hooks";
import { useTokenTransferOrApprove } from "hooks/token/useTokenTransferOrApprove";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";

import { useRewardTokenWithdrawCall } from "./useRewardTokenWithdrawCall";

interface UpdateStepArgs {
  token: Token;
  amount: string;
  poolId: string;
  standard: TOKEN_STANDARD;
  rewardToken: Token;
}

function useSteps() {
  const initialAndUpdateDetails = useStepContentManager();

  return useCallback((key: string, { token, amount, standard, rewardToken }: UpdateStepArgs) => {
    const content = getSteps({
      token,
      amount,
      standard,
      key,
      rewardToken,
    });

    initialAndUpdateDetails(String(key), {
      content,
      title: t`Staking Details`,
    });
  }, []);
}

interface UseStakingTokenDepositArgs {
  token: Token;
  poolId: string;
  amount: string;
  standard: TOKEN_STANDARD;
}

function useStakingTokenDeposit() {
  const [openTip] = useTips();
  const principal = useAccountPrincipal();

  return useCallback(
    async ({ token, poolId, standard, amount }: UseStakingTokenDepositArgs) => {
      const useTransfer = isUseTransferByStandard(standard);

      let status: ResultStatus = ResultStatus.ERROR;
      let message = "";

      if (useTransfer) {
        const { status: _status, message: _message } = await stakingPoolDeposit(poolId);
        status = _status;
        message = _message;
      } else {
        const { status: _status, message: _message } = await stakingPoolDepositFrom(poolId, BigInt(amount));
        status = _status;
        message = _message;
      }

      if (status === "err") {
        openTip(`Failed to deposit ${token.symbol}: ${message}`, MessageTypes.error);
        return false;
      }

      return true;
    },
    [principal],
  );
}

interface UseStakeCallbackArgs {
  token: Token;
  rewardToken: Token;
  poolId: string;
  amount: string;
  standard: TOKEN_STANDARD;
  key: string;
}

function useStakeCallback() {
  const [openTip] = useTips();
  const updateStepData = useUpdateStepData();
  const updateStep = useSteps();

  return useCallback(async ({ token, poolId, amount, standard, rewardToken, key }: UseStakeCallbackArgs) => {
    const { status, message, data } = await stakingTokenStake(poolId);

    if (status === "err") {
      openTip(`Failed to stake ${token.symbol}: ${message}`, MessageTypes.error);
      return false;
    }

    updateStepData(key, data);
    updateStep(key, { token, amount, poolId, standard, rewardToken });

    return true;
  }, []);
}

interface UseStakeCallsArgs {
  token: Token;
  amount: string;
  poolId: string;
  standard: TOKEN_STANDARD;
  key: string;
  rewardToken: Token;
}

function useStakeCalls() {
  const approveOrTransfer = useTokenTransferOrApprove();
  const deposit = useStakingTokenDeposit();
  const stake = useStakeCallback();
  const withdraw = useRewardTokenWithdrawCall();

  return useCallback(({ token, amount, poolId, standard, key, rewardToken }: UseStakeCallsArgs) => {
    const call0 = async () =>
      await approveOrTransfer({
        token,
        amount,
        to_owner: poolId,
        standard,
      });

    const call1 = async () => await deposit({ token, amount, poolId, standard });
    const call2 = async () => await stake({ token, amount, poolId, standard, key, rewardToken });
    const call3 = async () => await withdraw({ token: rewardToken, poolId, key });

    return [call0, call1, call2, call3];
  }, []);
}

export interface UseStakeCallArgs {
  token: Token;
  amount: string;
  poolId: string;
  standard: TOKEN_STANDARD;
  rewardToken: Token;
}

export function useStakeCall() {
  const updateStep = useSteps();
  const formatCall = useStepCalls();
  const getCalls = useStakeCalls();

  return useCallback(
    ({ token, amount, poolId, standard, rewardToken }: UseStakeCallArgs) => {
      const key = newStepKey();
      const calls = getCalls({ token, amount, poolId, standard, key, rewardToken });
      const { call, reset, retry } = formatCall(calls, key);

      updateStep(key, { token, amount, poolId, standard, rewardToken });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, updateStep],
  );
}
