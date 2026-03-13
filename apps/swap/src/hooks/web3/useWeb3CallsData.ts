import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useSupportedActiveChain } from "hooks/web3/index";

export function useWeb3CallsData<T>(
  fn: () => Promise<T>,
  reload?: number | string | boolean,
): UseQueryResult<T, Error> {
  const supportedActiveChain = useSupportedActiveChain();

  return useQuery({
    queryKey: ["useWeb3CallsData", supportedActiveChain, fn, reload],
    queryFn: () => fn(),
  });
}
