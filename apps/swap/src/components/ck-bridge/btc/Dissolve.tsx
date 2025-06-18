import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonUndefinedOrNull, parseTokenAmount, BigNumber } from "@icpswap/utils";
import { useTheme, Box, Typography, CircularProgress, TextField } from "components/Mui";
import { useBridgeTokenBalance } from "hooks/ck-bridge/index";
import { useCallback, useMemo, useState } from "react";
import { useActiveChain } from "hooks/web3/index";
import { Flex } from "@icpswap/ui";
import { InputWrapper } from "components/ck-bridge";
import { DISSOLVE_FEE } from "constants/ckBTC";
import { useDissolve } from "hooks/ck-btc/index";
import { useRefreshTriggerManager } from "hooks/index";
import { validate } from "bitcoin-address-validation";
import ButtonConnector from "components/authentication/ButtonConnector";
import { useTranslation } from "react-i18next";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";

interface BtcBridgeDissolveProps {
  token: Token;
  bridgeChain: ckBridgeChain;
}

export function BtcBridgeDissolve({ token, bridgeChain }: BtcBridgeDissolveProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const chainId = useActiveChain();

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("BridgeBtcDissolve");

  const tokenBalance = useBridgeTokenBalance({ token, chain: ckBridgeChain.icp, refresh: refreshTrigger });

  const dissolve_error = useMemo(() => {
    if (!address) return t("common.enter.address");
    if (!validate(address)) return t`Invalid bitcoin address`;
    if (!amount) return t("ck.enter.transfer.amount");
    if (!new BigNumber(amount).isGreaterThan(0.001)) return t`Min amount is 0.001 ckBTC`;
    if (parseTokenAmount(tokenBalance, token.decimals).isLessThan(amount))
      return t("common.error.insufficient.balance");

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

  const oisyButtonDisabled = useOisyDisabledTips({ page: "ck-bridge" });

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
        <Typography sx={{ fontSize: "16px" }}>{t("ck.receiving.address", { symbol: "BTC" })}</Typography>

        <Box sx={{ margin: "12px 0 0 0" }}>
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
            <Typography>{t("common.fee")}</Typography>

            <Typography sx={{ margin: "4px 0 0 0" }}>{t("ck.btc.tx.fee")}</Typography>
          </Box>

          <Typography>{DISSOLVE_FEE}ckBTC</Typography>
        </Flex>
      </Box>

      <ButtonConnector
        variant="contained"
        fullWidth
        size="large"
        disabled={nonUndefinedOrNull(dissolve_error) || loading || oisyButtonDisabled}
        onClick={handleDissolve}
        startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
      >
        {dissolve_error ?? t("common.confirm")}
      </ButtonConnector>
    </>
  );
}
