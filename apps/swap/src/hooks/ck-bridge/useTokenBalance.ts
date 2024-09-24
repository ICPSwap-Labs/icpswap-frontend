import { useMemo } from "react";
import { useStoreTokenBalance } from "hooks/token/useTokenBalance";
import { useERC20Balance, useETHBalance } from "hooks/web3/index";
import { ckBridgeChain } from "@icpswap/constants";
import { useAccountPrincipal } from "store/auth/hooks";
import { Erc20MinterInfo, Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { ckETH } from "@icpswap/tokens";

export interface UseTokenBalanceProps {
  token: Token | Null;
  chain: ckBridgeChain;
  minterInfo?: Erc20MinterInfo | Null;
  refresh?: number;
}

export function useBridgeTokenBalance({ token, minterInfo, chain, refresh }: UseTokenBalanceProps) {
  const principal = useAccountPrincipal();

  const erc20MinterInfo = useMemo(() => {
    if (!token) return undefined;

    const erc20MinterInfo = minterInfo?.supported_ckerc20_tokens[0]?.find(
      (minterInfo) => minterInfo.ledger_canister_id.toString() === token.address,
    );

    return erc20MinterInfo;
  }, [minterInfo, token]);

  const { result: ethBalance } = useETHBalance();
  const { result: erc20TokenBalance } = useERC20Balance(erc20MinterInfo?.erc20_contract_address, refresh);
  const { result: tokenBalance } = useStoreTokenBalance(token?.address, principal?.toString(), refresh);

  return useMemo(() => {
    if (!token) return undefined;
    if (chain === ckBridgeChain.icp) return tokenBalance;
    if (chain === ckBridgeChain.eth && token.address === ckETH.address) return ethBalance;
    if (chain === ckBridgeChain.eth) return erc20TokenBalance;
    return undefined;
  }, [chain, ethBalance, erc20TokenBalance, token, tokenBalance]);
}
