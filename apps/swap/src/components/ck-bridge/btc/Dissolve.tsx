import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonNullArgs, parseTokenAmount, BigNumber } from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
import { useTheme, Box, Typography, Button, CircularProgress } from "components/Mui";
import { FilledTextField } from "components/index";
import { useBridgeTokenBalance } from "hooks/ck-bridge/index";
import { useCallback, useMemo, useState } from "react";
import { useActiveChain } from "hooks/web3/index";
import { Flex } from "@icpswap/ui";
import { InputWrapper } from "components/ck-bridge";
import { DISSOLVE_FEE } from "constants/ckBTC";
import { useDissolve } from "hooks/ck-btc/index";
import { useRefreshTriggerManager } from "hooks/index";
import { validate } from "bitcoin-address-validation";

interface BtcBridgeDissolveProps {
  token: Token;
  bridgeChain: ckBridgeChain;
}

export function BtcBridgeDissolve({ token, bridgeChain }: BtcBridgeDissolveProps) {
  const theme = useTheme();
  const chainId = useActiveChain();

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("BridgeBtcDissolve");

  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, refresh: refreshTrigger });

  const dissolve_error = useMemo(() => {
    if (!address) return t`Enter the address`;
    if (!validate(address)) return t`Invalid bitcoin address`;
    if (!amount) return t`Enter the amount`;
    if (!new BigNumber(amount).isGreaterThan(0.001)) return t`Min amount is 0.001 ckBTC`;
    if (parseTokenAmount(tokenBalance, token.decimals).isLessThan(amount)) return t`Insufficient balance`;

    return undefined;
  }, [amount, token, chainId, address]);

  const handleMax = useCallback(() => {
    if (!tokenBalance) return;
    if (
      !parseTokenAmount(tokenBalance, token.decimals)
        .minus(parseTokenAmount(token.transFee, token.decimals))
        .isGreaterThan(0)
    )
      return;

    setAmount(
      parseTokenAmount(tokenBalance, token.decimals)
        .minus(parseTokenAmount(token.transFee, token.decimals))
        .toFixed(token.decimals - 1),
    );
  }, [token, tokenBalance, setAmount]);

  const { dissolve_call, loading } = useDissolve();

  const handleDissolve = useCallback(async () => {
    if (!amount || !token || !address) return;

    const success = await dissolve_call({ address, amount, token });

    if (success) {
      setRefreshTrigger();
      setAmount("");
      setAddress("");
    }
  }, [dissolve_call, setRefreshTrigger, amount, address]);

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
          <Trans>BTC Receiving Address</Trans>
        </Typography>

        <FilledTextField
          inputPadding="0px"
          background="level3"
          value={address}
          onChange={(value: string) => setAddress(value)}
          fullWidth
          fontSize="16px"
          placeholder="Enter the address"
          variant="standard"
        />
      </Box>

      <InputWrapper
        value={amount}
        token={token}
        chain={bridgeChain}
        balance={tokenBalance}
        onInput={(value: string) => setAmount(value)}
        onMax={handleMax}
      />

      <Box
        sx={{
          width: "100%",
          padding: "16px",
          borderRadius: "16px",
          border: `1px solid ${theme.palette.background.level4}`,
        }}
      >
        <Flex fullWidth justify="space-between" align="flex-start">
          <Box>
            <Typography>
              <Trans>Fee</Trans>
            </Typography>

            <Typography sx={{ margin: "4px 0 0 0" }}>
              <Trans>(Excludes Bitcoin Network Tx fees)</Trans>
            </Typography>
          </Box>

          <Typography>{DISSOLVE_FEE}ckBTC</Typography>
        </Flex>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={nonNullArgs(dissolve_error) || loading}
        onClick={handleDissolve}
        startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
      >
        {dissolve_error ?? t`Confirm`}
      </Button>
    </>
  );
}
