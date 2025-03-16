import { useState, useCallback, useMemo } from "react";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { BigNumber, parseTokenAmount } from "@icpswap/utils";
import { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Box, Typography, useTheme } from "components/Mui";
import { InputWrapper } from "components/ck-bridge";
import { useBridgeTokenBalance } from "hooks/ck-bridge/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { Web3ButtonConnector } from "components/web3/index";
import { useWeb3React } from "@web3-react/core";
import { useActiveChain } from "hooks/web3/index";
import { useERC20TokenByChainKeyId } from "hooks/token/index";
import { ApprovalState } from "hooks/web3/useApproveCallback";
import { chainIdToNetwork, chain } from "constants/web3";
import { useMintCallback } from "hooks/ck-erc20/index";
import ButtonConnector from "components/authentication/ButtonConnector";
import { useTranslation } from "react-i18next";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";

import { MintExtraContent } from "./MintExtra";

export interface Erc20MintProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  minterInfo?: ChainKeyETHMinterInfo | Null;
  blockNumber: number | string | Null;
}

export function Erc20Mint({ token, bridgeChain, minterInfo, blockNumber }: Erc20MintProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { account } = useWeb3React();

  const principal = useAccountPrincipal();
  const chainId = useActiveChain();

  const [amount, setAmount] = useState<string | undefined>(undefined);

  const erc20Token = useERC20TokenByChainKeyId(token.address, minterInfo);

  const helperContractAddress = useMemo(() => {
    if (!minterInfo) return undefined;
    return minterInfo.deposit_with_subaccount_helper_contract_address[0];
  }, [minterInfo]);

  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, minterInfo });
  const ercTokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.eth, minterInfo });

  const { loading, mint_call, approveState } = useMintCallback({ erc20Token, helperContractAddress, amount });

  const handleMint = useCallback(async () => {
    if (!token || !erc20Token || !principal || !amount || !blockNumber) return;

    const response = await mint_call(erc20Token, amount, token, blockNumber);

    if (response && response.hash) {
      setAmount("");
    }
  }, [mint_call, token, erc20Token, principal, amount, blockNumber]);

  const mint_error = useMemo(() => {
    if (!!chainId && chain !== chainId) return t("ck.switch.wallet", { network: chainIdToNetwork[chain] });
    if (!amount || new BigNumber(amount).isEqualTo(0)) return t("common.enter.input.amount");
    if (ercTokenBalance && erc20Token && parseTokenAmount(ercTokenBalance, erc20Token.decimals).isLessThan(amount))
      return t("common.error.insufficient.balance");

    return undefined;
  }, [chainId, chain, amount, erc20Token, ercTokenBalance, approveState]);

  const balance = useBridgeTokenBalance({ token, chain: bridgeChain, minterInfo });

  const handleMax = useCallback(() => {
    if (ercTokenBalance) {
      setAmount(parseTokenAmount(ercTokenBalance, token.decimals).toString());
    }
  }, [token, tokenBalance, ercTokenBalance, setAmount]);

  const oisyButtonDisabled = useOisyDisabledTips({ page: "ck-bridge" });

  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: "20px 16px",
          background: theme.palette.background.level2,
          borderRadius: "16px",
        }}
      >
        <Typography>{t("ck.wallet.metamask")}</Typography>

        <Box sx={{ margin: "10px 0 0 0" }}>
          {account ? (
            <Typography sx={{ fontSize: "16px", color: "text.primary", wordBreak: "break-all" }}>{account}</Typography>
          ) : (
            <Web3ButtonConnector />
          )}
        </Box>
      </Box>

      <InputWrapper
        value={amount}
        token={token}
        chain={bridgeChain}
        balance={balance}
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
