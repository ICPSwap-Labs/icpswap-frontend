import { ICPSWAP_API } from "@icpswap/constants";
import { type IcpSwapAPIResult, ResultStatus, type StatusResult } from "@icpswap/types";

import { isUndefinedOrNull, nonUndefinedOrNull } from "./isUndefinedOrNull";

/** Maps raw `{ code, data, message }` API JSON into {@link StatusResult}. */
function resultFormat<T>(result: IcpSwapAPIResult<T> | undefined) {
  if (isUndefinedOrNull(result)) {
    return {
      status: ResultStatus.ERROR,
      data: undefined,
      message: "Something went wrong",
    };
  }

  if (result.code === 200) {
    return {
      status: ResultStatus.OK,
      data: result.data,
      message: "",
    };
  }

  return {
    status: ResultStatus.ERROR,
    data: result.data,
    message: result.message,
  };
}

/** POST JSON to `api` and return a normalized {@link StatusResult}, or `undefined` on network failure. */
export async function fetch_post<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  const fetch_result = await fetch(api, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch(() => undefined);

  if (!fetch_result) return undefined;

  const result = (await fetch_result.json()) as IcpSwapAPIResult<T> | undefined;

  return resultFormat<T>(result);
}

/** GET JSON from `api` with optional query params (nullish values omitted). */
export async function fetch_get<T>(api: string, data?: any) {
  const __data = {};

  if (data) {
    Object.keys(data).forEach((key) => {
      if (nonUndefinedOrNull(data[key])) {
        __data[key] = data[key];
      }
    });
  }

  const fetch_result = await fetch(`${api}${data ? `?${new URLSearchParams(__data).toString()}` : ""}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).catch(() => undefined);

  if (!fetch_result) return undefined;

  const result = (await fetch_result.json()) as IcpSwapAPIResult<T> | undefined;

  return resultFormat<T>(result);
}

/** {@link fetch_post} against the ICPSwap API base URL. */
export async function icpswap_fetch_post<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  return await fetch_post<T>(`${ICPSWAP_API}${api}`, data);
}

/** {@link fetch_get} against the ICPSwap API base URL. */
export async function icpswap_fetch_get<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  return await fetch_get<T>(`${ICPSWAP_API}${api}`, data);
}

/** {@link fetch_post} against `ICPSWAP_API/info`. */
export async function icpswap_info_fetch_post<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  return await fetch_post<T>(`${ICPSWAP_API}/info${api}`, data);
}

/** {@link fetch_get} against `ICPSWAP_API/info`. */
export async function icpswap_info_fetch_get<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  return await fetch_get<T>(`${ICPSWAP_API}/info${api}`, data);
}
