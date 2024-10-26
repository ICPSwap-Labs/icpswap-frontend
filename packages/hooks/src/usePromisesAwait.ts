import { splitArr } from "@icpswap/utils";
import { useEffect, useMemo, useState } from "react";

type Call<T> = Promise<T>;

export async function getPromisesAwait<T>(calls: Call<T>[], limit = 100) {
  const __calls = splitArr(calls, limit);

  const result: Array<T[]> = [];

  for (let i = 0; i < __calls.length; i++) {
    const res = await Promise.all(__calls[i]);
    result.push(res);
  }

  return result.flat();
}

export function usePromisesAwait<T>(calls: Call<T>[] | undefined, limit = 100) {
  const [result, setResult] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function call() {
      if (calls) {
        setLoading(true);
        const result = await getPromisesAwait(calls, limit);
        setResult(result);
        setLoading(false);
      }
    }

    call();
  }, [calls, limit]);

  return useMemo(() => ({ loading, result }), [loading, result]);
}
