import { exchangeRate } from "@icpswap/actor";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { parseTokenAmount } from "@icpswap/utils";

export async function getExchangeRates() {
  return await (await exchangeRate()).get_exchange_rates();
}

export function useExchangeRates(): UseQueryResult<Awaited<ReturnType<typeof getExchangeRates>>, Error> {
  return useQuery({
    queryKey: ["useExchangeRates"],
    queryFn: async () => {
      return await getExchangeRates();
    },
  });
}

export async function getExchangeRate(pair: string) {
  return await (await exchangeRate()).get_exchange_rate(pair);
}

export function useExchangeRate(
  pair: string | undefined,
): UseQueryResult<Awaited<ReturnType<typeof getExchangeRate>> | undefined, Error> {
  return useQuery({
    queryKey: ["useExchangeRate", pair],
    queryFn: async () => {
      return await getExchangeRate(pair!);
    },
    enabled: !!pair,
  });
}

export async function getXDR2USD() {
  const result = await getExchangeRate("f_USD-f_XDR");
  return parseTokenAmount(result.rate, result.decimals).toString();
}

export function useXDR2USD(): UseQueryResult<string | undefined, Error> {
  return useQuery({
    queryKey: ["useXDR2USD"],
    queryFn: async () => {
      return await getXDR2USD();
    },
  });
}
