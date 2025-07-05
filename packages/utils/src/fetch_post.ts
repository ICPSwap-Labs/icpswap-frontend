import { IcpSwapAPIResult, StatusResult } from "@icpswap/types";
import { ICPSWAP_API } from "@icpswap/constants";

import { resultFormat } from "./resultFormat";
import { nonUndefinedOrNull } from "./isUndefinedOrNull";

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

  if (result.code === 200) return resultFormat<T>(result.data);

  return undefined;
}

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

  if (result.code === 200) return resultFormat<T>(result.data);

  return undefined;
}

export async function icpswap_fetch_post<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  return await fetch_post<T>(`${ICPSWAP_API}${api}`, data);
}

export async function icpswap_info_fetch_post<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  return await fetch_post<T>(`${ICPSWAP_API}/info${api}`, data);
}

export async function icpswap_info_fetch_get<T>(api: string, data?: any): Promise<StatusResult<T> | undefined> {
  return await fetch_get<T>(`${ICPSWAP_API}/info${api}`, data);
}
