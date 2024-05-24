import React, { useState, useCallback, useMemo, useEffect } from "react";
import SwapModal from "components/modal/swap";
import { InputAdornment, useTheme, Typography, Box, Grid, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useGlobalTokenList, useFetchAllSwapTokens } from "store/global/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { isDarkTheme } from "utils";
import { Trans, t } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { DotLoading, TokenImage, FilledTextField } from "components/index";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { useAccountPrincipal } from "store/auth/hooks";
import TokenStandardLabel from "components/token/TokenStandardLabel";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { parseTokenAmount, formatDollarAmount, BigNumber, isValidPrincipal } from "@icpswap/utils";
import { Search as SearchIcon, PlusCircle } from "react-feather";
import { DEFAULT_DISPLAYED_TOKENS } from "constants/wallet";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { TokenListMetadata } from "types/token-list";
import { type AllTokenOfSwapTokenInfo } from "@icpswap/types";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { ImportToken } from "components/ImportToken/index";

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

export interface SwapToken {
  canisterId: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface TokenItemInfoProps {
  tokenInfo: AllTokenOfSwapTokenInfo;
  canisterId: string;
  onClick: (token: TokenInfo) => void;
  disabledCurrencyIds: string[];
  activeCurrencyIds: string[];
  onUpdateTokenAdditional?: (tokenId: string, balance: string) => void;
  search?: string;
  showBalance?: boolean;
}

export function TokenItemInfo({
  tokenInfo: _tokenInfo,
  canisterId,
  onClick,
  disabledCurrencyIds,
  activeCurrencyIds,
  onUpdateTokenAdditional,
  search,
  showBalance,
}: TokenItemInfoProps) {
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipal();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const getBalanceId = useMemo(() => {
    if (showBalance) return canisterId;
    return undefined;
  }, [showBalance, canisterId]);

  const { result: tokenInfo } = useTokenInfo(canisterId);
  const { result: balance, loading } = useTokenBalance(getBalanceId, principal);
  const interfacePrice = useUSDPriceById(getBalanceId);

  const { taggedTokens, updateTaggedTokens, deleteTaggedTokens } = useTaggedTokenManager();

  const tokenBalanceAmount = useMemo(() => {
    if (!tokenInfo || balance === undefined) return undefined;
    return parseTokenAmount(balance, tokenInfo.decimals).toFormat();
  }, [tokenInfo, balance]);

  const handleItemClick = () => {
    if (!tokenInfo) return;
    onClick(tokenInfo);
  };

  useEffect(() => {
    if (canisterId && balance) {
      if (onUpdateTokenAdditional) onUpdateTokenAdditional(canisterId, balance.toString());
    }
  }, [canisterId, balance]);

  const isTagged = taggedTokens.includes(canisterId);

  const handleAddToCache = (event: React.MouseEvent<SVGAElement>) => {
    event.stopPropagation();

    if (isTagged) {
      deleteTaggedTokens([canisterId]);
    } else {
      updateTaggedTokens([canisterId]);
    }
  };

  const hidden = useMemo(() => {
    if (!search) return false;

    if (isValidPrincipal(search)) {
      return _tokenInfo.ledger_id.toString() !== search;
    }

    return (
      !_tokenInfo.symbol.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
      !_tokenInfo.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  }, [search, _tokenInfo]);

  return (
    <Box
      sx={{
        display: hidden ? "none" : "grid",
        height: "63px",
        cursor: "pointer",
        padding: matchDownSM ? "0 16px" : "0 24px",
        gridTemplateColumns: "198px 50px 1fr",
        gap: "0 5px",
        alignItems: "center",
        "&.disabled": {
          opacity: 0.5,
          cursor: "default",
        },
        "&.active": {
          background: theme.palette.background.level4,
          cursor: "default",
        },
        "&:hover": {
          background: theme.palette.background.level4,
        },
        "@media (max-width: 580px)": {
          gridTemplateColumns: "90px 50px 1fr",
        },
      }}
      onClick={handleItemClick}
      className={`${
        tokenInfo?.canisterId ? (disabledCurrencyIds.includes(tokenInfo?.canisterId) ? "disabled" : "") : ""
      }${tokenInfo?.canisterId ? (activeCurrencyIds.includes(tokenInfo?.canisterId) ? " active" : "") : ""}`}
    >
      <Box>
        <Grid container alignItems="center">
          <TokenImage logo={tokenInfo?.logo} size={matchDownSM ? "18px" : "40px"} tokenId={tokenInfo?.canisterId} />

          <Grid item xs ml="6px" sx={{ overflow: "hidden" }}>
            <Grid container alignItems="center">
              <Box sx={{ width: "100%" }}>
                <Typography
                  color="text.primary"
                  sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {tokenInfo?.symbol}
                </Typography>
                <Typography fontSize="12px" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tokenInfo?.name}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <TokenStandardLabel standard={tokenInfo?.standardType} borderRadius="34px" height="20px" fontSize="10px" />
      </Box>

      <Box>
        <Grid container justifyContent="flex-end" alignItems="center">
          {!showBalance ? null : loading ? (
            <DotLoading loading />
          ) : (
            <Box>
              <Typography
                color="text.primary"
                align="right"
                sx={{
                  maxWidth: "10rem",
                  "@media (max-width: 580px)": {
                    fontSize: "12px",
                  },
                }}
                fontWeight={500}
              >
                {tokenBalanceAmount ?? "--"}
              </Typography>
              <Typography
                align="right"
                sx={{
                  "@media (max-width: 580px)": {
                    fontSize: "12px",
                  },
                }}
              >
                {interfacePrice !== undefined && balance !== undefined && tokenInfo !== undefined
                  ? formatDollarAmount(
                      new BigNumber(interfacePrice)
                        .multipliedBy(parseTokenAmount(balance, tokenInfo.decimals))
                        .toString(),
                      4,
                      true,
                      0.001,
                    )
                  : "--"}
              </Typography>
            </Box>
          )}

          {showBalance ? null : (
            <PlusCircle color={theme.themeOption.textSecondary} size="16px" onClick={handleAddToCache} />
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export interface SelectorProps {
  open: boolean;
  onChange: (token: TokenInfo) => void;
  onClose: () => void;
  disabledCurrencyIds?: string[];
  activeCurrencyIds?: string[];
  version?: "v2" | "v3";
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

  const { result: allTokensOfSwap } = useFetchAllSwapTokens();

  const { result: snsAllTokensInfo } = useFetchSnsAllTokensInfo();
  const globalTokenList = useGlobalTokenList();

  const { taggedTokens } = useTaggedTokenManager();

  const yourTokens: string[] = useMemo(() => {
    return DEFAULT_DISPLAYED_TOKENS.map((e) => e.address).concat(taggedTokens);
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

  const yourTokenList = useMemo(() => {
    if (!allTokensOfSwap) return undefined;

    const tokens = yourTokens
      .map((tokenId) => {
        return allTokensOfSwap.find((token) => token.ledger_id.toString() === tokenId);
      })
      .filter((token) => !!token) as AllTokenOfSwapTokenInfo[];

    return tokens;
  }, [allTokensOfSwap, yourTokens]);

  const snsTokenList = useMemo(() => {
    if (!allTokensOfSwap || !snsTokens) return undefined;
    const tokens = allTokensOfSwap.filter((token) => snsTokens.includes(token.ledger_id.toString()));
    return tokens;
  }, [allTokensOfSwap, snsTokens]);

  const noneTokenList = useMemo(() => {
    if (!allTokensOfSwap || !noneSnsTokens) return undefined;
    const tokens = allTokensOfSwap.filter((token) => noneSnsTokens.includes(token.ledger_id.toString()));
    return tokens;
  }, [allTokensOfSwap, noneSnsTokens]);

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

  const noToken = useMemo(() => {
    if (!searchKeyword || !yourTokenList || !noneTokenList || !snsTokenList) return false;

    const tokenList = yourTokenList.concat(noneTokenList).concat(snsTokenList);

    if (isValidPrincipal(searchKeyword)) {
      return !tokenList.find((token) => token.ledger_id.toString() === searchKeyword);
    }

    return !tokenList.find(
      (token) =>
        token.symbol.toLocaleLowerCase().includes(searchKeyword.toLocaleLowerCase()) ||
        token.name.toLocaleLowerCase().includes(searchKeyword.toLocaleLowerCase()),
    );
  }, [searchKeyword, yourTokenList, noneTokenList, snsTokenList]);

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
              onChange={handleSearchToken}
            />
          </Box>

          <Box sx={{ margin: "24px 0", width: "100%", height: "1px", background: theme.palette.background.level4 }} />

          <Box sx={{ height: "386px", overflow: "hidden auto" }}>
            {noToken && searchKeyword && isValidPrincipal(searchKeyword) && !importTokenCanceled ? (
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
                {(yourTokenList ?? []).map((token) => (
                  <TokenItemInfo
                    key={token.ledger_id.toString()}
                    tokenInfo={token}
                    canisterId={token.ledger_id.toString()}
                    disabledCurrencyIds={disabledCurrencyIds}
                    activeCurrencyIds={activeCurrencyIds}
                    onClick={handleTokenClick}
                    search={searchKeyword}
                    showBalance
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
                    <Trans>SNS</Trans>
                  </Typography>
                )}

                <Box mt={searchKeyword ? "0px" : "16px"}>
                  {(snsTokenList ?? []).map((token) => (
                    <TokenItemInfo
                      key={token.ledger_id.toString()}
                      tokenInfo={token}
                      canisterId={token.ledger_id.toString()}
                      disabledCurrencyIds={disabledCurrencyIds}
                      activeCurrencyIds={activeCurrencyIds}
                      onClick={handleTokenClick}
                      search={searchKeyword}
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={searchKeyword ? "0px" : "16px"}>
                {searchKeyword ? null : (
                  <Typography className={classes.wrapper} fontSize="12px" fontWeight={500}>
                    <Trans>Other</Trans>
                  </Typography>
                )}

                <Box mt={searchKeyword ? "0px" : "16px"}>
                  {(noneTokenList ?? []).map((token) => (
                    <TokenItemInfo
                      key={token.ledger_id.toString()}
                      tokenInfo={token}
                      canisterId={token.ledger_id.toString()}
                      disabledCurrencyIds={disabledCurrencyIds}
                      activeCurrencyIds={activeCurrencyIds}
                      onClick={handleTokenClick}
                      search={searchKeyword}
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
