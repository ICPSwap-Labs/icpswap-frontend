import { useState, useCallback, useMemo } from "react";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount } from "@icpswap/utils";
import { Erc20MinterInfo, Null } from "@icpswap/types";
import { t, Trans } from "@lingui/macro";
import { Box, Typography, useTheme } from "components/Mui";
import { InputWrapper } from "components/ck-bridge";
import { useBridgeTokenBalance } from "hooks/ck-bridge/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { Web3ButtonConnector } from "components/web3/index";
import { useWeb3React } from "@web3-react/core";
import { useActiveChain } from "hooks/web3/index";
import { chainIdToNetwork, chain } from "constants/web3";
import { useMintCallback } from "hooks/ck-eth/index";
import ButtonConnector from "components/authentication/ButtonConnector";

export interface EthMintProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  minterInfo?: Erc20MinterInfo | Null;
}

export function EthMint({ token, bridgeChain, minterInfo }: EthMintProps) {
  const theme = useTheme();
  const { account } = useWeb3React();

  const principal = useAccountPrincipal();
  const chainId = useActiveChain();

  const [amount, setAmount] = useState<string | undefined>(undefined);

  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, minterInfo });
  const ethBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.eth, minterInfo });

  const { loading, mint_call } = useMintCallback();

  const handleMint = useCallback(async () => {
    if (!principal || !amount) return;

    const response = await mint_call(amount);

    if (response) {
      setAmount("");
    }
  }, [mint_call, amount, setAmount]);

  const mint_error = useMemo(() => {
    if (!!chainId && chain !== chainId) return `Please switch to ${chainIdToNetwork[chain]}`;
    if (!amount) return t`Enter the amount`;
    if (ethBalance && ethBalance.isLessThan(amount)) return t`Insufficient Balance`;

    return undefined;
  }, [chainId, chain, amount, ethBalance]);

  const handleMax = useCallback(() => {
    if (ethBalance) {
      setAmount(parseTokenAmount(ethBalance, token.decimals).toString());
    }
  }, [token, tokenBalance, ethBalance, setAmount]);

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
        <Typography>
          <Trans>Your wallet of Metamask</Trans>
        </Typography>

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
        balance={ethBalance}
        onInput={(value: string) => setAmount(value)}
        onMax={handleMax}
      />

      <ButtonConnector
        variant="contained"
        fullWidth
        size="large"
        onClick={handleMint}
        disabled={loading || !account || !!mint_error}
        loading={loading}
      >
        {mint_error === undefined ? t`Mint ckETH` : mint_error}
      </ButtonConnector>
    </>
  );
}
