import type { Token } from "@icpswap/swap-sdk";
import { getHarvestSteps } from "components/stake/HarvestSteps";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useStepContentManager } from "store/steps/hooks";

export type HarvestCallsStepArgs = {
  token: Token;
  poolId: string;
};

export function useHarvestSteps() {
  const { t } = useTranslation();
  const initialAndUpdateDetails = useStepContentManager();

  return useCallback(
    (key: string, { token }: HarvestCallsStepArgs) => {
      const content = getHarvestSteps({
        token,
        key,
      });

      initialAndUpdateDetails(String(key), {
        content,
        title: t("stake.harvest.details"),
      });
    },
    [initialAndUpdateDetails, t],
  );
}
