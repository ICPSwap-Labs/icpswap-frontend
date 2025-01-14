import { IcExplorerResult } from "@icpswap/types";
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

  const result = (await fetch_result.json()) as IcExplorerResult<T> | undefined;

  if (result.statusCode === 600) return resultFormat<T>(result.data);

  return undefined;
}
