import { BridgeChainType } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { nonUndefinedOrNull, parseTokenAmount, BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { useTheme, Box, Typography, CircularProgress, TextField } from "components/Mui";
import React, { useCallback, useMemo, useState } from "react";
import { Flex } from "@icpswap/ui";
import { InputWrapper } from "components/ck-bridge";
import ButtonConnector from "components/authentication/ButtonConnector";
import { useTranslation } from "react-i18next";
import { useOisyDisabledTips } from "hooks/useOisyDisabledTips";
import { useActiveUserTokenBalance } from "hooks/token";
import { Null, NumberType } from "@icpswap/types";
import { isBalanceGreaterThanFee } from "utils/token/balanceGreaterThanFee";

interface BitcoinStyleDissolveUIProps {
  token: Token;
  bridgeChain: BridgeChainType;
  onDissolve: ({ amount, address }: { amount: string; address: string }) => Promise<boolean | undefined>;
  dissolveLoading: boolean;
  validate: (address: string) => boolean;
  minAmount: string | number | Null;
  chainName: string;
  withdrawalFee: NumberType | Null;
}

export function BitcoinStyleDissolveUI({
  token,
  bridgeChain,
  onDissolve,
  dissolveLoading,
  validate,
  minAmount,
  chainName,
  withdrawalFee,
}: BitcoinStyleDissolveUIProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const { result: tokenBalance, refetch } = useActiveUserTokenBalance({ tokenId: token?.address });

  const dissolve_error = useMemo(() => {
    if (!address) return t("common.enter.address");
    if (!validate(address)) return t("common.invalid.symbol.address", { symbol: chainName });
    if (!amount) return t("ck.enter.transfer.amount");
    if (!minAmount) return t("common.confirm");
    if (!new BigNumber(amount).isGreaterThan(minAmount))
      return t("ck.bridge.min.token.amount", { amount: minAmount, symbol: token.symbol });
    if (parseTokenAmount(tokenBalance, token.decimals).isLessThan(amount))
      return t("common.error.insufficient.balance");

    return undefined;
  }, [amount, token, address, validate, minAmount, chainName]);

  const handleMax = useCallback(() => {
    if (!tokenBalance) return;
    if (!isBalanceGreaterThanFee(tokenBalance, token)) return;

    setAmount(
      parseTokenAmount(tokenBalance, token.decimals)
        .minus(parseTokenAmount(token.transFee, token.decimals))
        .toFixed(token.decimals - 1),
    );
  }, [token, tokenBalance, setAmount]);

  const oisyButtonDisabled = useOisyDisabledTips({ page: "ck-bridge" });

  const dissolveCallback = useCallback(async () => {
    if (isUndefinedOrNull(amount) || isUndefinedOrNull(address)) return;

    const success = await onDissolve({ amount, address });

    if (success) {
      refetch();
      setAddress("");
      setAmount("");
    }
  }, [refetch, onDissolve, address, amount, setAddress, setAmount]);

  const handleAddressChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(event.target.value);
    },
    [setAddress],
  );

  const handleAmountChange = useCallback(
    (amount: string) => {
      setAmount(amount);
    },
    [setAmount],
  );

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
          {t("ck.receiving.address", { symbol: token.symbol.replace("ck", "") })}
        </Typography>

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
            onChange={handleAddressChange}
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
        bridgeCurrentChain={bridgeChain}
        balance={tokenBalance}
        onInput={handleAmountChange}
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

            <Typography sx={{ margin: "4px 0 0 0" }}>{t("ck.bridge.tx.fee", { chainName })}</Typography>
          </Box>

          <Typography>
            {withdrawalFee ? parseTokenAmount(withdrawalFee, token.decimals).toFormat() : "--"}
            {token.symbol}
          </Typography>
        </Flex>
      </Box>

      <ButtonConnector
        variant="contained"
        fullWidth
        size="large"
        disabled={nonUndefinedOrNull(dissolve_error) || dissolveLoading || oisyButtonDisabled}
        onClick={dissolveCallback}
        startIcon={dissolveLoading ? <CircularProgress color="inherit" size={20} /> : null}
      >
        {dissolve_error ?? t("common.confirm")}
      </ButtonConnector>
    </>
  );
}
