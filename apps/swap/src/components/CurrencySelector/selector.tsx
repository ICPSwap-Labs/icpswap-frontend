import React, { useState, useCallback, useMemo, useEffect } from "react";
import SwapModal from "components/modal/swap";
import { OutlinedInput, InputAdornment, useTheme, Typography, Box, Grid, useMediaQuery } from "@mui/material";
import { Search as SearchIcon, Edit as EditIcon } from "@mui/icons-material";
import { useTaggedTokenManager } from "store/swap/cache/hooks";
import { useSwapTokenList } from "store/global/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { isDarkTheme } from "utils";
import { Trans, t } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { NoData, DotLoading, TokenImage } from "components/index";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { useAccountPrincipal } from "store/auth/hooks";
import TokenStandardLabel from "components/token/TokenStandardLabel";
import ImportToken from "components/Wallet/ImportToken";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { parseTokenAmount, formatDollarAmount, BigNumber } from "@icpswap/utils";

export interface SwapToken {
  canisterId: string;
  name: string;
  symbol: string;
  decimals: number;
}

export function SelectedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.8194 5.62616L11.2078 8.72794L11.2182 8.77066C11.6467 10.5661 11.1517 12.4823 9.845 13.8491L9.80211 13.8935L9.75953 13.9366C9.54022 14.1584 9.18232 14.1594 8.96176 13.9388L6.02149 10.9986C5.98538 11.1008 5.92644 11.1967 5.84467 11.2785L2.8858 14.2374C2.59291 14.5303 2.11803 14.5303 1.82514 14.2374C1.53225 13.9445 1.53225 13.4696 1.82514 13.1767L4.78401 10.2178C4.86578 10.1361 4.96173 10.0771 5.06394 10.041L1.97911 6.95616C1.75942 6.73649 1.75942 6.38033 1.97911 6.16066C3.38921 4.75054 5.4202 4.23451 7.29417 4.73683L7.3409 4.74965L10.3912 1.19799C10.6024 0.952053 10.9766 0.93549 11.2087 1.15979L14.8507 4.80169C15.0822 5.03323 15.0678 5.41282 14.8194 5.62616ZM9.75997 9.12221C10.0052 10.1536 9.83186 11.2378 9.28122 12.137L6.53109 9.38684L3.78103 6.63677C4.71225 6.06653 5.84087 5.90134 6.90199 6.18467L6.94431 6.19627L7.86013 6.44734L8.47883 5.72695L10.8702 2.94255L13.0748 5.14719L10.2305 7.59001L9.53239 8.18955L9.75053 9.08353L9.75997 9.12221Z"
        fill="#8492C4"
      />
    </svg>
  );
}

export function SelectedIcon1() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.8176 5.62616C15.066 5.41282 15.0803 5.03323 14.8488 4.80169L11.2069 1.15979C10.9747 0.93549 10.6006 0.952053 10.3894 1.19799L7.33906 4.74965L7.29233 4.73683C5.41836 4.23451 3.38738 4.75054 1.97727 6.16066C1.75758 6.38033 1.75758 6.73649 1.97727 6.95616L5.46859 10.4475L8.95992 13.9388C9.18048 14.1594 9.53838 14.1584 9.75769 13.9366L9.80027 13.8935L9.84316 13.8491C11.1498 12.4823 11.6449 10.5661 11.2164 8.77066L11.2059 8.72794L14.8176 5.62616Z"
        fill="#8492C4"
      />
      <rect x="6" y="9" width="1.5" height="6.65675" rx="0.75" transform="rotate(45 6 9)" fill="#8492C4" />
    </svg>
  );
}

export interface TokenItemInfoProps {
  tokenInfo: SwapToken;
  onClick: (token: TokenInfo) => void;
  disabledCurrencyIds: string[];
  activeCurrencyIds: string[];
  onUpdateTokenAdditional?: (tokenId: string, balance: string) => void;
  search?: string;
}

