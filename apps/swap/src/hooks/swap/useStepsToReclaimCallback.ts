import { useCallback } from "react";
import { useCloseAllSteps } from "hooks/useStepCall";
import { useNavigate } from "react-router-dom";

export function useStepsToReclaimCallback() {
  const navigate = useNavigate();
  const closeAllSteps = useCloseAllSteps();

  const callback = useCallback(
    (poolId: string) => {
      navigate(`/swap/withdraw?type=pair&poolId=${poolId}`);
      closeAllSteps();
    },
    [navigate, closeAllSteps],
  );

  return callback;
}
