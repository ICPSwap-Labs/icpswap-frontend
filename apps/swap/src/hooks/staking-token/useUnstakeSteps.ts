import type { Token } from "@icpswap/swap-sdk";
import { getUnstakeSteps } from "components/stake/UnstakeSteps";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useStepContentManager } from "store/steps/hooks";

export type UnstakeCallsStepArgs = {
  token: Token;
  amount: bigint;
  poolId: string;
  rewardToken: Token;
};

export function useUnstakeSteps() {
  const { t } = useTranslation();
  const initialAndUpdateDetails = useStepContentManager();

  return useCallback((key: string, { token, amount, rewardToken }: UnstakeCallsStepArgs) => {
    const content = getUnstakeSteps({
      token,
      amount: amount.toString(),
      rewardToken,
      key,
    });

    initialAndUpdateDetails(String(key), {
      content,
      title: t("stake.unstake.details"),
    });
  }, []);
}
