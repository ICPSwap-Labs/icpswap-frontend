import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { ApiResult, CallResult, PaginationResult } from "@icpswap/types";
import { pageArgsFormat, sleep } from "@icpswap/utils";

export type Call<T> = () => Promise<ApiResult<T>>;

export function useCallsData<T>(fn: Call<T>, reload?: number | string | boolean | null): CallResult<T> {
  const result = useRef<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fn) {
      result.current = undefined;
      setLoading(true);
      fn().then((res) => {
        result.current = res;
        setLoading(false);
      });
    }
  }, [fn, reload]);

  return useMemo(() => {
    return {
      result: result.current,
      loading,
    };
  }, [result.current, loading]);
}

export function usePaginationAllData<T>(
  callback: (offset: number, limit: number) => Promise<PaginationResult<T> | undefined>,
  limit: number,
  reload = false,
) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T[]>([]);

  const fetch = async (offset: number, limit: number) => {
    return await callback(offset, limit).then((result) => {
      if (result) {
        const content = result.content;
        if (content && content.length > 0) {
          return content;
        }
        return [];
      }
      return [];
    });
  };

  const fetchDone = async (_list: { [k: string]: T[] }) => {
    let data: T[] = [];
    Object.keys(_list).forEach((key) => {
      data = data.concat(_list[key]);
    });
    setList(data);
  };

  useEffect(() => {
    async function getTotalElements() {
      if (callback) {
        const result = await callback(0, 1);
        if (result) {
          return result.totalElements;
        }
        return BigInt(0);
      }

      return BigInt(0);
    }

    async function call() {
      const totalElements = await getTotalElements();

      if (Number(totalElements) !== 0) {
        const num = Number(totalElements) % limit;
        const totalPage =
          num === 0 ? Number(totalElements) / limit : parseInt(String(Number(totalElements) / limit)) + 1;

        setLoading(true);

        const _list: { [k: string]: T[] } = {};

        for (let i = 0; i < totalPage; i++) {
          const [offset] = pageArgsFormat(i + 1, limit);

          if (totalPage % 80 === 0) {
            await sleep(2000);
          }

          const _fetch = () => {
            fetch(offset, limit)
              .then(async (content) => {
                if (content && content.length > 0) {
                  _list[`${i + 1}`] = content;
                  if (Object.keys(_list).length === totalPage) {
                    await fetchDone(_list);
                    setLoading(false);
                  }
                }
              })
              .catch((error) => {
                console.error(error);
                _fetch();
              });
          };

          _fetch();
        }
      } else {
        setList([]);
        setLoading(false);
      }
    }

    call();
  }, [reload, callback]);

  return useMemo(
    () => ({
      result: list,
      loading,
    }),
    [list, loading],
  );
}

export async function getPaginationAllData<T>(
  callback: (offset: number, limit: number) => Promise<PaginationResult<T> | undefined>,
  limit: number,
) {
  const fetch = async (offset: number, limit: number) => {
    return await callback(offset, limit);
  };

  const _result = await fetch(0, 1);
  const totalElements = Number(_result?.totalElements ?? 0);
  const totalPage =
    totalElements % limit === 0 ? parseInt(String(totalElements / limit)) : parseInt(String(totalElements / limit)) + 1;

  const promise: Promise<PaginationResult<T> | undefined>[] = [];

  for (let i = 1; i < totalPage + 1; i++) {
    const [offset] = pageArgsFormat(i, limit);
    promise.push(fetch(offset, limit));
  }

  const result = await Promise.all(promise);

  return result
    .filter((res) => !!res)
    .reduce((prev, curr) => {
      return prev.concat(curr?.content ?? []);
    }, [] as T[]);
}

export async function getPaginationAllDataLimit<T>(
  callback: (offset: number, limit: number) => Promise<PaginationResult<T> | undefined>,
  limit: number,
) {
  const fetch = async (offset: number, limit: number) => {
    return await callback(offset, limit);
  };

  const __result = await fetch(0, limit);
  const totalElements = Number(__result?.totalElements ?? 0);
  const totalPage =
    totalElements % limit === 0 ? parseInt(String(totalElements / limit)) : parseInt(String(totalElements / limit)) + 1;

  const promise: Promise<PaginationResult<T> | undefined>[] = [];

  for (let i = 2; i < totalPage + 1; i++) {
    const [offset] = pageArgsFormat(i, limit);
    promise.push(fetch(offset, limit));
  }

  const result = await Promise.all(promise);

  return result
    .filter((res) => !!res)
    .reduce(
      (prev, curr) => {
        return prev.concat(curr?.content ?? []);
      },
      __result.content ?? ([] as T[]),
    );
}

export function useLoadingCallData<T>(call: () => Promise<T>) {
  const [loading, setLoading] = useState(false);

  const __call = useCallback(async () => {
    setLoading(true);
    const result = await call();
    setLoading(false);
    return result;
  }, [call]);

  return useMemo(() => {
    return {
      callback: __call,
      loading,
    };
  }, [__call, loading]);
}
