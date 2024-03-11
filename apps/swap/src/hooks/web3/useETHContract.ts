import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import ABI from "abis/ckETH.json";
import { CkETH } from "abis/types";
import { chain, ckETH_MINTER_CONTRACT } from "constants/ckETH";
import { useMemo } from "react";

import { getContract } from "utils/web3/index";

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { provider, account } = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chain];
    if (!address) return null;

    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, withSignerIfPossible, account]) as T;
}

export function useETHContract(withSignerIfPossible?: boolean) {
  // @ts-ignore
  return useContract<CkETH>(ckETH_MINTER_CONTRACT, ABI, withSignerIfPossible);
}
