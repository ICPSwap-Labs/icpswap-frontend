import { useCallback, useMemo, ReactNode } from "react";
import { openLoading, closeLoading } from "store/loadingReducer";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useSnackbar } from "components/notistack";
import { ResultStatus } from "types/global";

export enum MessageTypes {
  success = "ok",
  error = "err",
  warning = "warning",
  loading = "loading",
}

export const TipTypes: { [key in MessageTypes]: "success" | "error" | "warning" | "loading" } = {
  [MessageTypes.success]: "success",
  [MessageTypes.error]: "error",
  [MessageTypes.warning]: "warning",
  [MessageTypes.loading]: "loading",
};

export const TIP_ERROR = MessageTypes.error;
export const TIP_SUCCESS = MessageTypes.success;
export const TIP_LOADING = MessageTypes.loading;

export type TIP_KEY = string | undefined | number;

export type TIP_OPTIONS = { [key: string]: any };

export function useTips(): [
  (message: ReactNode, type: MessageTypes | ResultStatus, options?: TIP_OPTIONS) => TIP_KEY,
  (key: string | undefined | number) => void,
] {
  const dispatch = useAppDispatch();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const open = useCallback(
    (message: ReactNode, type: MessageTypes | ResultStatus, options?: TIP_OPTIONS) => {
      return enqueueSnackbar(message, {
        variant: type in ResultStatus ? (type === ResultStatus.OK ? TipTypes.ok : TipTypes.err) : TipTypes[type],
        ...(type === MessageTypes.loading ? { persist: true } : {}),
        ...(options ?? {}),
      });
    },
    [dispatch],
  );

  const close = useCallback(
    (messageKey: TIP_KEY) => {
      closeSnackbar(messageKey);
    },
    [dispatch],
  );

  return useMemo(() => [open, close], [open, close]);
}

export function useSuccessTip(): [(message: ReactNode, options?: TIP_OPTIONS) => TIP_KEY, (key: TIP_KEY) => void] {
  const [openCallback, closeCallback] = useTips();

  const open = useCallback(
    (message, options?: TIP_OPTIONS) => {
      return openCallback(message, TIP_SUCCESS, options);
    },
    [openCallback],
  );

  const close = useCallback(
    (key: TIP_KEY) => {
      closeCallback(key);
    },
    [closeCallback],
  );

  return useMemo(() => [open, close], [open, close]);
}

export function useErrorTip(): [(message: ReactNode, options?: TIP_OPTIONS) => TIP_KEY, (key: TIP_KEY) => void] {
  const [openCallback, closeCallback] = useTips();

  const open = useCallback(
    (message: ReactNode, options?: TIP_OPTIONS) => {
      return openCallback(message, TIP_ERROR, options);
    },
    [openCallback],
  );

  const close = useCallback(
    (key: TIP_KEY) => {
      closeCallback(key);
    },
    [closeCallback],
  );

  return useMemo(() => [open, close], [open, close]);
}

export function useLoadingTip(): [(message: string, options?: TIP_OPTIONS) => TIP_KEY, (key: TIP_KEY) => void] {
  const [openCallback, closeCallback] = useTips();

  const open = useCallback(
    (message: string, options?: TIP_OPTIONS) => {
      return openCallback(message, TIP_LOADING, { ...(options ?? {}) });
    },
    [openCallback],
  );

  const close = useCallback(
    (key: TIP_KEY) => {
      closeCallback(key);
    },
    [closeCallback],
  );

  return useMemo(() => [open, close], [open, close]);
}

export function useFullscreenLoading(): [() => void, () => void, boolean] {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.loading.open);

  const open = useCallback(() => {
    dispatch(openLoading());
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(closeLoading());
  }, [dispatch]);

  return useMemo(() => [open, close, isOpen], [open, close, isOpen]);
}
