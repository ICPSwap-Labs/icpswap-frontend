import { stakingPoolDeposit, stakingPoolDepositFrom, stakingTokenStake } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import type { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { type Null, ResultStatus } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull, sleep } from "@icpswap/utils";
import { getSteps } from "components/stake/StakeStep";
import { useAllowance } from "hooks/token";
import { useTokenTransferOrApprove } from "hooks/token/useTokenTransferOrApprove";
import { newStepKey, useStepCalls } from "hooks/useStepCall";
import { MessageTypes, useTips } from "hooks/useTips";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { useStepContentManager, useUpdateStepData } from "store/steps/hooks";
import { isUseTransfer, isUseTransferByStandard } from "utils/token/index";
import { useRewardTokenWithdrawCall } from "./useRewardTokenWithdrawCall";

interface UpdateStepArgs {
  token: Token;
  amount: string;
  poolId: string;
  standard: TOKEN_STANDARD;
  rewardToken: Token;
}

function useSteps() {
  const { t } = useTranslation();
  const initialAndUpdateDetails = useStepContentManager();

  return useCallback(
    (key: string, { token, amount, standard, rewardToken }: UpdateStepArgs) => {
      const content = getSteps({
        token,
        amount,
        standard,
        key,
        rewardToken,
      });

      initialAndUpdateDetails(String(key), {
        content,
        title: t("stake.staking.details"),
      });
    },
    [initialAndUpdateDetails, t],
  );
}

interface UseStakingTokenDepositArgs {
  token: Token;
  poolId: string;
  amount: string;
  standard: TOKEN_STANDARD;
}

function useStakingTokenDeposit() {
  const [openTip] = useTips();

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
    [openTip],
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

  return useCallback(
    async ({ token, poolId, amount, standard, rewardToken, key }: UseStakeCallbackArgs) => {
      const { status, message, data } = await stakingTokenStake(poolId);

      if (status === "err") {
        openTip(`Failed to stake ${token.symbol}: ${message}`, MessageTypes.error);
        return false;
      }

      updateStepData(key, data);
      updateStep(key, { token, amount, poolId, standard, rewardToken });

      return true;
    },
    [openTip, updateStep, updateStepData],
  );
}

interface UseStakeCallsArgs {
  amount: string;
  standard: TOKEN_STANDARD;
  key: string;
  rewardToken: Token;
}

interface UseStakeCallsProps {
  token: Token | Null;
  poolId: string | Null;
}

function useStakeCalls({ token, poolId }: UseStakeCallsProps) {
  const principal = useAccountPrincipal();
  const approveOrTransfer = useTokenTransferOrApprove();
  const deposit = useStakingTokenDeposit();
  const stake = useStakeCallback();
  const withdraw = useRewardTokenWithdrawCall();

  const allowanceTokenId = useMemo(() => {
    if (isUndefinedOrNull(token)) return undefined;
    return isUseTransfer(token) ? undefined : token.address;
  }, [token]);

  const { data: allowance } = useAllowance({
    canisterId: allowanceTokenId,
    spender: poolId,
    owner: principal?.toString(),
  });

  return useCallback(
    ({ amount, standard, key, rewardToken }: UseStakeCallsArgs) => {
      if (!token || !poolId) return [];

      const approveAmount = new BigNumber(amount).multipliedBy(1000).toString();

      const call0 = async () =>
        await approveOrTransfer({
          token,
          amount,
          to_owner: poolId,
          standard,
          approve_amount: approveAmount,
          allowance,
        });

      const call1 = async () => await deposit({ token, amount, poolId, standard });

      const call2 = async () => {
        const stakeResult = await stake({ token, amount, poolId, standard, key, rewardToken });
        if (stakeResult) {
          withdraw({ token: rewardToken, poolId, key });
        }
        return stakeResult;
      };

      // const call3 = async () => await withdraw({ token: rewardToken, poolId, key });
      const call3 = async () => {
        await sleep(3000);
        return true;
      };

      return [call0, call1, call2, call3];
    },
    [approveOrTransfer, allowance, deposit, stake, withdraw, poolId, token],
  );
}

export interface UseStakeCallArgs {
  token: Token;
  amount: string;
  poolId: string;
  standard: TOKEN_STANDARD;
  rewardToken: Token;
}

export interface UseStakeCallProps {
  token: Token | Null;
  poolId: string | Null;
}

export function useStakeCall({ token, poolId }: UseStakeCallProps) {
  const updateStep = useSteps();
  const formatCall = useStepCalls();
  const getCalls = useStakeCalls({ token, poolId });

  return useCallback(
    ({ amount, standard, rewardToken }: UseStakeCallArgs) => {
      const key = newStepKey();
      const calls = getCalls({ amount, standard, key, rewardToken });
      const { call, reset, retry } = formatCall(calls, key);

      if (token && poolId) {
        updateStep(key, { token, amount, poolId, standard, rewardToken });
      }

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, updateStep, token, poolId],
  );
}
