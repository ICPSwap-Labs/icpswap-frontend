import { useCallback, useMemo } from "react";
import { SNACKBAR_OPEN, SNACKBAR_CLOSE } from "store/snackbarReducer";
import { useAppDispatch } from "store/hooks";

export enum TIP_TYPES {
  ERR = "err",
  OK = "ok",
}

export const TIP_ERROR = TIP_TYPES.ERR;
export const TIP_SUCCESS = TIP_TYPES.OK;

export function useTips(): [(message: string, type: TIP_TYPES) => void, () => void] {
  const dispatch = useAppDispatch();

  const open = useCallback(
    (message: string, type: TIP_TYPES) => {
      if (type === TIP_ERROR) {
        dispatch(SNACKBAR_OPEN({ message, type: "error" }));
      } else {
        dispatch(SNACKBAR_OPEN({ message, type: "success" }));
      }
    },
    [dispatch],
  );

  const close = useCallback(() => {
    dispatch(SNACKBAR_CLOSE());
  }, [dispatch]);

  return useMemo(() => [open, close], [open, close]);
}

export function useSuccessTip(): [(message: string) => void, () => void] {
  const [openCallback, closeCallback] = useTips();

  const open = useCallback(
    (message) => {
      openCallback(message, TIP_SUCCESS);
    },
    [openCallback],
  );

  const close = useCallback(() => {
    closeCallback();
  }, [closeCallback]);

  return useMemo(() => [open, close], [open, close]);
}

export function useErrorTip(): [(message: string) => void, () => void] {
  const [openCallback, closeCallback] = useTips();

  const open = useCallback(
    (message) => {
      openCallback(message, TIP_ERROR);
    },
    [openCallback],
  );

  const close = useCallback(() => {
    closeCallback();
  }, [closeCallback]);

  return useMemo(() => [open, close], [open, close]);
}
