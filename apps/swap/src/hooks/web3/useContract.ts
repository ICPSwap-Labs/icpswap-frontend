import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { chain, SUPPORTED_CHAINS } from "constants/web3";
import { useMemo } from "react";
import { getContract } from "utils/web3/index";
import { MULTICALL_ADDRESSES } from "@icpswap/constants";
import { Null } from "@icpswap/types";

import type { UniswapInterfaceMulticall, ERC20, EthHelper } from "abis/types";
import UniswapInterfaceMulticallJson from "abis/UniswapInterfaceMulticall.json";
import EthHelperABI from "abis/EthHelper.json";
import ERC20ABI from "abis/ERC20.json";

import { useEthersWeb3Provider } from "./useEthersProvider";

const { abi: MulticallABI } = UniswapInterfaceMulticallJson;

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | Null,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { provider, account } = useWeb3React();
  const ethersProvider = useEthersWeb3Provider();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chain];
    if (!address) return null;

    try {
      return getContract(
        address,
        ABI,
        provider && provider?.network?.chainId && SUPPORTED_CHAINS.includes(provider?.network?.chainId)
          ? provider
          : ethersProvider,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, withSignerIfPossible, account]) as T;
}

export function useEthMinterHelperContract(address: string | Null, withSignerIfPossible?: boolean) {
  return useContract<EthHelper>(address, EthHelperABI, withSignerIfPossible);
}

export function useERC20Contract(contract: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<ERC20>(contract, ERC20ABI, withSignerIfPossible);
}

export function useInterfaceMulticall() {
  const MULTICALL_ADDRESSE = MULTICALL_ADDRESSES[chain];

  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESSE, MulticallABI, false);
}
