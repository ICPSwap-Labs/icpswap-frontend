import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { BigNumber } from "@icpswap/utils";
import { useCallsData } from "@icpswap/hooks";

import { useERC20Contract } from "./useContract";

export function useERC20Balance(contractAddress: string | undefined, reload?: number) {
  const { account } = useWeb3React();
  const contract = useERC20Contract(contractAddress);

  return useCallsData(
    useCallback(async () => {
      if (!contract || !account) return undefined;
      const result = await contract.balanceOf(account);
      return new BigNumber(result.toString());
    }, [contract, account]),
    reload,
  );
}
