import { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { BigNumber, parseTokenAmount } from "@icpswap/utils";
import ButtonConnector from "components/authentication/ButtonConnector";
import { InputWrapper } from "components/ck-bridge";
import { MintExtraContent } from "components/ck-bridge/erc20/MintExtra";
import { Web3WalletWrapper } from "components/ck-bridge/Web3WalletWrapper";
import { chain, chainIdToNetwork } from "constants/web3";
import { useErc20TokenBalance, useIcpTokenBalance } from "hooks/ck-bridge/index";
import { useMintCallback } from "hooks/ck-erc20/index";
import { useERC20TokenByChainKeyId } from "hooks/token/index";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";
import { useActiveChain } from "hooks/web3/index";
import { ApprovalState } from "hooks/web3/useApproveCallback";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { useAccount } from "wagmi";

export interface Erc20MintProps {
  token: Token;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  blockNumber: number | string | Null;
}

export function Erc20Mint({ token, minterInfo, blockNumber }: Erc20MintProps) {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const principal = useAccountPrincipal();
  const chainId = useActiveChain();
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const erc20Token = useERC20TokenByChainKeyId(token.address, minterInfo);

  const helperContractAddress = useMemo(() => {
    if (!minterInfo) return undefined;
    return minterInfo.deposit_with_subaccount_helper_contract_address[0];
  }, [minterInfo]);

  const tokenBalance = useIcpTokenBalance({ token });
  const ercTokenBalance = useErc20TokenBalance({ token, minterInfo });

  const { loading, mint_call, approveState } = useMintCallback({ erc20Token, helperContractAddress, amount });

  const handleMint = useCallback(async () => {
    if (!token || !erc20Token || !principal || !amount || !blockNumber) return;

    const response = await mint_call(erc20Token, amount, token, blockNumber);

    if (response?.hash) {
      setAmount("");
    }
  }, [mint_call, token, erc20Token, principal, amount, blockNumber]);

  const mint_error = useMemo(() => {
    if (!!chainId && chain !== chainId) return t("ck.switch.wallet", { network: chainIdToNetwork[chain] });
    if (!amount || new BigNumber(amount).isEqualTo(0)) return t("ck.enter.transfer.amount");
    if (ercTokenBalance && erc20Token && parseTokenAmount(ercTokenBalance, erc20Token.decimals).isLessThan(amount))
      return t("common.error.insufficient.balance");

    return undefined;
  }, [chainId, amount, erc20Token, ercTokenBalance, t]);

  const handleMax = useCallback(() => {
    if (ercTokenBalance) {
      setAmount(parseTokenAmount(ercTokenBalance, token.decimals).toString());
    }
  }, [token, ercTokenBalance]);

  const oisyButtonDisabled = useOisyDisabledTips({ page: "ck-bridge" });

  return (
    <>
      <Web3WalletWrapper />

      <InputWrapper
        value={amount}
        token={token}
        bridgeCurrentChain={BridgeChainType.erc20}
        balance={ercTokenBalance}
        onInput={(value: string) => setAmount(value)}
        onMax={handleMax}
      />

      <ButtonConnector
        variant="contained"
        fullWidth
        size="large"
        onClick={handleMint}
        disabled={loading || !account || !!mint_error || approveState === ApprovalState.PENDING || oisyButtonDisabled}
        loading={loading || approveState === ApprovalState.PENDING}
      >
        {mint_error === undefined
          ? approveState === ApprovalState.APPROVED || approveState === ApprovalState.PENDING
            ? t("ck.mint.symbol", { symbol: `ck${erc20Token?.symbol}` })
            : t`Approve`
          : mint_error}
      </ButtonConnector>

      <MintExtraContent token={token} balance={tokenBalance} />
    </>
  );
}
