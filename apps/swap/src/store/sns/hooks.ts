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
  const { data: nnsTokens, isLoading: loading } = useNnsTokensInfo();

  useEffect(() => {
    if (!nnsTokens) return;
    const sorted = [...nnsTokens].sort((a, b) => a.index - b.index);
    dispatch(updateSnsAllTokensInfo(sorted));
  }, [nnsTokens, dispatch]);

  return useMemo(() => ({ loading, result: allTokensInfo }), [loading, allTokensInfo]);
}
