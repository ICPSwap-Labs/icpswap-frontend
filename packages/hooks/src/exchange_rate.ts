import { useCallback } from "react";
import { exchangeRate } from "@icpswap/actor";
import { useCallsData } from "./useCallData";
import { parseTokenAmount } from "@icpswap/utils";

export async function getExchangeRates() {
  return await (await exchangeRate()).get_exchange_rates();
}

export function useExchangeRates() {
  return useCallsData(
    useCallback(async () => {
      return await getExchangeRates();
    }, [])
  );
}

export async function getExchangeRate(pair: string) {
  return await (await exchangeRate()).get_exchange_rate(pair);
}

export function useExchangeRate(pair: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      return await getExchangeRate(pair!);
    }, [pair]),
    !!pair
  );
}

export async function getXDR2USD() {
  const result = await getExchangeRate("f_USD-f_XDR");
  return parseTokenAmount(result.rate, result.decimals).toString();
}

export function useXDR2USD() {
  return useCallsData(
    useCallback(async () => {
      return await getXDR2USD();
    }, [])
  );
}
