import { BigNumber, nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import Web3 from "web3";

export function useETHBalance(reload?: number) {
  const { address: account } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: ["ethBalance", account, reload],
    queryFn: async () => {
      if (account) {
        const web3 = new Web3(Web3.givenProvider);
        const balance = await web3.eth.getBalance(account);
        return new BigNumber(balance.toString());
      }
    },
    enabled: nonUndefinedOrNull(account),
  });

  return useMemo(() => ({ result: data, loading: isLoading }), [data, isLoading]);
}
