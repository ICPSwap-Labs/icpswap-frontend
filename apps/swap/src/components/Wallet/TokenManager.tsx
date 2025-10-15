import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useToken, useTokens } from "hooks";
import { IOSSwitch } from "components/switch/IOSSwitch";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Typography, InputAdornment, useTheme } from "components/Mui";
import { FilledTextField, Flex, LoadingRow, NoData, TokenImage } from "components/index";
import { useGlobalTokenList } from "store/global/hooks";
import { useStateSnsAllTokensInfo } from "store/sns/hooks";
import { isUndefinedOrNull, isValidPrincipal, nonUndefinedOrNull } from "@icpswap/utils";
import { Search as SearchIcon } from "react-feather";
import { TokenListMetadata } from "types/token-list";
import { useDebouncedChangeHandler } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";
import { getNnsRootId, tokenEqualToNnsLedger } from "utils/sns/utils";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { ICP } from "@icpswap/tokens";
import { getTokenStandard } from "hooks/token";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { registerTokens } from "@icpswap/token-adapter";

function isTokenHidden(token: Token, search: string) {
  return !(
    token.name.toLowerCase().includes(search.toLowerCase()) ||
    token.symbol.toLowerCase().includes(search.toLowerCase()) ||
    token.address.toLowerCase().includes(search.toLowerCase())
  );
}

interface TokenRowProps {
  token: Token;
}

function TokenRow({ token }: TokenRowProps) {
  const { taggedTokens, updateTaggedTokens, deleteTaggedTokens } = useTaggedTokenManager();

  const checked = useMemo(() => {
    return taggedTokens.includes(token.address);
  }, [taggedTokens, token]);

  const handleCheckChange = useCallback(
    (event, checked: boolean) => {
      if (checked) {
        updateTaggedTokens([token.address]);
      } else {
        deleteTaggedTokens([token.address]);
      }
    },
    [token],
  );

  return (
    <Flex justify="space-between" fullWidth sx={{ margin: "0 0 20px 0" }}>
      <Flex gap="0 12px">
        <TokenImage tokenId={token.address} logo={token.logo} size="40px" />
        <Box>
          <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>{token?.symbol}</Typography>
          <Typography sx={{ fontSize: "12px", margin: "4px 0 0 0" }}>{token?.name}</Typography>
        </Box>
      </Flex>

      <IOSSwitch checked={checked} onChange={handleCheckChange} />
    </Flex>
  );
}

interface ImportableTokenProps {
  tokenId: string;
}

function ImportableToken({ tokenId }: ImportableTokenProps) {
  const [noStandard, setNoStandard] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [__tokenId, setTokenId] = useState<string | undefined>(undefined);

  const updateTokenStandard = useUpdateTokenStandard();

  useEffect(() => {
    async function call() {
      const standard = await getTokenStandard({ canisterId: tokenId });

      if (isUndefinedOrNull(standard)) {
        setNoStandard(true);
      } else {
        updateTokenStandard([{ canisterId: tokenId, standard }]);
        registerTokens([{ canisterId: tokenId, standard }]);
        setRegisterSuccess(true);
      }
    }

    call();
  }, [tokenId]);

  useEffect(() => {
    if (registerSuccess) {
      setTokenId(tokenId);
    }
  }, [registerSuccess, tokenId]);

  const [, token] = useToken(__tokenId);

  return noStandard ? (
    <Typography>no standard</Typography>
  ) : !token ? (
    <LoadingRow>
      <div />
      <div />
      <div />
      <div />
    </LoadingRow>
  ) : (
    <TokenRow key={token.address} token={token} />
  );
}

enum TAB {
  SNS = "Sns",
  OTHER = "Other",
}

const Tabs = [
  { label: "SNS tokens", value: TAB.SNS },
  { label: "Other tokens", value: TAB.OTHER },
];

export function TokenManager() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<TAB>(TAB.SNS);
  const { setPages } = useWalletContext();
  const [, debouncedSearch] = useDebouncedChangeHandler(searchKeyword, setSearchKeyword, 300);

  const globalTokenList = useGlobalTokenList();
  const snsAllTokensInfo = useStateSnsAllTokensInfo();

  const { snsTokens, noneSnsTokens } = useMemo(() => {
    if (!snsAllTokensInfo) return {};

    const snsTokens: TokenListMetadata[] = [];
    const noneSnsTokens: TokenListMetadata[] = [];

    const sortedGlobalTokenList = [...globalTokenList].sort((a, b) => {
      if (a.rank < b.rank) return -1;
      if (a.rank > b.rank) return 1;
      return 0;
    });

    sortedGlobalTokenList.forEach((token) => {
      const snsTokenInfo = snsAllTokensInfo.find((nns) => tokenEqualToNnsLedger(nns, token.canisterId));

      if (getNnsRootId(snsTokenInfo)) {
        snsTokens.push(token);
      } else {
        noneSnsTokens.push(token);
      }
    });

    return {
      snsTokens: snsTokens.map((e) => e.canisterId),
      noneSnsTokens: [ICP.address, ...noneSnsTokens.map((e) => e.canisterId)],
    };
  }, [globalTokenList, snsAllTokensInfo]);

  const allTokenIds = useMemo(() => {
    if (isUndefinedOrNull(snsTokens) || isUndefinedOrNull(noneSnsTokens)) return [];
    return [...snsTokens, ...noneSnsTokens];
  }, [snsTokens, noneSnsTokens, activeTab, searchKeyword]);

  const allTokens = useTokens(allTokenIds);

  const tokens = useMemo(() => {
    if (isUndefinedOrNull(snsTokens) || isUndefinedOrNull(noneSnsTokens)) return [];

    return allTokens
      .map(([, token]) => token)
      .filter((token) => {
        return (
          nonUndefinedOrNull(token) &&
          !isTokenHidden(token, searchKeyword) &&
          (activeTab === TAB.SNS ? snsTokens.includes(token.address) : noneSnsTokens.includes(token.address))
        );
      }) as Token[];
  }, [allTokens, searchKeyword, activeTab]);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  const importableToken = useMemo(() => {
    if (isUndefinedOrNull(searchKeyword) || searchKeyword === "" || !isValidPrincipal(searchKeyword)) return undefined;
    if (allTokenIds.includes(searchKeyword)) return undefined;

    return searchKeyword;
  }, [searchKeyword, allTokenIds]);

  return (
    <DrawerWrapper padding="12px" title="Manage tokens" onPrev={handlePrev}>
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <Box sx={{ margin: "24px 0 0 0" }}>
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

        <Box
          sx={{
            margin: "20px 0 0 0",
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

        <Box sx={{ width: "100%", overflowX: "hidden", margin: "24px 0 0 0", padding: "0 0 12px 0" }}>
          {nonUndefinedOrNull(importableToken) ? (
            <ImportableToken tokenId={importableToken} />
          ) : tokens.length === 0 ? (
            <NoData />
          ) : (
            tokens.map((token) => <TokenRow key={token.address} token={token} />)
          )}
        </Box>
      </Box>
    </DrawerWrapper>
  );
}
