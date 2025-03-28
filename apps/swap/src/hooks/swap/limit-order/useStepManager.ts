import { useCallback } from "react";
import { Position, Token } from "@icpswap/swap-sdk";
import { useCloseAllSteps } from "hooks/useStepCall";
import { getLimitOrderSteps } from "components/swap/limit-order/index";
import { useStepContentManager } from "store/steps/hooks";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface LimitOrderStepsArgs {
  position: Position;
  retry: () => void;
  key: string;
  inputToken: Token;
}

export function useStepManager() {
  const { t } = useTranslation();
  const initialStepContent = useStepContentManager();
  const history = useHistory();
  const closeAllSteps = useCloseAllSteps();

  const handleReclaim = () => {
    history.push("/swap/withdraw");
    closeAllSteps();
  };

  return useCallback(({ key, position, inputToken, retry }: LimitOrderStepsArgs) => {
    const content = getLimitOrderSteps({
      position,
      retry,
      handleReclaim,
      inputToken,
    });

    initialStepContent(String(key), {
      content,
      title: t("swap.limit.order.details"),
    });
  }, []);
}
