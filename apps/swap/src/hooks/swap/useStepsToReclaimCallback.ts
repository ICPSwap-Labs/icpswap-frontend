import { useCallback } from "react";
import { useCloseAllSteps } from "hooks/useStepCall";
import { useHistory } from "react-router-dom";

export function useStepsToReclaimCallback() {
  const history = useHistory();
  const closeAllSteps = useCloseAllSteps();

  const callback = useCallback(
    (poolId: string) => {
      history.push(`/swap/withdraw?type=pair&poolId=${poolId}`);
      closeAllSteps();
    },
    [history, closeAllSteps],
  );

  return callback;
}
