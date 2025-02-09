import { useCallback } from "react";
import { getHarvestSteps } from "components/stake/HarvestSteps";
import { useStepContentManager } from "store/steps/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export type HarvestCallsStepArgs = {
  token: Token;
  poolId: string;
};

export function useHarvestSteps() {
  const { t } = useTranslation();
  const initialAndUpdateDetails = useStepContentManager();

  return useCallback((key: string, { token }: HarvestCallsStepArgs) => {
    const content = getHarvestSteps({
      token,
      key,
    });

    initialAndUpdateDetails(String(key), {
      content,
      title: t("stake.harvest.details"),
    });
  }, []);
}
