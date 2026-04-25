import { removeOrder } from "@icpswap/hooks";
import type { Position } from "@icpswap/swap-sdk";
import type { LimitOrder } from "@icpswap/types";
import { getCancelLimitSteps } from "components/swap/limit-order/CancelLimitSteps";
import { newStepKey, useStepCalls } from "hooks/useStepCall";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { useStepContentManager } from "store/steps/hooks";
import type { OpenExternalTip } from "types/index";

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
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();

  return useCallback(
    ({ poolId, positionId, refresh }: CancelLimitCallsArgs) => {
      const __removeOrder = async () => {
        const { status, message } = await removeOrder(poolId, positionId);

        if (status === "err") {
          openErrorTip(`${getLocaleMessage(message)}.`);
          return false;
        }

        openSuccessTip(t("swap.limit.cancel.success"));

        if (refresh) refresh();

        return true;
      };

      return [__removeOrder];
    },
    [openErrorTip, openSuccessTip, t],
  );
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
        key,
        limit,
      });

      stepContentManage(String(key), {
        content,
        title: t("limit.cancel.details"),
      });

      return { call, reset, retry, key };
    },
    [getStepCalls, stepContentManage, getCalls, principal, t],
  );
}
