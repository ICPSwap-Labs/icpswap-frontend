import { useState, useEffect, useMemo } from "react";

export function useIntervalFetch<T>(
  call: (() => Promise<T | undefined>) | undefined,
  force: boolean | number = false,
  interval = 5000,
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    async function _call() {
      if (call) {
        const result = await call();
        setData(result);
      }
    }

    _call();
  }, [tick, call, force]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (call) {
        setTick((prevState) => prevState + 1);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval, call]);

  return useMemo(() => data, [data]);
}
