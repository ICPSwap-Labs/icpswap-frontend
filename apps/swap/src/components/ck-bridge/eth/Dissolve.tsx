import { useState, useCallback, useMemo } from "react";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonNullArgs, parseTokenAmount, formatTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Erc20MinterInfo, Null } from "@icpswap/types";
import { ckETH } from "@icpswap/tokens";
import { t, Trans } from "@lingui/macro";
import { Box, Typography, Button, useTheme, CircularProgress } from "components/Mui";
import { InputWrapper, Erc20Fee } from "components/ck-bridge";
import { useBridgeTokenBalance, useTokenSymbol } from "hooks/ck-bridge/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { Web3ButtonConnector } from "components/web3/index";
import { useWeb3React } from "@web3-react/core";
import { useActiveChain } from "hooks/web3/index";
import { chainIdToNetwork, chain } from "constants/web3";
import { useDissolveCallback } from "hooks/ck-eth/index";
import { useRefreshTriggerManager } from "hooks/index";
import { MIN_WITHDRAW_AMOUNT } from "constants/ckETH";
import { useFetchUserTxStates } from "hooks/ck-eth";

export interface EthDissolveProps {
  token: Token;
  bridgeChain: ckBridgeChain;
  minterInfo?: Erc20MinterInfo | Null;
}

export function EthDissolve({ token, bridgeChain, minterInfo }: EthDissolveProps) {
  const theme = useTheme();
  const { account } = useWeb3React();

  const principal = useAccountPrincipal();
  const chainId = useActiveChain();

  useFetchUserTxStates();

  const symbol = useTokenSymbol({
    token,
    bridgeChain: bridgeChain === ckBridgeChain.icp ? ckBridgeChain.eth : ckBridgeChain.icp,
  });

  const [amount, setAmount] = useState<string | undefined>(undefined);

  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("Erc20Dissolve");

  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, minterInfo, refresh: refreshTrigger });
  const ercTokenBalance = useBridgeTokenBalance({
    token,
    chain: ckBridgeChain.eth,
    minterInfo,
    refresh: refreshTrigger,
  });

  const dissolve_error = useMemo(() => {
    if (!!chainId && chain !== chainId) return t`Please switch to ${chainIdToNetwork[chain]}`;
    if (!amount) return t`Enter the amount`;
    if (formatTokenAmount(amount, ckETH.decimals).isLessThan(MIN_WITHDRAW_AMOUNT))
      return `Min amount is ${toSignificantWithGroupSeparator(
        parseTokenAmount(MIN_WITHDRAW_AMOUNT, ckETH.decimals).toString(),
      )} ckETH`;

    if (
      amount &&
      token &&
      tokenBalance &&
      !formatTokenAmount(amount, ckETH.decimals).plus(token.transFee.toString()).isLessThan(tokenBalance)
    )
      return t`Insufficient Balance`;

    return undefined;
  }, [amount, token, tokenBalance, chain, chainId]);

  const handleMax = useCallback(() => {
    setAmount(parseTokenAmount(tokenBalance, token.decimals).toString());
  }, [token, tokenBalance, ercTokenBalance, setAmount]);

  const { loading, dissolve_call } = useDissolveCallback();

  const handleDissolve = useCallback(async () => {
    if (!amount || !principal || !token || !account) return;

    const success = await dissolve_call(amount, account, token);

    if (success) {
      setRefreshTrigger();
      setAmount("");
    }
  }, [account]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: "20px 16px",
          background: theme.palette.background.level3,
          border: `1px solid ${theme.palette.background.level4}`,
          borderRadius: "16px",
        }}
      >
        <Typography sx={{ fontSize: "16px" }}>
          <Trans>{symbol} Receiving Address</Trans>
        </Typography>

        <Box sx={{ margin: "12px 0 0 0" }}>
          {account ? (
            <Typography sx={{ fontSize: "16px", color: "text.primary" }}>{account}</Typography>
          ) : (
            <Web3ButtonConnector />
          )}
        </Box>
      </Box>

      <InputWrapper
        value={amount}
        token={token}
        chain={bridgeChain}
        balance={tokenBalance}
        onInput={(value: string) => setAmount(value)}
        onMax={handleMax}
      />

      <Erc20Fee />

      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={nonNullArgs(dissolve_error) || loading}
        startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
        onClick={handleDissolve}
      >
        {dissolve_error || <Trans>Dissolve {token?.symbol ?? "--"}</Trans>}
      </Button>
    </>
  );
}