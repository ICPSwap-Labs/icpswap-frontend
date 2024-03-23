import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { sns_swap } from "@icpswap/actor";
import type { GetSaleParametersResponse } from "@icpswap/types";
import { useCallback } from "react";

export async function getSwapSaleParameters(swap_id: string) {
  const result = resultFormat<GetSaleParametersResponse>(
    await (await sns_swap(swap_id)).get_sale_parameters({})
  ).data;

  return result ? result.params[0] : undefined;
}

export function useSwapSaleParameters(
  swap_id: string | undefined,
  reload?: number | boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!swap_id) return undefined;
      return await getSwapSaleParameters(swap_id);
    }, [swap_id]),
    reload
  );
}
