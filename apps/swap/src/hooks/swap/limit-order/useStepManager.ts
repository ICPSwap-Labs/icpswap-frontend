import { useCallback } from "react";
import { Position, Token } from "@icpswap/swap-sdk";
import { getLimitOrderSteps } from "components/swap/limit-order/index";
import { useStepContentManager } from "store/steps/hooks";
import { useTranslation } from "react-i18next";
import { useStepsToReclaimCallback } from "hooks/swap/useStepsToReclaimCallback";

interface LimitOrderStepsArgs {
  position: Position;
  retry: () => void;
  key: string;
  inputToken: Token;
}

export function useStepManager() {
  const { t } = useTranslation();
  const initialStepContent = useStepContentManager();

  const stepsToReclaimCallback = useStepsToReclaimCallback();

  return useCallback(({ key, position, inputToken, retry }: LimitOrderStepsArgs) => {
    const content = getLimitOrderSteps({
      position,
      retry,
      handleReclaim: stepsToReclaimCallback,
      inputToken,
    });

    initialStepContent(String(key), {
      content,
      title: t("swap.limit.order.details"),
    });
  }, []);
}
