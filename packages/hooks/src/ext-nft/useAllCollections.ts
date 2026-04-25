import type { EXTCollection } from "@icpswap/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useEXTAllCollections(): UseQueryResult<EXTCollection[] | undefined, Error> {
  return useQuery({
    queryKey: ["useEXTAllCollections"],
    queryFn: async () => {
      const response = await fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/collections").catch(
        () => undefined,
      );

      if (!response) return undefined;

      return (await response.json()) as EXTCollection[];
    },
  });
}
