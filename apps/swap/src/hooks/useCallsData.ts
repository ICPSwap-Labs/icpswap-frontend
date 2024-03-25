import { useState, useMemo, useEffect, useRef } from "react";
import type { ApiResult } from "@icpswap/types";
import { useCallKeysIndexManager, useUpdateCallResult, useCallResult, getCallIndex } from "store/call/hooks";

export type Call<T> = () => Promise<ApiResult<T>>;

let stateCallIndex = 0;

export function useStateCallsData<T>(fn: Call<T>, key: string, valid: boolean, reload?: boolean, useOldData?: boolean) {
  const callResults = useCallResult(key) ?? {};

  const updateCallResult = useUpdateCallResult();

  const [loading, setLoading] = useState(false);
  const [callKeyIndex, updateCallKeyIndex] = useCallKeysIndexManager(key);

  useEffect(() => {
    if (fn && valid !== false) {
      setLoading(true);

      stateCallIndex++;
      const index = stateCallIndex;

      updateCallKeyIndex({ callIndex: index });

      fn().then((result) => {
        const stateIndex = getCallIndex(key);

        if (stateIndex === index) {
          updateCallResult(key, { ...callResults, [index]: result });
          setLoading(false);
        }
      });
    }
  }, [fn, valid, reload]);

  return useMemo(() => {
    const result = (
      callResults[callKeyIndex] ? callResults[callKeyIndex] : useOldData ? callResults[callKeyIndex - 1] : undefined
    ) as T | undefined;

    return {
      result,
      loading,
    };
  }, [callResults, loading, callKeyIndex]);
}

export function useLatestDataCall<T>(fn: Call<T>, reload?: number | string | boolean) {
  const [loading, setLoading] = useState(false);

  const indexRef = useRef<number>(0);
  const resultsRef = useRef<{ [key: string]: T | undefined }>({});

  useEffect(() => {
    if (fn) {
      setLoading(true);

      indexRef.current += 1;
      const index = indexRef.current;

      fn().then((result) => {
        resultsRef.current = {
          ...resultsRef.current,
          [String(index)]: result as T,
        };

        setLoading(false);
      });
    }
  }, [fn, reload]);

  return useMemo(() => {
    return {
      result: resultsRef.current[indexRef.current] as T | undefined,
      loading,
    };
  }, [resultsRef.current, indexRef.current, loading]);
}
