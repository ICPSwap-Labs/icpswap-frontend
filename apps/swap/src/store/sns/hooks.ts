import { useEffect, useMemo } from "react";
import { AppState } from "store/index";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useNnsTokensInfo } from "@icpswap/hooks";

import { updateSnsAllTokensInfo } from "./actions";

export function useStateSnsAllTokensInfo() {
  return useAppSelector((state: AppState) => state.sns.snsAllTokensInfo);
}

export function useFetchSnsAllTokensInfo() {
  const dispatch = useAppDispatch();
  const allTokensInfo = useStateSnsAllTokensInfo();
  const { result: nnsTokens, loading } = useNnsTokensInfo();

  useEffect(() => {
    async function call() {
      if (nnsTokens) {
        const __nnsTokens = nnsTokens.sort((a, b) => {
          if (a.index < b.index) return -1;
          if (a.index > b.index) return 1;
          return 0;
        });

        dispatch(updateSnsAllTokensInfo(__nnsTokens));
      }
    }

    call();
  }, [nnsTokens]);

  return useMemo(() => ({ loading, result: allTokensInfo }), [loading, allTokensInfo]);
}
