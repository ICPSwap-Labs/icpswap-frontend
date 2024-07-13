import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { farmIndex } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getUserFarms(principal: string) {
  const result = await (await farmIndex()).getUserFarms(Principal.fromText(principal));
  return resultFormat<Array<Principal>>(result).data;
}

export function useUserFarms(principal: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      if (!principal) return undefined;
      return await getUserFarms(principal);
    }, [principal]),
    reload,
  );
}
