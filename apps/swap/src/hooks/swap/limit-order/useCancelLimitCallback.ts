import { useCallback } from "react";
import { Position } from "@icpswap/swap-sdk";
import { removeOrder } from "@icpswap/hooks";
import { decreaseLiquidity } from "hooks/swap/v3Calls";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "i18n/service";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getCancelLimitSteps } from "components/swap/limit-order/CancelLimitSteps";
import { useStepContentManager } from "store/steps/hooks";
import { OpenExternalTip } from "types/index";
import { useReclaimCallback } from "hooks/swap/useReclaimCallback";
import { Principal } from "@dfinity/principal";
import { useUpdateDecreaseLiquidityAmount } from "store/swap/hooks";
import { useSwapKeepTokenInPoolsManager } from "store/swap/cache/hooks";
import { LimitOrder } from "@icpswap/types";
import { useTranslation } from "react-i18next";

type updateStepsArgs = {
  positionId: bigint;
  retry?: () => Promise<boolean>;
  principal: Principal | undefined;
  key: string;
  position: Position;
  limit: LimitOrder;
};

function useUpdateStepContent() {
  const { t } = useTranslation();
  const updateStep = useStepContentManager();
  const handleReclaim = useReclaimCallback();
  const [keepTokenInPools] = useSwapKeepTokenInPoolsManager();

  return useCallback(
    ({ position, positionId, principal, limit, key }: updateStepsArgs) => {
      const content = getCancelLimitSteps({
        position,
        positionId,
        principal,
        key,
        handleReclaim,
        limit,
      });

      updateStep(String(key), {
        content,
        title: t("limit.cancel.details"),
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
  refresh?: () => void;
  limit: LimitOrder;
}

function useCancelLimitCalls() {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();

  const updateDecreaseLiquidityAmount = useUpdateDecreaseLiquidityAmount();
  const updateStepContent = useUpdateStepContent();

  return useCallback(({ position, poolId, positionId, tipKey, limit }: CancelLimitCallsArgs) => {
    const __removeOrder = async () => {
      const { status, message } = await removeOrder(poolId, positionId);

      if (status === "err") {
        openErrorTip(`${getLocaleMessage(message)}.`);
        return false;
      }

      return true;
    };

    const __decreaseLiquidity = async () => {
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
        limit,
        key: tipKey,
      });

      openSuccessTip(t("swap.limit.cancel.success"));

      return true;
    };

    return [__removeOrder, __decreaseLiquidity];
  }, []);
}

export interface CancelLimitCallbackProps {
  position: Position;
  positionId: bigint;
  poolId: string;
  openExternalTip: OpenExternalTip;
  refresh?: () => void;
  limit: LimitOrder;
}

export function useCancelLimitCallback() {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const getCalls = useCancelLimitCalls();
  const getStepCalls = useStepCalls();
  const stepContentManage = useStepContentManager();
  const handleReclaim = useReclaimCallback();

  return useCallback(
    ({ position, positionId, poolId, openExternalTip, limit, refresh }: CancelLimitCallbackProps) => {
      const key = newStepKey();

      const calls = getCalls({
        poolId,
        position,
        positionId,
        tipKey: key,
        openExternalTip,
        refresh,
        limit,
      });

      const { call, reset, retry } = getStepCalls(calls, key);

      const content = getCancelLimitSteps({
        position,
        positionId,
        principal,
        handleReclaim,
        key,
        limit,
      });

      stepContentManage(String(key), {
        content,
        title: t("limit.cancel.details"),
      });

      return { call, reset, retry, key };
    },
    [getStepCalls, stepContentManage],
  );
}
