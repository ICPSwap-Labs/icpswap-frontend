import { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import {
  formatTokenAmount,
  nonUndefinedOrNull,
  parseTokenAmount,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import ButtonConnector from "components/authentication/ButtonConnector";
import { Erc20Fee, InputWrapper } from "components/ck-bridge";
import { DisconnectButton } from "components/ck-bridge/Disconnect";
import { Box, CircularProgress, TextField, Typography, useTheme } from "components/Mui";
import { ERC20_DISSOLVE_REFRESH } from "constants/ckERC20";
import { useIcpTokenBalance, useTokenSymbol } from "hooks/ck-bridge/index";
import { useDissolveCallback } from "hooks/ck-erc20/index";
import { useRefreshTriggerManager } from "hooks/index";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal } from "store/auth/hooks";
import { isAddress } from "utils/web3/index";
import { useAccount } from "wagmi";

export interface Erc20DissolveProps {
  token: Token;
  minterInfo?: ChainKeyETHMinterInfo | Null;
}

export function Erc20Dissolve({ token }: Erc20DissolveProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { address: account } = useAccount();
  const principal = useAccountPrincipal();
  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager(ERC20_DISSOLVE_REFRESH);

  const symbol = useTokenSymbol({
    token,
    chain: BridgeChainType.icp,
  });

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const tokenBalance = useIcpTokenBalance({
    token,
    refresh: refreshTrigger,
  });

  useEffect(() => {
    setAddress(account);
  }, [account]);

  const dissolve_error = useMemo(() => {
    if (!address) return t("common.enter.address");
    if (!amount) return t("ck.enter.transfer.amount");
    if (isAddress(address) === false) return t`Invalid ethereum address`;
    if (!token || !tokenBalance) return t("common.waiting.fetching");
    if (!formatTokenAmount(amount, token.decimals).isGreaterThan(token.transFee))
      return `Min amount is ${toSignificantWithGroupSeparator(
        parseTokenAmount(token.transFee, token.decimals).toString(),
      )} ${token.symbol}`;

    if (formatTokenAmount(amount, token.decimals).isGreaterThan(tokenBalance))
      return t("common.error.insufficient.balance");

    return undefined;
  }, [amount, token, address, tokenBalance, t]);

  const oisyButtonDisabled = useOisyDisabledTips({ page: "ck-bridge" });

  const handleMax = useCallback(() => {
    setAmount(parseTokenAmount(tokenBalance, token.decimals).toString());
  }, [token, tokenBalance]);

  const { loading, dissolve_call } = useDissolveCallback();

  const handleDissolve = useCallback(async () => {
    if (!amount || !principal || !token || !address) return;

    const success = await dissolve_call(token, amount, address);

    if (success) {
      setRefreshTrigger();
      setAmount("");
      setAddress("");
    }
  }, [address, amount, principal, token, dissolve_call, setRefreshTrigger]);

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
        <Typography sx={{ fontSize: "16px" }}>{t("ck.receiving.address", { symbol })}</Typography>

        <Box sx={{ margin: "12px 0 0 0" }}>
          <Flex
            fullWidth
            gap="0 4px"
            sx={{
              "@media(max-width: 640px)": {
                flexDirection: "column",
                gap: "10px",
                alignItems: "flex-start",
              },
            }}
          >
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
              placeholder={t("common.enter.address")}
            />

            <DisconnectButton />
          </Flex>
        </Box>
      </Box>

      <InputWrapper
        value={amount}
        token={token}
        bridgeCurrentChain={BridgeChainType.icp}
        balance={tokenBalance}
        onInput={(value: string) => setAmount(value)}
        onMax={handleMax}
      />

      <Erc20Fee />

      <ButtonConnector
        variant="contained"
        fullWidth
        size="large"
        disabled={nonUndefinedOrNull(dissolve_error) || loading || oisyButtonDisabled}
        startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
        onClick={handleDissolve}
      >
        {dissolve_error || t("common.dissolve.symbol", { symbol })}
      </ButtonConnector>
    </>
  );
}
