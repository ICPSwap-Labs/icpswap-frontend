import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback } from "react";
import store from "store/index";
import { updateCallIndex, updateCallKeys } from "./actions";

export function useCallIndex() {
  return useAppSelector((state) => state.call.callIndex);
}

export function getCallIndex() {
  const { call } = store.getState();
  return call.callIndex;
}

export function useCallIndexManager(): [number, () => void] {
  const callIndex = useCallIndex();
  const dispatch = useAppDispatch();

  const _updateCallIndex = useCallback(() => {
    dispatch(updateCallIndex());
  }, [callIndex, dispatch]);

  return [callIndex, _updateCallIndex];
}

export function getCallResult(callKey: string) {
  const { call } = store.getState();
  return call.callResults[callKey];
}

export function useCallResult(callKey: string) {
  return useAppSelector((state) => state.call.callResults)[callKey];
}

export function useCallKeyIndex(callKey: string) {
  return useAppSelector((state) => state.call.callKeys)[callKey];
}

export function useCallKeysIndexManager(callKey: string): [number, ({ callIndex }: { callIndex: number }) => void] {
  const callKeyIndex = useCallKeyIndex(callKey);
  const dispatch = useAppDispatch();

  const _updateCallKeyIndex = useCallback(
    ({ callIndex }: { callIndex: number }) => {
      dispatch(updateCallKeys({ callKey, callIndex }));
    },
    [callKeyIndex, dispatch],
  );

  return [callKeyIndex, _updateCallKeyIndex];
}
