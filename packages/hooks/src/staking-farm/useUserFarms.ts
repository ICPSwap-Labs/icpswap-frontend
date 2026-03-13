import { resultFormat } from "@icpswap/utils";
import { Principal } from "@icp-sdk/core/principal";
import { farmIndex } from "@icpswap/actor";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export async function getUserFarms(principal: string) {
  const result = await (await farmIndex()).getUserFarms(Principal.fromText(principal));
  return resultFormat<Array<Principal>>(result).data;
}

export function useUserFarms(
  principal: string | undefined,
  reload?: boolean,
): UseQueryResult<Principal[] | undefined, Error> {
  return useQuery({
    queryKey: ["useUserFarms", principal, reload],
    queryFn: async () => {
      if (!principal) return undefined;
      return await getUserFarms(principal);
    },
    enabled: !!principal,
  });
}
