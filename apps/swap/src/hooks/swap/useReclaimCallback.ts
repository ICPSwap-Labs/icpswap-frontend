import { useCallback } from "react";
import { useCloseAllSteps } from "store/steps/hooks";
import { useHistory } from "react-router-dom";

export function useReclaimCallback() {
  const history = useHistory();
  const closeAllSteps = useCloseAllSteps();

  return useCallback(() => {
    history.push("/swap/reclaim");
    closeAllSteps();
  }, [history, closeAllSteps]);
}
