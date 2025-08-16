import { useCallback } from "react";
import { setting } from "@icpswap/actor";
import { useCallsData } from "../useCallData";

export async function getGlobalSettingTokens() {
  const result = await (await setting()).get_default_tokens();
  return result;
}

export function useGlobalSettingTokens() {
  return useCallsData(
    useCallback(async () => {
      return await getGlobalSettingTokens();
    }, []),
  );
}
