import { useMemo } from "react";
import { useStateSnsAllTokensInfo } from "store/sns/hooks";
import { nnsEqualToGovernance } from "utils/sns/utils";

export function useSnsTokenInfoByGovernance(governanceId: string | undefined) {
  const allSnsTokensInfo = useStateSnsAllTokensInfo();

  return useMemo(() => {
    if (!governanceId) return undefined;
    return allSnsTokensInfo.find((nns) => nnsEqualToGovernance(nns, governanceId));
  }, [governanceId, allSnsTokensInfo]);
}
