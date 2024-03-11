import { useCallback } from "react";
import { Position } from "@icpswap/swap-sdk";
import { t } from "@lingui/macro";
import { getActorIdentity } from "components/Identity";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "locales/services";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getIncreaseLiquiditySteps } from "components/swap/IncreaseLiquiditySteps";
import { useStepContentManager } from "store/steps/hooks";
import { useSwapApprove, useSwapDeposit, useSwapTransfer } from "hooks/swap/index";
import { isUseTransfer } from "utils/token/index";
import { useSuccessTip } from "hooks/useTips";
import { increaseLiquidity } from "hooks/swap/v3Calls";
import { actualAmountToPool } from "utils/token/index";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { useReclaimCallback } from "hooks/swap";

export interface IncreaseLiquidityArgs {
  positionId: bigint;
  position: Position;
  poolId: string;
  openExternalTip: OpenExternalTip;
  stepKey: string;
}

export function useIncreaseLiquidityCalls() {
  const principal = useAccountPrincipal();

  const [openSuccessTip] = useSuccessTip();

  const approve = useSwapApprove();
  const deposit = useSwapDeposit();
  const transfer = useSwapTransfer();

  return useCallback(
    ({ position, poolId, positionId, openExternalTip, stepKey }: IncreaseLiquidityArgs) => {
      const approveToken0 = async () => {
        if (!position) return false;
        const amount0Desired = position.mintAmounts.amount0.toString();
        if (amount0Desired !== "0") return await approve(position.pool.token0, amount0Desired, poolId);
        return true;
      };

      const approveToken1 = async () => {
        if (!position) return false;
        const amount1Desired = position.mintAmounts.amount1.toString();
        if (amount1Desired !== "0") return await approve(position.pool.token1, amount1Desired, poolId);
        return true;
      };

      const transferToken0 = async () => {
        if (!position) return false;
        const amount0Desired = position.mintAmounts.amount0.toString();
        if (amount0Desired !== "0") return await transfer(position.pool.token0, amount0Desired, poolId);
        return true;
      };

      const transferToken1 = async () => {
        if (!position) return false;
        const amount1Desired = position.mintAmounts.amount1.toString();
        if (amount1Desired !== "0") return await transfer(position.pool.token1, amount1Desired, poolId);
        return true;
      };

      const depositToken0 = async () => {
        if (!position) return false;
        const amount0Desired = position.mintAmounts.amount0.toString();
        if (amount0Desired !== "0") {
          return await deposit(position.pool.token0, amount0Desired, poolId, ({ message }: ExternalTipArgs) => {
            openExternalTip({ message, tipKey: stepKey });
          });
        }
        return true;
      };

      const depositToken1 = async () => {
        if (!position) return false;
        const amount1Desired = position.mintAmounts.amount1.toString();
        if (amount1Desired !== "0") {
          return await deposit(position.pool.token1, amount1Desired, poolId, ({ message }: ExternalTipArgs) => {
            openExternalTip({ message, tipKey: stepKey });
          });
        }
        return true;
      };

      const _increaseLiquidity = async () => {
        if (!position || !principal) return false;

        const identity = await getActorIdentity();

        const token0 = position.pool.token0;
        const token1 = position.pool.token1;

        const amount0Desired = actualAmountToPool(token0, position.mintAmounts.amount0.toString());
        const amount1Desired = actualAmountToPool(token1, position.mintAmounts.amount1.toString());

        const { status, message } = await increaseLiquidity(identity, poolId, {
          positionId,
          amount0Desired: amount0Desired,
          amount1Desired,
        });

        if (status === "ok") {
          openSuccessTip(t`Add Liquidity Successfully`);
        } else {
          openExternalTip({ message: getLocaleMessage(message), tipKey: stepKey });
          return false;
        }

        return true;
      };

      return [
        isUseTransfer(position?.pool.token0) ? transferToken0 : approveToken0,
        depositToken0,
        isUseTransfer(position?.pool.token1) ? transferToken1 : approveToken1,
        depositToken1,
        _increaseLiquidity,
      ];
    },
    [principal],
  );
}

export interface InitialAddLiquidityStepsArgs {
  position: Position;
}

function useInitialAddLiquiditySteps() {
  const stepContentManage = useStepContentManager();

  const handleReclaim = useReclaimCallback();

  return useCallback((key: string, { position }: InitialAddLiquidityStepsArgs) => {
    const content = getIncreaseLiquiditySteps({
      position,
      handleReclaim,
    });

    stepContentManage(String(key), {
      content,
      title: t`Add Liquidity Details`,
    });
  }, []);
}

export interface IncreaseLiquidityCallProps {
  position: Position;
  positionId: bigint;
  poolId: string;
  openExternalTip: OpenExternalTip;
}

export function useIncreaseLiquidityCall() {
  const getCalls = useIncreaseLiquidityCalls();
  const formatCall = useStepCalls();
  const initialSteps = useInitialAddLiquiditySteps();

  return useCallback(
    ({ position, positionId, poolId, openExternalTip }: IncreaseLiquidityCallProps) => {
      const key = newStepKey();
      const calls = getCalls({ position, positionId, poolId, stepKey: key, openExternalTip });
      const { call, reset, retry } = formatCall(calls, key);

      initialSteps(key, { position });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, initialSteps],
  );
}
