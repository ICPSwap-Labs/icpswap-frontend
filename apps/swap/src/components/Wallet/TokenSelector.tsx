import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useTokens, useUSDPrice } from "hooks/index";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Typography, InputAdornment, useTheme } from "components/Mui";
import { FilledTextField, Flex, LoadingRow, NoData, TokenImage } from "components/index";
import { useGlobalTokenList } from "store/global/hooks";
import { useStateSnsAllTokensInfo } from "store/sns/hooks";
import {
  BigNumber,
  formatAmount,
  formatDollarAmount,
  isUndefinedOrNull,
  nonUndefinedOrNull,
  parseTokenAmount,
} from "@icpswap/utils";
import { Search as SearchIcon } from "react-feather";
import { TokenListMetadata } from "types/token-list";
import { useDebouncedChangeHandler } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";
import { getNnsRootId, tokenEqualToNnsLedger } from "utils/sns/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { Token } from "@icpswap/swap-sdk";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ICP } from "@icpswap/tokens";

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
  const principal = useAccountPrincipalString();
  const { result: tokenBalance } = useTokenBalance(token.address, principal);
  const tokenUSDPrice = useUSDPrice(token);

  const { setSendToken, setPages } = useWalletContext();

  const parsedTokenBalance = useMemo(() => {
    if (isUndefinedOrNull(tokenBalance)) return undefined;
    return parseTokenAmount(tokenBalance, token.decimals).toString();
  }, [tokenBalance, token]);

  const tokenValue = useMemo(() => {
    if (isUndefinedOrNull(tokenUSDPrice) || isUndefinedOrNull(parsedTokenBalance)) return undefined;
    return new BigNumber(parsedTokenBalance).multipliedBy(tokenUSDPrice).toString();
  }, [tokenUSDPrice, parsedTokenBalance]);

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
          {parsedTokenBalance ? formatAmount(parsedTokenBalance) : "--"}
        </Typography>
        <Typography sx={{ fontSize: "12px" }}>{tokenValue ? formatDollarAmount(tokenValue) : "--"}</Typography>
      </Flex>
    </Flex>
  );
}

let PAGE_SIZE = 12;
const START_PAGE = 1;

export function TokenSelector() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(START_PAGE);

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
      noneSnsTokens: noneSnsTokens.map((e) => e.canisterId),
    };
  }, [globalTokenList, snsAllTokensInfo]);

  const allTokenIds = useMemo(() => {
    if (isUndefinedOrNull(snsTokens) || isUndefinedOrNull(noneSnsTokens)) return [];
    return [ICP.address, ...snsTokens, ...noneSnsTokens];
  }, [snsTokens, noneSnsTokens, searchKeyword]);

  const allTokens = useTokens(allTokenIds);

  const tokens = useMemo(() => {
    if (isUndefinedOrNull(snsTokens) || isUndefinedOrNull(noneSnsTokens)) return [];

    return allTokens
      .map(([, token]) => token)
      .filter((token) => {
        return nonUndefinedOrNull(token) && !isTokenHidden(token, searchKeyword);
      }) as Token[];
  }, [allTokens, searchKeyword]);

  const slicedTokens = useMemo(() => {
    return tokens.slice(0, PAGE_SIZE * page);
  }, [tokens, page]);

  const hasMore = useMemo(() => {
    if (!slicedTokens || !tokens) return true;
    if (slicedTokens.length === 0 || tokens.length === 0) return true;

    return slicedTokens.length !== tokens.length;
  }, [slicedTokens, tokens]);

  const handleScrollNext = useCallback(() => {
    setPage(page + 1);
  }, [setPage, page]);

  // Calculate the number of tokens per page based on the page height to ensure proper scrolling.
  useEffect(() => {
    const wrapper = document.querySelector("#tokens-wrapper");

    if (wrapper) {
      // 24 is the input margin
      // 48 is the input height
      // 24 is the tokens wrapper margin
      // 12 is the padding value
      // 5 is the extra value that was subtracted.
      const tokensWrapperHeight = wrapper.clientHeight - 24 - 48 - 24 - 12 - 5;

      // Wrapper height div the token item's height and margin
      const tokensNumber = Math.ceil(tokensWrapperHeight / (40 + 24));
      // Plus 1 to ensure the scrollbar is rendered.
      PAGE_SIZE = tokensNumber + 1;
    }
  }, []);

  return (
    <DrawerWrapper padding="12px" title="Select tokens" prevPage={WalletManagerPage.Send}>
      <Box id="tokens-wrapper" sx={{ height: "calc(100vh - 24px - 12px)", overflow: "auto" }}>
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

        <Box sx={{ width: "100%", overflowX: "hidden", margin: "24px 0 0 0", padding: "0 0 12px 0" }}>
          <Box
            sx={{
              height: "calc(100vh - 24px - 12px - 24px - 48px - 24px - 12px - 5px)",
              width: slicedTokens.length < PAGE_SIZE ? "100%" : "361px",
              overflow: "auto",
            }}
            id="scrollableDiv"
          >
            <InfiniteScroll
              dataLength={slicedTokens.length}
              next={handleScrollNext}
              hasMore={hasMore}
              loader={
                <LoadingRow>
                  <div />
                  <div />
                  <div />
                  <div />
                </LoadingRow>
              }
              scrollableTarget="scrollableDiv"
              hasChildren
            >
              {slicedTokens && slicedTokens.length > 0 ? (
                slicedTokens.map((token) => <TokenRow key={token.address} token={token} />)
              ) : (
                <NoData />
              )}
            </InfiniteScroll>
          </Box>
        </Box>
      </Box>
    </DrawerWrapper>
  );
}
