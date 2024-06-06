import { useState, useCallback, useMemo } from "react";
import SwapModal from "components/modal/swap";
import { InputAdornment, useTheme, Typography, Box, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useGlobalTokenList } from "store/global/hooks";
import { isDarkTheme } from "utils";
import { Trans, t } from "@lingui/macro";
import { FilledTextField, NoData } from "components/index";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { isValidPrincipal } from "@icpswap/utils";
import { Search as SearchIcon } from "react-feather";
import { DEFAULT_DISPLAYED_TOKENS } from "constants/wallet";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { TokenListMetadata } from "types/token-list";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { ImportToken } from "components/ImportToken/index";
import { useDebouncedChangeHandler } from "@icpswap/hooks";
import { TokenItem } from "./TokenItem";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      padding: "0 24px",
      "@media(max-width: 640px)": {
        padding: "0 16px",
      },
    },
  };
});

export interface SelectorProps {
  open: boolean;
  onChange: (token: TokenInfo) => void;
  onClose: () => void;
  disabledCurrencyIds?: string[];
  activeCurrencyIds?: string[];
}

export default function Selector({
  open,
  onChange,
  onClose,
  disabledCurrencyIds = [],
  activeCurrencyIds = [],
}: SelectorProps) {
  const theme = useTheme() as Theme;
  const isDark = isDarkTheme(theme);
  const classes = useStyles();

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchKeyword, setSearchKeyword] = useState("");
  const [importTokenCanceled, setImportTokenCanceled] = useState(false);
  const [hiddenCanisterIds, setHiddenCanisterIds] = useState<string[]>([]);

  const { result: snsAllTokensInfo } = useFetchSnsAllTokensInfo();
  const globalTokenList = useGlobalTokenList();

  const { taggedTokens } = useTaggedTokenManager();

  const yourTokens: string[] = useMemo(() => {
    return [...new Set(DEFAULT_DISPLAYED_TOKENS.map((e) => e.address).concat(taggedTokens))];
  }, [DEFAULT_DISPLAYED_TOKENS, taggedTokens]);

  const { snsTokens, noneSnsTokens } = useMemo(() => {
    if (!snsAllTokensInfo) return {};

    const snsTokens: TokenListMetadata[] = [];
    const noneSnsTokens: TokenListMetadata[] = [];

    globalTokenList
      .filter((token) => {
        return !yourTokens.includes(token.canisterId);
      })
      .forEach((token) => {
        const snsTokenInfo = snsAllTokensInfo.find((e) => e.canister_ids.ledger_canister_id === token.canisterId);

        if (snsTokenInfo?.canister_ids.root_canister_id) {
          snsTokens.push(token);
        } else {
          noneSnsTokens.push(token);
        }
      });

    return { snsTokens: snsTokens.map((e) => e.canisterId), noneSnsTokens: noneSnsTokens.map((e) => e.canisterId) };
  }, [globalTokenList, yourTokens, snsAllTokensInfo]);

  const handleTokenClick = useCallback(
    (token: TokenInfo) => {
      if (disabledCurrencyIds.includes(token?.canisterId.toString())) return;
      if (onChange) onChange(token);
    },
    [disabledCurrencyIds],
  );

  const handleSearchToken = useCallback((value: string) => {
    setImportTokenCanceled(false);
    setSearchKeyword(value);
  }, []);

  const [, debouncedSearch] = useDebouncedChangeHandler(searchKeyword, handleSearchToken, 300);

  const showImportToken = useMemo(() => {
    if (!searchKeyword || !yourTokens || !noneSnsTokens || !snsTokens) return false;

    if (isValidPrincipal(searchKeyword)) {
      return !yourTokens.concat(noneSnsTokens).concat(snsTokens).includes(searchKeyword);
    }

    return false;
  }, [searchKeyword, yourTokens, noneSnsTokens, snsTokens]);

  const handleTokenHidden = (canisterId: string, hidden: boolean) => {
    const index = hiddenCanisterIds.indexOf(canisterId);

    if (index !== -1) {
      if (!hidden) {
        setHiddenCanisterIds((prevState) => {
          const newCanisterIds = [...prevState];
          newCanisterIds.splice(index, 1);
          return [...newCanisterIds];
        });
      }
      return;
    }

    if (hidden) {
      setHiddenCanisterIds((prevState) => {
        const newCanisterIds = [...prevState, canisterId];
        return [...newCanisterIds];
      });
    }
  };

  const allTokenCanisterIds = useMemo(() => {
    return [...new Set([...yourTokens, ...(snsTokens ?? []), ...(noneSnsTokens ?? [])])];
  }, [yourTokens, snsTokens, noneSnsTokens]);

  const noData = useMemo(() => {
    return hiddenCanisterIds.length === allTokenCanisterIds.length && showImportToken === false;
  }, [hiddenCanisterIds, allTokenCanisterIds, showImportToken]);

  return (
    <>
      <SwapModal
        open={open}
        title={t`Select a token`}
        onClose={onClose}
        dialogProps={{
          sx: {
            "& .MuiDialog-paper": {
              padding: "0",
              width: "570px",
              backgroundColor: isDark ? theme.palette.background.level2 : theme.colors.lightGray200,
            },
            "& .MuiDialogContent-root": {
              padding: "0",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box sx={{ padding: matchDownSM ? "0 16px" : "0 24px" }}>
            <Typography sx={{ fontSize: "12px" }}>
              Do your own research before investing. While we've collected known information about tokens on the list,
              it's essential to conduct your research.
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              margin: "8px 0 0 0",
              padding: matchDownSM ? "0 16px" : "0 24px",
            }}
          >
            <FilledTextField
              contained
              borderRadius="8px"
              background={theme.palette.background.level1}
              placeholderSize="14px"
              fullWidth
              placeholder={t`Search name or canister ID`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color={theme.themeOption.textSecondary} size="14px" />
                  </InputAdornment>
                ),
                maxLength: 50,
              }}
              onChange={debouncedSearch}
            />
          </Box>

          <Box sx={{ margin: "24px 0", width: "100%", height: "1px", background: theme.palette.background.level4 }} />

          <Box sx={{ height: "386px", overflow: "hidden auto" }}>
            {noData ? <NoData /> : null}

            {showImportToken && searchKeyword && isValidPrincipal(searchKeyword) && !importTokenCanceled ? (
              <Box className={classes.wrapper}>
                <ImportToken canisterId={searchKeyword} onCancel={() => setImportTokenCanceled(true)} />
              </Box>
            ) : null}

            <Box>
              {searchKeyword ? null : (
                <Box className={classes.wrapper}>
                  <Typography fontSize="16px">
                    <Trans>Your Tokens</Trans>
                  </Typography>
                </Box>
              )}

              <Box mt={searchKeyword ? "0px" : "16px"}>
                {(yourTokens ?? []).map((tokenId) => (
                  <TokenItem
                    key={tokenId}
                    canisterId={tokenId}
                    onClick={handleTokenClick}
                    searchWord={searchKeyword}
                    showBalance
                    onTokenHide={handleTokenHidden}
                    isActive={activeCurrencyIds.includes(tokenId)}
                    isDisabled={disabledCurrencyIds.includes(tokenId)}
                  />
                ))}
              </Box>
            </Box>

            <Box mt={searchKeyword ? "0px" : "16px"}>
              {searchKeyword ? null : (
                <Typography className={classes.wrapper} fontSize="16px">
                  <Trans>Token List</Trans>
                </Typography>
              )}

              <Box mt={searchKeyword ? "0px" : "16px"}>
                {searchKeyword ? null : (
                  <Typography className={classes.wrapper} fontSize="12px" fontWeight={500}>
                    <Trans>SNS Tokens</Trans>
                  </Typography>
                )}

                <Box mt={searchKeyword ? "0px" : "16px"}>
                  {(snsTokens ?? []).map((tokenId) => (
                    <TokenItem
                      key={tokenId}
                      canisterId={tokenId}
                      onClick={handleTokenClick}
                      searchWord={searchKeyword}
                      onTokenHide={handleTokenHidden}
                      isActive={activeCurrencyIds.includes(tokenId)}
                      isDisabled={disabledCurrencyIds.includes(tokenId)}
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={searchKeyword ? "0px" : "16px"}>
                {searchKeyword ? null : (
                  <Typography className={classes.wrapper} fontSize="12px" fontWeight={500}>
                    <Trans>Other Tokens</Trans>
                  </Typography>
                )}

                <Box mt={searchKeyword ? "0px" : "16px"}>
                  {(noneSnsTokens ?? []).map((tokenId) => (
                    <TokenItem
                      key={tokenId}
                      canisterId={tokenId}
                      onClick={handleTokenClick}
                      searchWord={searchKeyword}
                      onTokenHide={handleTokenHidden}
                      isActive={activeCurrencyIds.includes(tokenId)}
                      isDisabled={disabledCurrencyIds.includes(tokenId)}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </SwapModal>
    </>
  );
}
