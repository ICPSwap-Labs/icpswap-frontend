import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export interface CanisterInfo {
  canister_id: string;
  controllers: string[] | undefined;
  module_hash: string;
  subnet_id: string;
}

export function useCanisterInfo(canisterId: string): UseQueryResult<CanisterInfo | undefined, Error> {
  return useQuery({
    queryKey: ["useCanisterInfo", canisterId],
    queryFn: async () => {
      const fetch_result = await fetch(`https://ic-api.internetcomputer.org/api/v3/canisters/${canisterId}`).catch(
        () => undefined,
      );
      if (!fetch_result) return undefined;
      return await fetch_result.json();
    },
    enabled: !!canisterId,
  });
}
