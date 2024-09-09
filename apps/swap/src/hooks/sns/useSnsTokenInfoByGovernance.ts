import { useMemo } from "react";
import { useStateSnsAllTokensInfo } from "store/sns/hooks";

export function useSnsTokenInfoByGovernance(governanceId: string | undefined) {
  const allSnsTokensInfo = useStateSnsAllTokensInfo();

  return useMemo(() => {
    return allSnsTokensInfo.find((e) => e.canister_ids.governance_canister_id === governanceId);
  }, [governanceId, allSnsTokensInfo]);
}
