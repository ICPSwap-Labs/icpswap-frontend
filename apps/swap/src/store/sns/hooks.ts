import { useEffect, useMemo, useState } from "react";
import { AppState } from "store/index";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getSnsAllTokensInfo } from "@icpswap/hooks";
import { updateSnsAllTokensInfo } from "./actions";

export function useStateSnsAllTokensInfo() {
  return useAppSelector((state: AppState) => state.sns.snsAllTokensInfo);
}

export function useFetchSnsAllTokensInfo() {
  const dispatch = useAppDispatch();
  const allTokensInfo = useStateSnsAllTokensInfo();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function call() {
      if (allTokensInfo.length > 0 || loading) return;

      setLoading(true);
      const data = await getSnsAllTokensInfo();
      dispatch(updateSnsAllTokensInfo(data));
      setLoading(false);
    }

    call();
  }, [allTokensInfo, dispatch]);

  return useMemo(() => ({ loading, result: allTokensInfo }), [loading, allTokensInfo]);
}
