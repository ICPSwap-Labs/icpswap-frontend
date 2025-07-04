import { useEffect, useMemo, useState, useRef } from "react";
import { Box, Typography, InputAdornment, useTheme, useMediaQuery } from "components/Mui";
import { FilledTextField, TokenImage } from "components/index";
import { ReactComponent as SearchIcon } from "assets/icons/Search.svg";
import { useHistory } from "react-router-dom";
import { ReactComponent as HotIcon } from "assets/icons/swap-pro/hot.svg";
import { useInfoAllTokens } from "@icpswap/hooks";
import { isValidPrincipal, formatDollarTokenPrice, nonUndefinedOrNull, shortenString, BigNumber } from "@icpswap/utils";
import type { IcpSwapAPITokenInfo, InfoTokenRealTimeDataResponse, Null } from "@icpswap/types";
import { NoData, Proportion } from "@icpswap/ui";
import { useToken } from "hooks/index";
import { ICP } from "@icpswap/tokens";
import DialogCloseIcon from "assets/images/icons/dialog-close";
import { useGlobalTokenList, useStateSwapAllTokens } from "store/global/hooks";
import { ReactComponent as TokenListIcon } from "assets/icons/token-list.svg";
import { useTranslation } from "react-i18next";

interface SearchItemProps {
  tokenInfo: IcpSwapAPITokenInfo;
  infoAllTokens: InfoTokenRealTimeDataResponse[] | Null;
  onTokenClick?: (token: IcpSwapAPITokenInfo) => void;
  inTokenList?: boolean;
}

function SearchItem({ tokenInfo, infoAllTokens, onTokenClick, inTokenList }: SearchItemProps) {
  const history = useHistory();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [, token] = useToken(tokenInfo.ledgerId);

  const info = useMemo(() => {
    return infoAllTokens?.find((e) => e.tokenLedgerId === tokenInfo.ledgerId);
  }, [infoAllTokens]);

  const handleTokenClick = () => {
    if (onTokenClick) onTokenClick(tokenInfo);
    history.push(`/swap/pro?input=${ICP.address}&output=${tokenInfo.ledgerId}`);
  };

  return (
    <Box
      sx={{
        display: "grid",
        alignItems: "center",
        padding: "16px 0",
        gridTemplateColumns: "1fr 120px 80px",
        cursor: "pointer",
        borderBottom: "1px solid #303652",
        "&:last-of-type": {
          borderBottom: "none",
        },
        "@media(max-width: 640px)": {
          gridTemplateColumns: "1fr 120px",
        },
      }}
      onClick={handleTokenClick}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "0 8px" }}>
        <TokenImage size="24px" logo={token?.logo} />
        <Typography
          color="text.primary"
          sx={{
            fontSize: "16px",
            "@media(max-width: 640px)": {
              fontSize: "14px",
            },
          }}
        >
          {tokenInfo.symbol}
        </Typography>
        <Typography
          sx={{
            "@media(max-width: 640px)": {
              fontSize: "12px",
            },
          }}
        >
          ({shortenString(tokenInfo.name, 12)})
        </Typography>
        {inTokenList ? <TokenListIcon /> : null}
      </Box>

      <Typography
        color="text.primary"
        sx={{
          fontSize: "16px",
          textAlign: "right",
          "@media(max-width: 640px)": {
            fontSize: "14px",
          },
        }}
      >
        {info ? formatDollarTokenPrice(info.price, { min: 0.0001 }) : "--"}
      </Typography>

      {matchDownSM ? null : info ? (
        <Proportion value={info.priceChange24H} align="right" />
      ) : (
        <Typography align="right">--</Typography>
      )}
    </Box>
  );
}

export interface SearchProps {
  open: boolean;
  onClose: () => void;
}

