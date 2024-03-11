import { useCallback } from "react";
import { useStepManager, useUpdateCallStep, useCloseAllSteps } from "store/steps/hooks";

export type StepCallback = () => Promise<boolean | "skip">;

let stepKey = 0;

export function newStepKey() {
  stepKey++;
  return stepKey.toString();
}

export function useStepCalls() {
  const { open } = useStepManager();
  const updateCallStep = useUpdateCallStep();

  return useCallback(
    (calls: StepCallback[] | undefined, key: string) => {
      let curr = 0;
      let err: number | undefined = undefined;

      const fn = async (step: number) => {
        if (!calls) calls = [];
        for (let i = step; i < calls.length; i++) {
          curr = i;
          updateCallStep(key, curr, err);
          const result = await calls[i]();
          if (result === false) {
            err = i;
            updateCallStep(key, curr, err);
            return false;
          }
          curr = i + 1;
          updateCallStep(key, curr, err);
        }

        return true;
      };

      const call = async () => {
        reset();

        open(key);

        return await fn(0);
      };

      const retry = async () => {
        return await fn(err ?? 0);
      };

      const reset = () => {
        curr = 0;
        err = undefined;
      };

      return { call, reset, retry, currentStep: curr, errorStep: err };
    },
    [open, updateCallStep],
  );
}

export function useCloseStep() {
  const { close } = useStepManager();

  return useCallback(
    (key?: string) => {
      close(key);
    },
    [close],
  );
}

export { useCloseAllSteps };
