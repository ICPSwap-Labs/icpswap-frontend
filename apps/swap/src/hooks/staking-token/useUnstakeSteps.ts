import { useCallback } from "react";
import { t } from "@lingui/macro";
import { getUnstakeSteps } from "components/stake/UnstakeSteps";
import { useStepContentManager } from "store/steps/hooks";
import { Token } from "@icpswap/swap-sdk";

export type UnstakeCallsStepArgs = {
  token: Token;
  amount: bigint;
  poolId: string;
  rewardToken: Token;
};

export function useUnstakeSteps() {
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
      title: t`Unstake Details`,
    });
  }, []);
}