export function TokenItemInfo({
  tokenInfo: _tokenInfo,
  onClick,
  disabledCurrencyIds,
  activeCurrencyIds,
  onUpdateTokenAdditional,
  search,
}: TokenItemInfoProps) {
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipal();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { result: tokenInfo } = useTokenInfo(_tokenInfo.canisterId);
  const { result: balance, loading } = useTokenBalance(_tokenInfo.canisterId, principal);
  const interfacePrice = useUSDPriceById(_tokenInfo.canisterId);

  const [taggedTokens, updateTaggedTokens, removeTaggedTokens] = useTaggedTokenManager();

  const tokenBalanceAmount = useMemo(() => {
    if (!tokenInfo || balance === undefined) return undefined;
    return parseTokenAmount(balance, tokenInfo.decimals).toFormat();
  }, [tokenInfo, balance]);

  const handleItemClick = () => {
    if (!tokenInfo) return;
    onClick(tokenInfo);
  };

  useEffect(() => {
    if (_tokenInfo && balance) {
      if (onUpdateTokenAdditional) onUpdateTokenAdditional(_tokenInfo.canisterId, balance.toString());
    }
  }, [_tokenInfo, balance]);

  const isTagged = taggedTokens.includes(_tokenInfo.canisterId);

  const handleToggleSelect = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (isTagged) {
      removeTaggedTokens([_tokenInfo.canisterId]);
    } else {
      updateTaggedTokens([_tokenInfo.canisterId]);
    }
  };

  const hidden = useMemo(() => {
    if (!search) return false;

    return (
      !_tokenInfo.symbol.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
      !_tokenInfo.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  }, [search, _tokenInfo]);

  return (
    <Grid
      item
      container
      alignItems="center"
      sx={{
        display: hidden ? "none" : "flex",
        height: "63px",
        cursor: "pointer",
        padding: matchDownSM ? "0 16px" : "0 24px",
        "&.disabled": {
          opacity: 0.5,
          cursor: "default",
        },
        "&.active": {
          background: theme.palette.background.level4,
          cursor: "default",
        },
      }}
      onClick={handleItemClick}
      className={`${
        tokenInfo?.canisterId ? (disabledCurrencyIds.includes(tokenInfo?.canisterId) ? "disabled" : "") : ""
      }${tokenInfo?.canisterId ? (activeCurrencyIds.includes(tokenInfo?.canisterId) ? " active" : "") : ""}`}
    >
      <Box
        sx={{
          width: "198px",
          "@media (max-width: 580px)": {
            width: "90px",
          },
        }}
      >
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

      <Box ml="12px">
        <TokenStandardLabel standard={tokenInfo?.standardType} />
      </Box>

      <Grid item xs>
        <Grid container justifyContent="flex-end" alignItems="center">
          <Box>
            <Grid container>
              {loading ? (
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

              <Grid
                item
                xs
                container
                alignItems="center"
                sx={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={handleToggleSelect}
              >
                {isTagged ? <SelectedIcon1 /> : <SelectedIcon />}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
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

type TokenAdditionalData = {
  [tokenId: string]: {
    balance: string;
  };
};

export default function Selector({
  open,
  onChange,
  onClose,
  disabledCurrencyIds = [],
  activeCurrencyIds = [],
  version,
}: SelectorProps) {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchKeyword, setSearchKeyword] = useState("");
  const [importTokenShow, setImportTokenShow] = useState(false);

  // const [tokenAdditionalData, setTokenAdditionalData] = useState({} as TokenAdditionalData);

  const [taggedTokenIds] = useTaggedTokenManager();
  const originList = useSwapTokenList(version);
  const isDark = isDarkTheme(theme);

  const list = useMemo(() => {
    const list: SwapToken[] = [...originList];

    // const new_list_tagged: SwapToken[] = [];
    // const new_list_has_balance: SwapToken[] = [];
    // const new_list_no_balance: SwapToken[] = [];

    // list.forEach((e) => {
    //   const tokenBalance = tokenAdditionalData[e.canisterId]?.balance ?? "0";

    //   if (taggedTokenIds.includes(e.canisterId)) {
    //     new_list_tagged.push(e);
    //   } else if (tokenBalance !== "0") {
    //     new_list_has_balance.push(e);
    //   } else {
    //     new_list_no_balance.push(e);
    //   }
    // });

    const new_list_tagged: SwapToken[] = [];
    const other_tokens: SwapToken[] = [];

    list.forEach((e) => {
      if (taggedTokenIds.includes(e.canisterId)) {
        new_list_tagged.push(e);
      } else {
        other_tokens.push(e);
      }
    });

    return new_list_tagged.concat(other_tokens);
  }, [originList, taggedTokenIds]);

  const handleTokenClick = useCallback(
    (token: TokenInfo) => {
      if (disabledCurrencyIds.includes(token?.canisterId.toString())) return;
      if (onChange) onChange(token);
    },
    [disabledCurrencyIds],
  );

  const handleSearchToken = useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(value);
  }, []);

  // const handleUpdateTokenAdditionalData = (tokenId: string, balance: string) => {
  //   setTokenAdditionalData((prevState) => ({
  //     ...prevState,
  //     [tokenId]: {
  //       balance,
  //     },
  //   }));
  // };

  const no_data = useMemo(() => {
    if (list.length === 0) return true;
    if (!searchKeyword) return list.length === 0;

    const filteredTokens = list.filter((tokenInfo) => {
      return (
        tokenInfo.symbol.toLocaleLowerCase().includes(searchKeyword.toLocaleLowerCase()) ||
        tokenInfo.name.toLocaleLowerCase().includes(searchKeyword.toLocaleLowerCase())
      );
    });

    return filteredTokens.length === 0;
  }, [list, searchKeyword]);

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
          <Box
            sx={{
              position: "relative",
              padding: matchDownSM ? "8px 16px" : "8px 24px",
            }}
          >
            <OutlinedInput
              fullWidth
              placeholder={t`Search name or canister ID`}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: theme.themeOption.textSecondary,
                    }}
                  />
                </InputAdornment>
              }
              inputProps={{
                maxLength: 50,
              }}
              onChange={handleSearchToken}
            />
          </Box>

          <Box sx={{ margin: "8px 0 24px 0", padding: matchDownSM ? "0 16px" : "0 24px" }}>
            <Typography sx={{ fontSize: "12px" }}>
              Disclaimer: Do your own research before investing. While we've collected known information about tokens on
              the list, it's essential to conduct your research.
            </Typography>
          </Box>

          <Box mt={2}>
            <Grid
              container
              mt={2}
              sx={{
                maxHeight: "295px",
                overflow: "auto",
                paddingBottom: "56px",
              }}
            >
              {list.map((token) => (
                <TokenItemInfo
                  key={token.canisterId.toString()}
                  tokenInfo={token}
                  disabledCurrencyIds={disabledCurrencyIds}
                  activeCurrencyIds={activeCurrencyIds}
                  onClick={handleTokenClick}
                  search={searchKeyword}
                />
              ))}
              {no_data ? <NoData /> : null}
            </Grid>
          </Box>
          <Grid
            container
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "56px",
              padding: matchDownSM ? "8px 16px" : "8px 24px",
              ...(isDark
                ? {
                    background: theme.palette.background.level4,
                  }
                : { color: "#9E9E9E", background: "#E0E0E0" }),
              cursor: "pointer",
            }}
            alignItems="center"
            justifyContent="center"
          >
            <EditIcon sx={{ fontSize: "1.2rem", marginRight: "8px", color: "#648EFB" }} />
            <Typography component="span" color="#648EFB" onClick={() => setImportTokenShow(true)}>
              <Trans>Import Token</Trans>
            </Typography>
          </Grid>
        </Box>
      </SwapModal>

      {importTokenShow ? <ImportToken open={importTokenShow} onClose={() => setImportTokenShow(false)} /> : null}
    </>
  );
}
