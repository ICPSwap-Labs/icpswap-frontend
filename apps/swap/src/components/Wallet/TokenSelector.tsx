import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useRefreshTriggerManager, useTokens, useUSDPrice } from "hooks/index";
import { useState, useMemo, useCallback } from "react";
import { Box, Typography, InputAdornment, useTheme } from "components/Mui";
import { FilledTextField, Flex, LoadingRow, NoData, TokenImage } from "components/index";
import {
  BigNumber,
  formatAmount,
  formatDollarAmount,
  isUndefinedOrNull,
  nonUndefinedOrNull,
  parseTokenAmount,
  sleep,
} from "@icpswap/utils";
import { Search as SearchIcon } from "react-feather";
import { useDebouncedChangeHandler, useAddressOverview } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";
import { Token } from "@icpswap/swap-sdk";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { WALLET_TOKEN_SELECTOR_REFRESH } from "constants/wallet";
import { useRotateAnimationLoading, ROTATE_ANIMATION_LOADING_CLASS } from "components/theme";
import { useWalletTokenContext } from "components/Wallet/token/context";

function isTokenFiltered(token: Token, search: string) {
  return !(
    token.name.toLowerCase().includes(search.toLowerCase()) ||
    token.symbol.toLowerCase().includes(search.toLowerCase()) ||
    token.address.toLowerCase().includes(search.toLowerCase())
  );
}

interface TokenRowUIProps {
  token: Token;
  tokenValue: string | undefined;
  balance: string | undefined;
}

function TokenRowUI({ token, balance, tokenValue }: TokenRowUIProps) {
  const { setPages } = useWalletContext();
  const { setSendToken } = useWalletTokenContext();

  const handleSelectToken = useCallback(() => {
    setSendToken(token);
    setPages(WalletManagerPage.Send);
  }, [setSendToken, token, setPages]);

  return (
    <Flex
      justify="space-between"
      fullWidth
      sx={{ margin: "0 0 20px 0", cursor: "pointer" }}
      onClick={handleSelectToken}
    >
      <Flex gap="0 12px">
        <TokenImage tokenId={token.address} logo={token.logo} size="40px" />
        <Box>
          <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>{token?.symbol}</Typography>
          <Typography sx={{ fontSize: "12px", margin: "4px 0 0 0" }}>{token?.name}</Typography>
        </Box>
      </Flex>

      <Flex vertical align="flex-end" gap="4px 0">
        <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
          {balance ? formatAmount(balance) : "--"}
        </Typography>
        <Typography sx={{ fontSize: "12px" }}>{tokenValue ? formatDollarAmount(tokenValue) : "--"}</Typography>
      </Flex>
    </Flex>
  );
}

interface TokenRowProps {
  token: Token;
}

function TokenRow({ token }: TokenRowProps) {
  const principal = useAccountPrincipalString();
  const [refreshTrigger] = useRefreshTriggerManager(WALLET_TOKEN_SELECTOR_REFRESH);
  const { result: tokenBalance } = useTokenBalance(token.address, principal, refreshTrigger);
  const tokenUSDPrice = useUSDPrice(token);

  const parsedTokenBalance = useMemo(() => {
    if (isUndefinedOrNull(tokenBalance)) return undefined;
    return parseTokenAmount(tokenBalance, token.decimals).toString();
  }, [tokenBalance, token]);

  const tokenValue = useMemo(() => {
    if (isUndefinedOrNull(tokenUSDPrice) || isUndefinedOrNull(parsedTokenBalance)) return undefined;
    return new BigNumber(parsedTokenBalance).multipliedBy(tokenUSDPrice).toString();
  }, [tokenUSDPrice, parsedTokenBalance]);

  return <TokenRowUI token={token} tokenValue={tokenValue} balance={parsedTokenBalance} />;
}

interface TokenListProps {
  search: string | undefined;
}

function TokenList({ search }: TokenListProps) {
  const principal = useAccountPrincipalString();
  const [refreshTrigger] = useRefreshTriggerManager(WALLET_TOKEN_SELECTOR_REFRESH);
  const { result: addressOverview, loading } = useAddressOverview(principal, refreshTrigger);

  const tokenMaps = useMemo(() => {
    if (isUndefinedOrNull(addressOverview)) return undefined;
    return addressOverview.tokenList.tokens.map((token) => ({
      id: token.token,
      usd: token.balance,
      balance: token.amount,
    }));
  }, [addressOverview]);

  const allTokenIds = useMemo(() => {
    if (isUndefinedOrNull(tokenMaps)) return [];
    return tokenMaps.map((token) => token.id);
  }, [tokenMaps]);

  const allTokens = useTokens(allTokenIds);

  const formattedData = useMemo(() => {
    if (isUndefinedOrNull(tokenMaps)) return undefined;

    const filteredTokens = allTokens
      .map(([, token], index) => ({
        token,
        balance: tokenMaps[index].balance,
        usd: tokenMaps[index].usd,
      }))
      .filter((e) => !!e.token) as Array<{
      token: Token;
      balance: number;
      usd: number;
    }>;

    if (isUndefinedOrNull(search)) return filteredTokens;

    return filteredTokens.filter(({ token }) => !isTokenFiltered(token, search));
  }, [allTokens, tokenMaps, search]);

  return (
    <>
      {loading || isUndefinedOrNull(formattedData) ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : formattedData.length > 0 ? (
        formattedData.map(({ token, balance, usd }) => (
          <TokenRowUI key={token.address} token={token} tokenValue={String(usd)} balance={String(balance)} />
        ))
      ) : (
        <NoData />
      )}
    </>
  );
}

