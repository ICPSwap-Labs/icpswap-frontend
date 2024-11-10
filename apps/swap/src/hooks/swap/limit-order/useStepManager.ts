import { useCallback } from "react";
import { Position, Token } from "@icpswap/swap-sdk";
import { t } from "@lingui/macro";
import { useCloseAllSteps } from "hooks/useStepCall";
import { getLimitOrderSteps } from "components/swap/limit-order/index";
import { useStepContentManager } from "store/steps/hooks";
import { useHistory } from "react-router-dom";

interface LimitOrderStepsArgs {
  position: Position;
  retry: () => void;
  key: string;
  limitLick: bigint;
  inputToken: Token;
}

export function useStepManager() {
  const initialStepContent = useStepContentManager();
  const history = useHistory();
  const closeAllSteps = useCloseAllSteps();

  const handleReclaim = () => {
    history.push("/swap/withdraw");
    closeAllSteps();
  };

  return useCallback(({ key, position, inputToken, limitLick, retry }: LimitOrderStepsArgs) => {
    const content = getLimitOrderSteps({
      position,
      retry,
      handleReclaim,
      limitLick,
      inputToken,
    });

    initialStepContent(String(key), {
      content,
      title: t`Limit Order Details`,
    });
  }, []);
}
