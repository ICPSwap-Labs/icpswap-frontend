import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback, useMemo } from "react";
import { updateCallKeys, updateCallResult } from "./actions";
import store from "store/index";

export function useCallResult(callKey: string) {
  return useAppSelector((state) => state.call.callResults)[callKey];
}

export function useUpdateCallResult() {
  const dispatch = useAppDispatch();

  return useCallback(
    (callKey: string, result: any) => {
      dispatch(updateCallResult({ callKey, result }));
    },
    [dispatch],
  );
}

export function useCallAllIndex() {
  return useAppSelector((state) => state.call.callKeys);
}

export function getCallIndex(key: string) {
  return store.getState().call.callKeys[key];
}

export function useCallKeysIndexManager(callKey: string): [number, ({ callIndex }: { callIndex: number }) => void] {
  const callAllIndex = useCallAllIndex();
  const dispatch = useAppDispatch();

  const _updateCallKeyIndex = useCallback(
    ({ callIndex }: { callIndex: number }) => {
      dispatch(updateCallKeys({ callKey, callIndex }));
    },
    [callKey, dispatch],
  );

  return useMemo(() => [callAllIndex[callKey], _updateCallKeyIndex], [callKey, _updateCallKeyIndex, callAllIndex]);
}