interface TaggedTokensProps {
  search: string | undefined;
}

function TaggedTokens({ search }: TaggedTokensProps) {
  const principal = useAccountPrincipalString();
  const [refreshTrigger] = useRefreshTriggerManager(WALLET_TOKEN_SELECTOR_REFRESH);
  const { result: addressOverview, loading } = useAddressOverview(principal, refreshTrigger);
  const { taggedTokens } = useTaggedTokenManager();

  const allTokens = useTokens(taggedTokens);

  const __allTokens = useMemo(() => {
    if (isUndefinedOrNull(addressOverview)) return undefined;

    const filteredTokens = allTokens
      .filter(([, token]) => !!token)
      .filter(([, token]) => {
        return !addressOverview.tokenList.tokens.find((e) => e.token === token?.address);
      })
      .map(([, token]) => token) as Array<Token>;
    if (isUndefinedOrNull(search)) return filteredTokens;
    return filteredTokens.filter((token) => !isTokenFiltered(token, search));
  }, [allTokens, search, addressOverview]);

  return (
    <>
      {loading ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : __allTokens && __allTokens.length > 0 ? (
        __allTokens.map((token) => <TokenRow key={token.address} token={token} />)
      ) : (
        <NoData />
      )}
    </>
  );
}

enum TAB {
  TokenList = "Your tokens",
  Other = "Custom tokens",
}

const Tabs = [
  { label: "Your tokens", value: TAB.TokenList },
  { label: "Custom tokens", value: TAB.Other },
];

export function TokenSelector() {
  const theme = useTheme();
  const { t } = useTranslation();
  const rotateAnimationLoading = useRotateAnimationLoading();
  const [__searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<TAB>(TAB.TokenList);
  const [searchKeyword, debouncedSearch] = useDebouncedChangeHandler(__searchKeyword, setSearchKeyword, 300);
  const [, setRefreshTrigger] = useRefreshTriggerManager(WALLET_TOKEN_SELECTOR_REFRESH);
  const [loading, setLoading] = useState(false);

  const handleRotateAnimation = useCallback(async () => {
    setRefreshTrigger();
    setLoading(true);
    await sleep(2000);
    setLoading(false);
  }, []);

  return (
    <DrawerWrapper
      padding="12px"
      title="Select tokens"
      prevPage={WalletManagerPage.Send}
      showRightIcon
      rightIcon={
        <Box
          sx={{ width: "24px", height: "24px", cursor: "pointer" }}
          className={`${rotateAnimationLoading.rotateAnimationLoading}${
            loading ? ` ${ROTATE_ANIMATION_LOADING_CLASS}` : ""
          }`}
        >
          <img width="100%" height="100%" src="/images/wallet/refresh.svg" alt="" />
        </Box>
      }
      onRightIconClick={handleRotateAnimation}
    >
      <Box
        sx={{
          margin: "24px 0 0 0",
          display: nonUndefinedOrNull(searchKeyword) && searchKeyword !== "" ? "none" : "block",
        }}
      >
        <Flex gap="0 24px">
          {Tabs.map((tab) => {
            return (
              <Typography
                key={tab.value}
                color={activeTab === tab.value ? "text.primary" : "text.secondary"}
                onClick={() => setActiveTab(tab.value)}
                sx={{ cursor: "pointer" }}
              >
                {tab.label}
              </Typography>
            );
          })}
        </Flex>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <FilledTextField
          contained
          borderRadius="16px"
          background={theme.palette.background.level1}
          placeholderSize="14px"
          fullWidth
          placeholder={t("common.search.token.desc")}
          textFieldProps={{
            slotProps: {
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color={theme.themeOption.textSecondary} size="14px" />
                  </InputAdornment>
                ),
                maxLength: 50,
              },
            },
          }}
          onChange={debouncedSearch}
        />
      </Box>

      <Box sx={{ width: "100%", overflowX: "hidden", margin: "24px 0 0 0", padding: "0 0 12px 0" }}>
        {activeTab === TAB.TokenList ? <TokenList search={searchKeyword} /> : null}
        {activeTab === TAB.Other ? <TaggedTokens search={searchKeyword} /> : null}
      </Box>
    </DrawerWrapper>
  );
}
