import { IcpSwapAPIResult } from "@icpswap/types";
import { ICPSWAP_API } from "@icpswap/constants";

import { resultFormat } from "./resultFormat";

export async function fetch_post<T>(api: string, data?: any) {
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

export async function icpswap_fetch_post<T>(api: string, data?: any) {
  return fetch_post<T>(`${ICPSWAP_API}${api}`, data);
}
