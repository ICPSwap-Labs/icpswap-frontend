import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { open, close, updateStepDetails, updateKey, closeAll, updateData } from "./actions";
import { StepDetails } from "./state";
import store from "../index";

export function getStepDetails(key: string) {
  return store.getState().step.steps[key];
}

export function useCurrKey() {
  return useAppSelector((state) => state.step.key);
}

export function useUpdateKey() {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(updateKey());
  }, [dispatch]);
}

export function useStepManager() {
  const dispatch = useAppDispatch();

  const openCall = useCallback(
    (key: string | undefined) => {
      dispatch(open(key));
    },
    [dispatch],
  );

  const closeCall = useCallback(
    (key: string | undefined) => {
      dispatch(close(key));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      open: openCall,
      close: closeCall,
    }),
    [openCall, closeCall],
  );
}

export function useCloseAllSteps() {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(closeAll());
  }, [dispatch]);
}

export function useStepContentManager() {
  const dispatch = useAppDispatch();
  const { close } = useStepManager();

  return useCallback(
    (key: string, step: StepDetails) => {
      const prevStep = getStepDetails(key) ?? {};

      dispatch(
        updateStepDetails({
          key,
          value: {
            ...step,
            activeStep: prevStep.activeStep ?? 0,
            errorStep: prevStep.errorStep,
            onClose: () => close(key),
          },
        }),
      );
    },
    [dispatch, close],
  );
}

export function useUpdateCallStep() {
  const dispatch = useAppDispatch();

  return useCallback(
    (key: string, activeStep: number, errorStep: number | undefined) => {
      const prevStep = getStepDetails(key) ?? {};

      dispatch(updateStepDetails({ key, value: { ...prevStep, activeStep, errorStep } }));
    },
    [dispatch],
  );
}

export function useOpenedSteps() {
  return useAppSelector((state) => state.step.opened);
}

export function useStepDetails(key: string) {
  return useAppSelector((state) => state.step.steps[key]);
}

export function useStepData<T>(key: string) {
  return useAppSelector((state) => state.step.data[key]) as T;
}

export function getStepData<T>(key: string) {
  return store.getState().step.data[key] as T;
}

export function useUpdateStepData() {
  const dispatch = useAppDispatch();

  return useCallback(
    (key: string, data: any) => {
      dispatch(updateData({ key, data }));
    },
    [dispatch],
  );
}
