import { useCallback } from "react";
import { EXTCollection } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export function useEXTAllCollections() {
  return useCallsData(
    useCallback(async () => {
      const response = await fetch("https://us-central1-entrepot-api.cloudfunctions.net/api/collections").catch(
        () => undefined,
      );

      if (!response) return undefined;

      return (await response.json()) as EXTCollection[];
    }, []),
  );
}
