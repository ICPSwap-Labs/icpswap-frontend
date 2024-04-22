import { resultFormat } from "@icpswap/utils";
import { sns_wasm } from "@icpswap/actor";
import type { ListDeployedSnsesResponse } from "@icpswap/candid";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SnsTokensInfo } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getListDeployedSNSs() {
  return resultFormat<ListDeployedSnsesResponse>(await (await sns_wasm()).list_deployed_snses({})).data;
}

export function useListDeployedSNSs() {
  return useCallsData(
    useCallback(async () => {
      return await getListDeployedSNSs();
    }, []),
  );
}

export async function getSnsTokensInfo(page: number): Promise<SnsTokensInfo[] | undefined> {
  let result: any;

  try {
    result = await fetch(`https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io/v1/sns/list/page/${page}/slow.json`).catch(
      () => undefined,
    );
  } catch (error) {
    console.log(error);
  }

  if (!result || result.ok === false) return undefined;

  return (await result.json()) as SnsTokensInfo[];
}

const sns_all_tokens_info_call_rounds = 5;

export async function getSnsAllTokensInfo(): Promise<SnsTokensInfo[]> {
  let fetch_index = 0;
  let fetch_done = false;

  let data: SnsTokensInfo[] = [];

  const fetch = async (index: number) => {
    fetch_index += 1;

    await Promise.all(
      Array.from({ length: sns_all_tokens_info_call_rounds }, (_, i) => i).map(async (call_index) => {
        const page = call_index + index * sns_all_tokens_info_call_rounds;
        const result = await getSnsTokensInfo(page);

        if (!result) return undefined;

        data = data.concat(result);

        if (result.length < 10) {
          fetch_done = true;
        }

        return undefined;
      }),
    );

    if (!fetch_done) {
      await fetch(fetch_index);
    }
  };

  await fetch(fetch_index);

  return data
    .sort((a, b) => {
      if (a.index < b.index) return -1;
      if (a.index > b.index) return 1;
      return 0;
    })
    .map((e) => ({ ...e, meta: { ...e.meta, logo: `https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io${e.meta.logo}` } }));
}

export function useSnsAllTokensInfo() {
  const [snsAllTokensInfo, setSnsAllTokensInfo] = useState<SnsTokensInfo[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function call() {
      setLoading(true);
      const data = await getSnsAllTokensInfo();
      setSnsAllTokensInfo(data);
      setLoading(false);
    }

    call();
  }, []);

  return useMemo(
    () => ({
      loading,
      result: snsAllTokensInfo,
    }),
    [loading, snsAllTokensInfo],
  );
}
