import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { PaginationResult } from "@icpswap/types";
import { pageArgsFormat, sleep } from "@icpswap/utils";

const DEFAULT_CONCURRENCY = 5;
const MAX_RETRIES = 3;
const THROTTLE_EVERY_PAGES = 80;
const THROTTLE_MS = 2000;

export interface UsePaginationAllDataResult<T> {
  result: T[];
  loading: boolean;
}

/**
 * Fetches all paginated data by first getting total count, then fetching pages
 * with concurrency limit, stable callback ref, and abort on unmount.
 */
export function usePaginationAllData<T>(
  callback: (offset: number, limit: number) => Promise<PaginationResult<T> | undefined>,
  limit: number,
  reload = false,
): UsePaginationAllDataResult<T> {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T[]>([]);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const aborted = { current: false };
    const run = async () => {
      const cb = callbackRef.current;
      let totalElements: bigint | number;

      try {
        const result = await cb(0, 1);
        totalElements = result?.totalElements ?? BigInt(0);
      } catch {
        totalElements = BigInt(0);
      }

      if (aborted.current) return;
      const total = Number(totalElements);
      if (total === 0) {
        setList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const totalPage = total % limit === 0 ? Math.floor(total / limit) : Math.floor(total / limit) + 1;
      const _list: Record<number, T[]> = {};
      let completed = 0;

      const mergeAndFinish = () => {
        const ordered = Array.from({ length: totalPage }, (_, i) => _list[i + 1] ?? []);
        setList(ordered.flat());
        setLoading(false);
      };

      const fetchPage = async (pageIndex: number, retries = 0): Promise<void> => {
        if (aborted.current) return;
        const [offset] = pageArgsFormat(pageIndex + 1, limit);
        try {
          const result = await cb(offset, limit);
          if (aborted.current) return;
          const content = result?.content ?? [];
          _list[pageIndex + 1] = Array.isArray(content) ? content : [];
        } catch (error) {
          if (aborted.current) return;
          if (retries < MAX_RETRIES) {
            await fetchPage(pageIndex, retries + 1);
            return;
          }
          console.error("[usePaginationAllData] page failed:", pageIndex + 1, error);
          _list[pageIndex + 1] = [];
        }
        completed += 1;
        if (completed === totalPage) mergeAndFinish();
      };

      const runBatch = async (from: number, to: number) => {
        for (let i = from; i < to; i++) {
          if (aborted.current) return;
          if (i > 0 && i % THROTTLE_EVERY_PAGES === 0) {
            await sleep(THROTTLE_MS);
          }
          await fetchPage(i);
        }
      };

      const concurrency = Math.min(DEFAULT_CONCURRENCY, totalPage);
      const batchSize = Math.ceil(totalPage / concurrency);
      const batches: Promise<void>[] = [];
      for (let b = 0; b < concurrency; b++) {
        const start = b * batchSize;
        const end = Math.min(start + batchSize, totalPage);
        if (start < end) batches.push(runBatch(start, end));
      }
      await Promise.all(batches);
    };

    run();
    return () => {
      aborted.current = true;
    };
  }, [reload, limit]);

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
