import { useCallback } from "react";
import { t } from "@lingui/macro";
import { getHarvestSteps } from "components/stake/HarvestSteps";
import { useStepContentManager } from "store/steps/hooks";
import { Token } from "@icpswap/swap-sdk";

export type HarvestCallsStepArgs = {
  token: Token;
  poolId: string;
};

export function useHarvestSteps() {
  const initialAndUpdateDetails = useStepContentManager();

  return useCallback((key: string, { token }: HarvestCallsStepArgs) => {
    const content = getHarvestSteps({
      token,
      key,
    });

    initialAndUpdateDetails(String(key), {
      content,
      title: t`Harvest Details`,
    });
  }, []);
}
