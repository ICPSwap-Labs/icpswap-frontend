import { useState, useMemo, useEffect } from "react";
import { pageArgsFormat } from "@icpswap/utils";
import { ApiResult } from "../types/index";

export type Call<T> = () => Promise<ApiResult<T>>;

/**
 * @description getNoLengthPaginationAllData get the pagination data when call has no data length
 * @param callback The call to fetch the data
 * @param limit The data length in each call
 * @param times Number of call
 */
export async function getNoLengthPaginationAllData<T>(
  callback: (offset: number, limit: number) => Promise<T[] | undefined>,
  limit: number,
  times = 5,
) {
  let promise: Promise<T[] | undefined>[] = [];
  let data: T[] = [];
  let fetch_index = 0;

  const fetch = async (index: number) => {
    const start_page = 1 + index * times;
    const end_page = start_page + times - 1;

    for (let i = start_page; i <= end_page; i++) {
      const [offset] = pageArgsFormat(i, limit);
      promise.push(
        callback(offset, limit).catch((err) => {
          console.error(`Failed to fetch: ${i}: ${err}`);
          return [];
        }),
      );
    }

    const result = (await Promise.all(promise)).flat().filter((ele) => !!ele) as T[];
    data = data.concat(result);

    if (result.length === times * limit) {
      fetch_index++;
      promise = [];
      await fetch(fetch_index);
    }
  };

  await fetch(fetch_index);

  return data;
}

export function useNoLengthPaginationAllData<T>(
  callback: (offset: number, limit: number) => Promise<T[] | undefined>,
  limit: number,
  reload = false,
) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T[]>([]);

  useEffect(() => {
    async function call() {
      setLoading(true);
      const result = await getNoLengthPaginationAllData(callback, limit, 5);
      setList(result);
    }

    call();
  }, [reload, callback, limit]);

  return useMemo(
    () => ({
      result: list,
      loading,
    }),
    [list, loading],
  );
}