export function TokenSearch({ open, onClose }: SearchProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const [search, setSearch] = useState<string>("");
  const infoAllTokens = useInfoAllTokens();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const hotTokens = useMemo(() => {
    return infoAllTokens
      ?.filter((e) => e.tokenSymbol !== "ICP")
      .sort((a, b) => {
        if (new BigNumber(a.volumeUSD24H).isLessThan(b.volumeUSD24H)) return 1;
        if (new BigNumber(a.volumeUSD24H).isGreaterThan(b.volumeUSD24H)) return -1;
        return 0;
      })
      .slice(0, 5);
  }, [infoAllTokens]);

  const allTokens = useStateSwapAllTokens();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const filteredTokens = useMemo(() => {
    if (!allTokens || !search) return [];
    if (isValidPrincipal(search)) return allTokens.filter((e) => e.ledgerId === search);
    return allTokens
      .filter((e) => e.symbol !== "ICP" && e.symbol !== "WICP")
      .filter(
        (e) =>
          e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          e.symbol.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      );
  }, [search, allTokens]);

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  const handleHotTokenClick = (token: InfoTokenRealTimeDataResponse) => {
    handleClose();
    history.push(`/swap/pro?input=${ICP.address}&output=${token.tokenLedgerId}`);
  };

  const handleStopPropagation = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, inputRef]);

  const globalTokenList = useGlobalTokenList();

  const { filteredTokenListTokens, filteredNonTokenListTokens } = useMemo(() => {
    let filteredTokenListTokens: IcpSwapAPITokenInfo[] = [];
    let filteredNonTokenListTokens: IcpSwapAPITokenInfo[] = [];

    filteredTokens.forEach((e) => {
      const token = globalTokenList.find((_e) => _e.canisterId === e.ledgerId);

      if (nonUndefinedOrNull(token)) {
        filteredTokenListTokens = filteredTokenListTokens.concat([e]);
      } else {
        filteredNonTokenListTokens = filteredNonTokenListTokens.concat([e]);
      }
    });

    return {
      filteredTokenListTokens,
      filteredNonTokenListTokens,
    };
  }, [filteredTokens, globalTokenList]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(17, 25, 45, 0.6)",
        opacity: open ? 1 : 0,
        display: open ? "block" : "none",
        transition: "height 100ms, opacity 100ms",
        zIndex: 1101,
      }}
      onClick={handleClose}
    >
      <Box
        sx={{
          padding: "24px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background: theme.palette.background.level1,
          minHeight: "230px",
          "@media(max-width: 640px)": {
            padding: "12px",
          },
        }}
        onClick={handleStopPropagation}
      >
        <Box sx={{ width: "100%", maxWidth: "500px" }}>
          <Box sx={{ height: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ width: matchDownSM ? "90%" : "100%", height: "100%" }}>
              <FilledTextField
                ref={inputRef}
                value={search}
                fullHeight
                placeholder="Symbol / Name / Canister ID"
                borderRadius="12px"
                textFieldProps={{
                  slotProps: {
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
                onChange={handleSearchChange}
              />
            </Box>
            {matchDownSM ? (
              <DialogCloseIcon sx={{ color: "#8492C4", cursor: "pointer" }} onClick={handleClose} />
            ) : null}
          </Box>

          {!search || filteredTokens?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                gap: "0 6px",
                margin: "16px 0 0 0",
                alignItems: "center",
                "@media(max-width: 640px)": {
                  flexDirection: "column",
                  gap: "12px 0",
                  alignItems: "flex-start",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "0 6px",
                  alignItems: "center",
                  "@media(max-width: 640px)": {
                    width: "100%",
                    alignItems: "flex-start",
                  },
                }}
              >
                <HotIcon />
                <Typography color="text.primary">{t("swap.hot.tokens.colon")}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "0 16px",
                  alignItems: "center",
                  "@media(max-width: 640px)": {
                    flexDirection: "column",
                    gap: "12px 0",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  },
                }}
              >
                {hotTokens?.map((token) => (
                  <Typography
                    key={token.tokenLedgerId}
                    color="text.primary"
                    fontWeight={600}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleHotTokenClick(token)}
                  >
                    {token.tokenSymbol}
                  </Typography>
                ))}
              </Box>
            </Box>
          ) : null}

          <Box sx={{ margin: "20px 0 0 0" }}>
            {filteredTokens?.length === 0 && search ? (
              <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <NoData tip={t("swap.token.search.empty")} />
              </Box>
            ) : (
              <Box sx={{ maxHeight: "220px", overflow: "hidden auto" }}>
                {filteredTokenListTokens?.length > 0 ? (
                  <Box>
                    <Typography fontSize="12px">Token List</Typography>
                    {filteredTokenListTokens?.map((e) => (
                      <SearchItem
                        key={e.ledgerId}
                        infoAllTokens={infoAllTokens}
                        tokenInfo={e}
                        onTokenClick={handleClose}
                        inTokenList
                      />
                    ))}
                  </Box>
                ) : null}

                {filteredNonTokenListTokens.length > 0 ? (
                  <Box sx={{ margin: "10px 0 0 0" }}>
                    <Typography fontSize="12px">Non-Token List</Typography>
                    {filteredNonTokenListTokens?.map((e) => (
                      <SearchItem
                        key={e.ledgerId}
                        infoAllTokens={infoAllTokens}
                        tokenInfo={e}
                        onTokenClick={handleClose}
                        inTokenList={false}
                      />
                    ))}
                  </Box>
                ) : null}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {!matchDownSM ? (
        <Box sx={{ position: "absolute", top: "24px", right: "24px" }}>
          <DialogCloseIcon sx={{ color: "#8492C4", cursor: "pointer" }} />
        </Box>
      ) : null}
    </Box>
  );
}
