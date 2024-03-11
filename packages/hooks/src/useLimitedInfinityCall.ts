import { useState, useMemo, useEffect } from "react";

export function useLimitedInfinityCall<T>(
  callback: (offset: number, limit: number) => Promise<T[] | undefined>,
  limit: number,
  reload: boolean = false
) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T[]>([]);

  useEffect(() => {
    async function call() {
      setLoading(true);
      const result = await getLimitedInfinityCall(callback, limit, 5);
      setList(result);
    }

    call();
  }, [reload, callback, limit]);

  return useMemo(
    () => ({
      result: list,
      loading,
    }),
    [list, loading]
  );
}

type Callback<T> = (offset: number, limit: number) => Promise<T[] | undefined>;

export async function fetch_data<T>(
  start: number,
  limit: number,
  callback: Callback<T>
) {
  const result = await callback(start, limit);
  console.log(`%c${start} ${limit} fetch done`, "color: #5669dc");
  return result;
}

/**
 * @description getLimitedInfinityCall
 * @param callback The call to fetch the data
 * @param limit The data length in each call
 * @param call_rounds Number of call
 */
export async function getLimitedInfinityCall<T>(
  callback: (offset: number, limit: number) => Promise<T[] | undefined>,
  limit: number,
  call_rounds: number = 10,
  start_index?: number
) {
  let data: T[] = [];
  let fetch_index: number = 0;
  let fetch_done: boolean = false;

  const fetch = async (index: number) => {
    fetch_index = fetch_index + 1;

    await Promise.all(
      Array.from({ length: call_rounds }, (_, i) => i).map(
        async (call_index) => {
          const start =
            (start_index ?? 0) +
            call_index * limit +
            index * limit * call_rounds;

          const result = await fetch_data(start, limit, callback);

          console.log("result:", result);

          console.log(`start: ${start}, result: ${result?.length}`);

          if (!result) {
          } else {
            data = data.concat(result);

            if (result.length < limit) {
              fetch_done = true;
            }
          }

          return undefined;
        }
      )
    );

    if (!fetch_done) {
      await fetch(fetch_index);
    }
  };

  await fetch(fetch_index);

  return data;
}
