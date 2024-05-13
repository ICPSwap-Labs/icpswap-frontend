import { useState, useEffect, useMemo } from "react";

export function useInterval<T>(
  callback: (() => Promise<T | undefined>) | undefined,
  force = false,
  interval = 5000,
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    async function __callback() {
      if (callback) {
        const result = await callback();
        setData(result);
      }
    }

    __callback();
  }, [tick, callback, force]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (callback) {
        setTick((prevState) => prevState + 1);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval, callback]);

  return useMemo(() => data, [data]);
}
