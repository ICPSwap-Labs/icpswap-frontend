import { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { BigNumber } from "@icpswap/utils";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useETHBalance as __useETHBalance, useERC20Balance } from "hooks/web3/index";
import { useMemo } from "react";
import { useAccountPrincipal } from "store/auth/hooks";

export interface UseIcpTokenBalanceProps {
  token: Token | Null;
  refresh?: number;
}

export function useIcpTokenBalance({ token, refresh }: UseIcpTokenBalanceProps) {
  const principal = useAccountPrincipal();

  const { result: tokenBalance } = useTokenBalance({
    tokenId: token?.address,
    account: principal?.toString(),
    refresh,
  });

  return useMemo(() => {
    return tokenBalance ? new BigNumber(tokenBalance) : undefined;
  }, [tokenBalance]);
}

export interface UseErc20TokenBalanceProps {
  token: Token | Null;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  refresh?: number;
}

export function useErc20TokenBalance({ token, minterInfo, refresh }: UseErc20TokenBalanceProps) {
  const erc20Info = useMemo(() => {
    if (!token) return undefined;

    const ChainKeyETHMinterInfo = minterInfo?.supported_ckerc20_tokens[0]?.find(
      (minterInfo) => minterInfo.ledger_canister_id.toString() === token.address,
    );

    return ChainKeyETHMinterInfo;
  }, [minterInfo, token]);

  const { result: erc20TokenBalance } = useERC20Balance(erc20Info?.erc20_contract_address, refresh);

  return useMemo(() => {
    return erc20TokenBalance;
  }, [erc20TokenBalance]);
}

export function useEthBalance() {
  const { result: ethBalance } = __useETHBalance();

  return useMemo(() => {
    return ethBalance;
  }, [ethBalance]);
}

export interface UseEthereumTokenBalanceProps {
  token: Token | Null;
  chain: BridgeChainType;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  refresh?: number;
}

export function useEthereumBridgeTokenBalance({ token, minterInfo, chain, refresh }: UseEthereumTokenBalanceProps) {
  const principal = useAccountPrincipal();

  const ChainKeyETHMinterInfo = useMemo(() => {
    if (!token) return undefined;

    const ChainKeyETHMinterInfo = minterInfo?.supported_ckerc20_tokens[0]?.find(
      (minterInfo) => minterInfo.ledger_canister_id.toString() === token.address,
    );

    return ChainKeyETHMinterInfo;
  }, [minterInfo, token]);

  const { result: ethBalance } = __useETHBalance();
  const { result: erc20TokenBalance } = useERC20Balance(ChainKeyETHMinterInfo?.erc20_contract_address, refresh);
  const { result: tokenBalance, refetch } = useTokenBalance({
    tokenId: token?.address,
    account: principal?.toString(),
    refresh,
  });

  const balance = useMemo(() => {
    if (!token) return undefined;

    if (chain === BridgeChainType.icp) return tokenBalance ? new BigNumber(tokenBalance) : undefined;
    if (chain === BridgeChainType.eth) return ethBalance;
    if (chain === BridgeChainType.erc20) return erc20TokenBalance;
    return undefined;
  }, [chain, ethBalance, erc20TokenBalance, token, tokenBalance]);

  return useMemo(() => ({ balance, refetch }), [refetch, balance]);
}
