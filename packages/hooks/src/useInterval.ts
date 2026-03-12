import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

interface UseIntervalProps<T> {
  callback: (() => Promise<T | undefined>) | (() => void) | undefined;
  interval?: number;
  force?: boolean | number;
}

export function useInterval<T>({ callback, interval, force }: UseIntervalProps<T>): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useQuery({
    queryKey: ["useInterval", force],
    queryFn: async () => {
      const result = await callback();
      if (result) {
        setData(result);
      }

      return result;
    },
    refetchInterval: interval,
  });

  return useMemo(() => data, [data]);
}
