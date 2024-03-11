import { useCallback } from "react";
import { PaginationResult } from "types/global";
import { pageArgsFormat, sleep } from "@icpswap/utils";

export function usePaginationAllDataCallback<T>(
  callback: (offset: number, limit: number) => Promise<PaginationResult<T> | undefined>,
  limit: number,
  onSuccess: (data: T[]) => void,
) {
  return useCallback(async () => {
    const fetch = async (offset: number, limit: number) => {
      return await callback(offset, limit).then((result) => {
        if (result?.content && result?.content.length > 0) {
          return result.content;
        }
        return [];
      });
    };

    const fetchDone = async (_list: { [k: string]: T[] }) => {
      let data: T[] = [];
      Object.keys(_list).forEach((key) => {
        data = data.concat(_list[key]);
      });

      onSuccess(data);
    };

    const { totalElements, content: initialList } = (await callback(0, limit)) ?? {
      totalElements: 0,
      content: [] as T[],
    };

    if (Number(totalElements) <= limit) {
      onSuccess(initialList);
    } else if (Number(totalElements) !== 0) {
      const num = Number(totalElements) % limit;
      const totalPage = num === 0 ? Number(totalElements) / limit : parseInt(String(Number(totalElements) / limit)) + 1;

      let _list: { [k: string]: T[] } = {
        0: initialList,
      };

      for (let i = 1; i < totalPage; i++) {
        const [offset] = pageArgsFormat(i + 1, limit);

        if (totalPage % 80 === 0) {
          await sleep(2000);
        }

        const _fetch = () => {
          fetch(offset, limit)
            .then(async (content) => {
              if (content && content.length > 0) {
                _list[`${i + 1}`] = content;
                console.log(
                  `%cFetch ${Object.keys(_list).length}, total: ${totalPage}, rest: ${
                    totalPage - Object.keys(_list).length
                  }`,
                  "color: #5669dc",
                );
                if (Object.keys(_list).length === totalPage) {
                  await fetchDone(_list);
                }
              }
            })
            .catch((error) => {
              console.log(`%cRetry fetch page ${i}`, "color: #F2994A");
              _fetch();
            });
        };

        _fetch();
      }
    } else {
      onSuccess([] as T[]);
    }
  }, [callback, limit, onSuccess]);
}

export function useAllDataCallback<T>(
  callback: (offset: number, limit: number) => Promise<T[] | undefined>,
  onSuccess: (data: T[]) => void,
) {
  return useCallback(async () => {
    let limit = 1500;

    const fetch = async (offset: number, limit: number) => {
      return await callback(offset, limit).then((data) => {
        if (data && data.length > 0) return data;
        return [];
      });
    };

    const fetchDone = async (_list: { [k: string]: T[] }) => {
      let data: T[] = [];
      Object.keys(_list).forEach((key) => {
        data = data.concat(_list[key]);
      });

      onSuccess(data);
    };

    let page = 1;
    let _list: { [k: string]: T[] } = {};

    const _fetch = async () => {
      const [offset] = pageArgsFormat(page, limit);
      const content = await fetch(offset, limit);

      _list[`${page}`] = content;
      console.log(`%cFetch ${page}`, "color: #5669dc");
      page++;
      if (content.length < limit) {
        await fetchDone(_list);
      } else {
        _fetch();
      }
    };

    _fetch().catch(() => {
      console.log(`%cRetry fetch page ${page + 1}`, "color: #F2994A");
      _fetch();
    });
  }, [callback, onSuccess]);
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
