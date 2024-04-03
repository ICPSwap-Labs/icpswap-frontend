import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "./useCallData";

type PriceResult = [number, number];

type ICPPriceResult = {
  icp_xdr_conversion_rates: PriceResult[];
};

export async function get100ICPPriceInfo() {
  const now = new Date().getTime();
  const start = now - 10 * 24 * 60 * 60 * 1000;

  const fetch_result = await fetch(
    `https://ic-api.internetcomputer.org/api/v3/icp-xdr-conversion-rates?start=${parseInt(
      (start / 1000).toString(),
      10,
    )}&end=${parseInt((now / 1000).toString(), 10)}&step=600`,
  ).catch(() => undefined);

  if (!fetch_result) return undefined;

  const result = (await fetch_result.json()) as { icp_xdr_conversion_rates: ICPPriceResult };

  return resultFormat<PriceResult[]>(result.icp_xdr_conversion_rates).data;
}

export function use100ICPPriceInfo() {
  return useCallsData(
    useCallback(async () => {
      return await get100ICPPriceInfo();
    }, []),
  );
}
