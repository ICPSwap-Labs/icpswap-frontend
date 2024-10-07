import { useCallback } from "react";
import { Position } from "@icpswap/swap-sdk";
import { decreaseLiquidity } from "hooks/swap/v3Calls";
import { useSwapWithdraw } from "hooks/swap/index";
import { useErrorTip } from "hooks/useTips";
import { t } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "locales/services";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getCancelLimitSteps } from "components/swap/limit-order/CancelLimitSteps";
import { useStepContentManager } from "store/steps/hooks";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { useReclaimCallback } from "hooks/swap/useReclaimCallback";
import { Principal } from "@dfinity/principal";
import { useUpdateDecreaseLiquidityAmount, getDecreaseLiquidityAmount } from "store/swap/hooks";
import { useSwapKeepTokenInPoolsManager } from "store/swap/cache/hooks";

type updateStepsArgs = {
  positionId: bigint;
  retry?: () => Promise<boolean>;
  principal: Principal | undefined;
  key: string;
  position: Position;
};

function useUpdateStepContent() {
  const updateStep = useStepContentManager();
  const handleReclaim = useReclaimCallback();
  const [keepTokenInPools] = useSwapKeepTokenInPoolsManager();

  return useCallback(
    ({ position, positionId, principal, key }: updateStepsArgs) => {
      const content = getCancelLimitSteps({
        position,
        positionId,
        principal,
        key,
        handleReclaim,
        keepTokenInPools,
      });

      updateStep(String(key), {
        content,
        title: t`Cancel Limit Details`,
      });
    },
    [keepTokenInPools],
  );
}

interface CancelLimitCallsArgs {
  position: Position;
  positionId: bigint;
  poolId: string;
  openExternalTip: OpenExternalTip;
  tipKey: string;
}

function useCancelLimitCalls() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();

  const withdraw = useSwapWithdraw();
  const updateDecreaseLiquidityAmount = useUpdateDecreaseLiquidityAmount();
  const updateStepContent = useUpdateStepContent();
  // const [keepTokenInPools] = useSwapKeepTokenInPoolsManager();

  return useCallback(({ position, poolId, positionId, openExternalTip, tipKey }: CancelLimitCallsArgs) => {
    const _decreaseLiquidity = async () => {
      if (!principal) return false;

      const { status, message, data } = await decreaseLiquidity(poolId, {
        positionId,
        liquidity: position.liquidity.toString(),
      });

      if (status === "err") {
        openErrorTip(`${getLocaleMessage(message)}.`);
        return false;
      }

      updateDecreaseLiquidityAmount(tipKey, data?.amount0, data?.amount1);

      updateStepContent({
        position,
        positionId,
        principal,
        key: tipKey,
      });

      return true;
    };

    const withdrawToken = async () => {
      const { amount0, amount1 } = getDecreaseLiquidityAmount(tipKey);

      const token = position.amount0.equalTo(0) ? position.pool.token1 : position.pool.token0;
      const amount = position.amount0.equalTo(0) ? amount1 : amount0;

      if (!token || amount === undefined) return false;
      // skip if amount is less than 0 or is 0
      if (amount - BigInt(token.transFee) <= BigInt(0)) return "skip";

      return await withdraw(token, poolId, amount.toString(), ({ message }: ExternalTipArgs) => {
        openExternalTip({ message, tipKey, poolId });
      });
    };

    // return keepTokenInPools ? [_decreaseLiquidity] : [_decreaseLiquidity, withdrawToken];
    return [_decreaseLiquidity, withdrawToken];
  }, []);
}

export interface CancelLimitCallbackProps {
  position: Position;
  positionId: bigint;
  poolId: string;
  openExternalTip: OpenExternalTip;
}

export function useCancelLimitCallback() {
  const principal = useAccountPrincipal();
  const getCalls = useCancelLimitCalls();
  const getStepCalls = useStepCalls();
  const stepContentManage = useStepContentManager();
  const handleReclaim = useReclaimCallback();
  const [keepTokenInPools] = useSwapKeepTokenInPoolsManager();

  return useCallback(
    ({ position, positionId, poolId, openExternalTip }: CancelLimitCallbackProps) => {
      const key = newStepKey();

      const calls = getCalls({
        poolId,
        position,
        positionId,
        tipKey: key,
        openExternalTip,
      });

      const { call, reset, retry } = getStepCalls(calls, key);

      const content = getCancelLimitSteps({
        position,
        positionId,
        principal,
        handleReclaim,
        key,
        keepTokenInPools,
      });

      stepContentManage(String(key), {
        content,
        title: t`Cancel Limit Details`,
      });

      return { call, reset, retry, key };
    },
    [getStepCalls, stepContentManage, keepTokenInPools],
  );
}
