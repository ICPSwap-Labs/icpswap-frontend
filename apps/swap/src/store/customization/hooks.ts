import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback, useMemo } from "react";
import { updateHideUnavailableClaim } from "./actions";

export function useHideUnavailableClaimManager() {
  const dispatch = useAppDispatch();
  const hideUnavailableClaim = useAppSelector((state) => state.customization.hideUnavailableClaim);

  const callback = useCallback(
    (hide: boolean) => {
      dispatch(updateHideUnavailableClaim(hide));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      hideUnavailableClaim,
      updateHideUnavailableClaim: callback,
    }),
    [callback, hideUnavailableClaim],
  );
}
