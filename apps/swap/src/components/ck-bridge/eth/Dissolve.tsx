import { useState, useCallback, useMemo, useEffect } from "react";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonNullArgs, parseTokenAmount, formatTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Erc20MinterInfo, Null } from "@icpswap/types";
import { ckETH } from "@icpswap/tokens";
import { t, Trans } from "@lingui/macro";
import { Box, Typography, useTheme, CircularProgress, TextField } from "components/Mui";
import { InputWrapper, EthFee } from "components/ck-bridge";
import { useBridgeTokenBalance, useTokenSymbol } from "hooks/ck-bridge/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { Web3ButtonConnector } from "components/web3/index";
import { useWeb3React } from "@web3-react/core";
import { useActiveChain } from "hooks/web3/index";
import { isAddress } from "utils/web3/index";
import { chainIdToNetwork, chain } from "constants/web3";
import { useDissolveCallback } from "hooks/ck-eth/index";
import { useRefreshTriggerManager } from "hooks/index";
import { MIN_WITHDRAW_AMOUNT } from "constants/ckETH";
import { useFetchUserTxStates } from "hooks/ck-eth";
import { isMobile } from "react-device-detect";
import ButtonConnector from "components/authentication/ButtonConnector";

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

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("Erc20Dissolve");

  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, minterInfo, refresh: refreshTrigger });
  const ercTokenBalance = useBridgeTokenBalance({
    token,
    chain: ckBridgeChain.eth,
    minterInfo,
    refresh: refreshTrigger,
  });

  useEffect(() => {
    setAddress(account);
  }, [account, setAddress]);

  const dissolve_error = useMemo(() => {
    if (!!chainId && chain !== chainId) return t`Please switch to ${chainIdToNetwork[chain]}`;
    if (!amount) return t`Enter the amount`;
    if (!address) return t`Enter the address`;
    if (isAddress(address) === false) return t`Invalid ethereum address`;
    if (formatTokenAmount(amount, ckETH.decimals).isLessThan(MIN_WITHDRAW_AMOUNT))
      return `Min amount is ${toSignificantWithGroupSeparator(
        parseTokenAmount(MIN_WITHDRAW_AMOUNT, ckETH.decimals).toString(),
      )} ckETH`;

    if (
      token &&
      tokenBalance &&
      !formatTokenAmount(amount, ckETH.decimals).plus(token.transFee.toString()).isLessThan(tokenBalance)
    )
      return t`Insufficient Balance`;

    return undefined;
  }, [amount, token, tokenBalance, chain, chainId, address]);

  const handleMax = useCallback(() => {
    if (!token || !tokenBalance) return;

    setAmount(
      parseTokenAmount(tokenBalance, token.decimals).minus(parseTokenAmount(token.transFee, token.decimals)).toFixed(8),
    );
  }, [token, tokenBalance, ercTokenBalance, setAmount]);

  const { loading, dissolve_call } = useDissolveCallback();

  const handleDissolve = useCallback(async () => {
    if (!amount || !principal || !token || !address) return;

    const success = await dissolve_call(amount, address, token);

    if (success) {
      setRefreshTrigger();
      setAmount("");
      setAddress("");
    }
  }, [address, amount, principal, token]);

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
          {!account && !isMobile ? (
            <Web3ButtonConnector />
          ) : (
            <TextField
              sx={{
                "& input": {
                  lineHeight: "1.15rem",
                  fontSize: "16px",
                },
                "& textarea": {
                  lineHeight: "1.15rem",
                  fontSize: "16px",
                },
                "& input::placeholder": {
                  fontSize: "16px",
                },
                "& textarea::placeholder": {
                  fontSize: "16px",
                },
              }}
              variant="standard"
              onChange={({ target: { value } }) => setAddress(value)}
              value={address}
              multiline
              slotProps={{
                input: {
                  disableUnderline: true,
                },
              }}
              fullWidth
              autoComplete="off"
              placeholder="Enter the address"
            />
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

      <EthFee />

      <ButtonConnector
        variant="contained"
        fullWidth
        size="large"
        disabled={nonNullArgs(dissolve_error) || loading}
        startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
        onClick={handleDissolve}
      >
        {dissolve_error || <Trans>Dissolve {token?.symbol ?? "--"}</Trans>}
      </ButtonConnector>
    </>
  );
}
