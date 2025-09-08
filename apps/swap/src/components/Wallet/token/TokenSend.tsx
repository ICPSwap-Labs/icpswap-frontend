import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Button, CircularProgress, Typography, useTheme } from "components/Mui";
import { FilledTextField, Flex, MaxButton, NumberTextField, TokenImage } from "components/index";
import {
  BigNumber,
  formatTokenAmount,
  isUndefinedOrNull,
  isValidAccount,
  isValidPrincipal,
  nonUndefinedOrNull,
  parseTokenAmount,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "react-feather";
import { WalletBalance } from "components/swap/WalletBalance";
import { CurrencyAmount } from "@icpswap/swap-sdk";
import { useTokenBalance } from "hooks/token";
import { MessageTypes, useRefreshTriggerManager, useTips, useUSDPrice } from "hooks/index";
import { BalanceSlider } from "components/Wallet/BalanceSlider";
import { tokenTransfer } from "hooks/token/calls";
import { getLocaleMessage } from "i18n/service";
import { TOKEN_BALANCE_REFRESH } from "constants/wallet";
import { ICP } from "@icpswap/tokens";

function usePrincipalStandard(tokenId: string, standard: string) {
  return (standard.includes("DIP20") || standard.includes("ICRC")) && tokenId !== ICP.address;
}

function AddressBookLabel({ name }: { name: string }) {
  return (
    <Box sx={{ borderRadius: "8px", background: "rgba(183, 156, 74, 0.26)", padding: "4px 8px", color: "#B79C4A" }}>
      {name}
    </Box>
  );
}

export function TokenSend() {
  const theme = useTheme();
  const { setPages, selectedContact, sendToken: token, setSelectedContact } = useWalletContext();
  const principal = useAccountPrincipalString();
  const { t } = useTranslation();
  const [openTip] = useTips();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager(TOKEN_BALANCE_REFRESH);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
    setSelectedContact(undefined);
  }, [setPages, setSelectedContact]);

  const handleAddressBook = useCallback(() => {
    setPages(WalletManagerPage.SelectContact, false);
  }, [setPages]);

  useEffect(() => {
    if (selectedContact) {
      setAddress(selectedContact.address);
    }
  }, [selectedContact, setAddress]);

  const handleAddressChange = useCallback(
    (value: string) => {
      setAddress(value);
    },
    [setAddress],
  );

  const onUserInput = useCallback(
    (value: string) => {
      setAmount(value);
    },
    [setAmount],
  );

  const tokenUSDPrice = useUSDPrice(token);
  const { result: balance } = useTokenBalance(token.address, principal, refreshTrigger);

  const currencyBalance = useMemo(() => {
    if (isUndefinedOrNull(balance)) return undefined;
    return CurrencyAmount.fromRawAmount(token, balance);
  }, [balance, token]);

  const handleMax = useCallback(() => {
    if (!balance) return;
    if (new BigNumber(balance).isEqualTo(0)) return;

    setAmount(parseTokenAmount(balance, token.decimals).toString());
  }, [balance, token, setAmount]);

  const actualTransferAmount = useMemo(() => {
    if (isUndefinedOrNull(amount)) return 0;
    const __amount = new BigNumber(amount).minus(parseTokenAmount(token.transFee, token.decimals));
    return __amount.isGreaterThan(0) ? amount.toString() : 0;
  }, [amount, token]);

  const isValidAddress = useMemo(() => {
    if (isUndefinedOrNull(address)) return undefined;
    if (address.includes("-")) return isValidPrincipal(address);
    return isValidAccount(address);
  }, [address]);

  const handleInputChange = useCallback(
    (value: string) => {
      setAmount(value);
    },
    [setAmount],
  );

  const handleSend = useCallback(async () => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(address) || isUndefinedOrNull(amount)) return;

    try {
      setLoading(true);

      const { status, message } = await tokenTransfer({
        canisterId: token.address.toString(),
        to: address,
        amount: formatTokenAmount(
          new BigNumber(amount).minus(parseTokenAmount(token.transFee, token.decimals)),
          token.decimals,
        ),
        from: principal,
        fee: token.transFee,
        decimals: token.decimals,
      });

      if (status === "ok") {
        openTip(t("common.transfer.success"), MessageTypes.success);
        setAddress(undefined);
        setAmount(undefined);
        setRefreshTrigger();
        setSelectedContact(undefined);
      } else {
        openTip(getLocaleMessage(message) ?? t("common.transfer.failed"), MessageTypes.error);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }, [setSelectedContact, setLoading, principal, address, amount]);

  const error = useMemo(() => {
    if (
      isUndefinedOrNull(address) ||
      isUndefinedOrNull(amount) ||
      address === "" ||
      amount === "" ||
      new BigNumber(amount).isEqualTo(0)
    )
      return t("wallet.send.enter.address.amount");

    if (usePrincipalStandard(token.address, token.standard)) {
      if (!isValidPrincipal(address)) return t("common.invalid.principal.id");
    } else if (!isValidAccount(address) && !isValidPrincipal(address))
      return t("wallet.send.error.invalid.principal.account");
  }, [address, token, amount]);

  const disableSend = useMemo(() => {
    return isValidAddress === false || loading || nonUndefinedOrNull(error);
  }, [address, error, amount, loading, isValidAddress]);

  const handleSelectToken = useCallback(() => {
    setPages(WalletManagerPage.TokenSelector, false);
  }, [setPages]);

  return (
    <DrawerWrapper
      padding="12px"
      title="Send"
      onPrev={handlePrev}
      showRightIcon
      onRightIconClick={handlePrev}
      footer={
        <Box sx={{ width: "100%", padding: "0 12px" }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={disableSend}
            onClick={handleSend}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {error ?? t("common.send")}
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          margin: "24px 0 0 0",
        }}
      >
        <Typography>{t("common.to")}</Typography>

        <Box sx={{ margin: "8px 0 0 0" }}>
          <Box
            sx={{
              border: theme.palette.border.normal,
              borderRadius: "16px",
              background: theme.palette.background.level3,
              padding: "12px 16px",
            }}
          >
            <FilledTextField
              value={address ?? ""}
              multiline
              rows={3}
              borderRadius="16px"
              background={theme.palette.background.level3}
              placeholderSize="14px"
              fullWidth
              placeholder={t("wallet.send.placeholder")}
              inputPadding="0px"
              onChange={handleAddressChange}
            />
            <Flex fullWidth justify={selectedContact ? "space-between" : "flex-end"}>
              {selectedContact ? <AddressBookLabel name={selectedContact.name} /> : null}

              <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handleAddressBook}>
                <img src="/images/wallet/address-book.svg" alt="" />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: "16px 0 0 0" }}>
        <Typography>{t("common.amount")}</Typography>
        <Box
          sx={{
            margin: "8px 0 0 0",
            padding: "16px",
            borderRadius: "16px",
            border: `1px solid ${theme.palette.background.level4}`,
            background: theme.palette.background.level3,
          }}
        >
          <Flex vertical align="flex-start" fullWidth gap="8px 0">
            <Flex fullWidth gap="0 10px">
              <Flex
                gap="0 8px"
                sx={{
                  borderRadius: "12px",
                  background: theme.palette.background.level2,
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={handleSelectToken}
              >
                <TokenImage size="24px" tokenId={token.address} logo={token.logo} />
                <Typography sx={{ fontSize: "18px", fontWeight: 500, color: "text.primary" }}>
                  {token.symbol}
                </Typography>
                <ChevronDown size={14} color={theme.colors.darkTextSecondary} />
              </Flex>

              <Box sx={{ flex: 1 }}>
                <NumberTextField
                  value={amount ?? ""}
                  fullWidth
                  sx={{
                    "& input": {
                      textAlign: "right",
                      fontSize: "28px!important",
                      fontWeight: 600,
                      padding: "0px",
                    },
                    "& input::placeholder": {
                      fontSize: "28px",
                      fontWeight: 600,
                    },
                  }}
                  placeholder="0.0"
                  variant="standard"
                  numericProps={{
                    thousandSeparator: true,
                    decimalScale: token.decimals,
                    allowNegative: false,
                    maxLength: 20,
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUserInput(e.target.value)}
                />
              </Box>
            </Flex>

            <Flex justify="space-between">
              <Flex gap="0 6px">
                <WalletBalance currencyBalance={currencyBalance} />
                <MaxButton onClick={handleMax} />
              </Flex>
            </Flex>

            <Box sx={{ width: "48%" }}>
              <BalanceSlider amount={amount} token={token} balance={balance} onAmountChange={handleInputChange} />
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box sx={{ margin: "16px 0 0 0" }}>
        <Flex fullWidth justify="space-between">
          <Typography sx={{ fontSize: "12px" }}>Fee:</Typography>
          <Typography sx={{ fontSize: "12px" }}>{`${parseTokenAmount(
            token.transFee?.toString(),
            token.decimals,
          ).toFormat()} ${token.symbol} (${
            tokenUSDPrice && token
              ? `$${toSignificantWithGroupSeparator(
                  parseTokenAmount(token.transFee.toString(), token.decimals).multipliedBy(tokenUSDPrice).toString(),
                  4,
                )}`
              : "--"
          })`}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between" sx={{ margin: "12px 0 0 0" }}>
          <Typography sx={{ fontSize: "12px" }}>Amount received:</Typography>
          <Typography sx={{ fontSize: "12px" }}>{`${toSignificantWithGroupSeparator(actualTransferAmount, 18)} ${
            token.symbol
          } (${
            tokenUSDPrice && token
              ? `$${toSignificantWithGroupSeparator(
                  new BigNumber(actualTransferAmount).multipliedBy(tokenUSDPrice).toString(),
                  4,
                )}`
              : "--"
          })`}</Typography>
        </Flex>
      </Box>
    </DrawerWrapper>
  );
}
