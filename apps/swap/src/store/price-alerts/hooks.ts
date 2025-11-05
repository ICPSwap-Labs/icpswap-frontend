import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { updateEmailSecond, updateShowGetCode } from "store/price-alerts/actions";

export function useEmailSecond() {
  return useAppSelector((state) => state.priceAlerts.second);
}

export function useEmailSecondManger(): [number, (second: number) => void] {
  const dispatch = useAppDispatch();
  const emailSecond = useEmailSecond();

  const callback = useCallback(
    (second: number) => {
      dispatch(updateEmailSecond(second));
    },
    [dispatch],
  );

  return useMemo(() => [emailSecond, callback], [emailSecond, callback]);
}

export function useShowGetCode() {
  return useAppSelector((state) => state.priceAlerts.showGetCode);
}

export function useShowGetCodeManager(): [boolean, (show: boolean) => void] {
  const dispatch = useAppDispatch();
  const showGetCode = useShowGetCode();

  const callback = useCallback(
    (showGetCode: boolean) => {
      dispatch(updateShowGetCode(showGetCode));
    },
    [dispatch],
  );

  return useMemo(() => [showGetCode, callback], [showGetCode, callback]);
}
