import { useState, useCallback, useMemo } from "react";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { BigNumber, parseTokenAmount } from "@icpswap/utils";
import { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { InputWrapper } from "components/ck-bridge";
import { useBridgeTokenBalance } from "hooks/ck-bridge/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { useAccount } from "wagmi";
import { useActiveChain } from "hooks/web3/index";
import { chainIdToNetwork, chain } from "constants/web3";
import { useMintCallback } from "hooks/ck-eth/index";
import ButtonConnector from "components/authentication/ButtonConnector";
import { useTranslation } from "react-i18next";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";
import { MintExtraContent } from "components/ck-bridge/eth/MintExtra";
import { Web3WalletWrapper } from "components/ck-bridge/Web3WalletWrapper";

export interface EthMintProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  minterInfo?: ChainKeyETHMinterInfo | Null;
}

export function EthMint({ token, bridgeChain, minterInfo }: EthMintProps) {
  const { t } = useTranslation();
  const { address } = useAccount();

  const principal = useAccountPrincipal();
  const chainId = useActiveChain();

  const [amount, setAmount] = useState<string | undefined>(undefined);

  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, minterInfo });
  const ethBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.eth, minterInfo });

  const oisyButtonDisabled = useOisyDisabledTips({ page: "ck-bridge" });

  const { loading, mint_call } = useMintCallback({
    minter_address: minterInfo?.deposit_with_subaccount_helper_contract_address[0],
  });

  const handleMint = useCallback(async () => {
    if (!principal || !amount) return;

    const response = await mint_call(amount);

    if (response) {
      setAmount("");
    }
  }, [mint_call, amount, setAmount]);

  const mint_error = useMemo(() => {
    if (!!chainId && chain !== chainId) return `Please switch to ${chainIdToNetwork[chain]}`;
    if (!amount || new BigNumber(amount).isEqualTo(0)) return t("ck.enter.transfer.amount");
    if (ethBalance && ethBalance.isLessThan(amount)) return t("common.error.insufficient.balance");

    return undefined;
  }, [chainId, chain, amount, ethBalance]);

  const handleMax = useCallback(() => {
    if (ethBalance) {
      setAmount(parseTokenAmount(ethBalance, token.decimals).toString());
    }
  }, [token, tokenBalance, ethBalance, setAmount]);

  return (
    <>
      <Web3WalletWrapper />

      <InputWrapper
        value={amount}
        token={token}
        chain={bridgeChain}
        balance={ethBalance}
        onInput={(value: string) => setAmount(value)}
        onMax={handleMax}
      />

      <ButtonConnector
        variant="contained"
        fullWidth
        size="large"
        onClick={handleMint}
        disabled={loading || !address || !!mint_error || oisyButtonDisabled}
        loading={loading}
      >
        {mint_error === undefined ? t("common.mint.symbol", { symbol: "ckETH" }) : mint_error}
      </ButtonConnector>

      <MintExtraContent token={token} balance={tokenBalance} />
    </>
  );
}
