import { useState, useMemo, useCallback } from "react";
import { Grid, Box, Typography, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import TokenStandardLabel from "components/token/TokenStandardLabel";
import { ImportToken } from "components/ImportToken/index";
import { Modal, FilledTextField, TokenImage } from "components/index";
import { useGlobalTokenList, useFetchAllSwapTokens } from "store/global/hooks";
import { DISPLAY_IN_WALLET_FOREVER } from "constants/wallet";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { type AllTokenOfSwapTokenInfo } from "@icpswap/types";
import { isValidPrincipal, classNames } from "@icpswap/utils";
import { PlusCircle, Search as SearchIcon } from "react-feather";
import { TokenListMetadata } from "types/token-list";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      padding: "0 24px",
      "@media(max-width: 640px)": {
        padding: "0 16px",
      },
    },
    panel: {
      position: "relative",
      fontSize: "16px",
      fontWeight: 500,
      color: theme.palette.text.secondary,
      cursor: "pointer",
      "&.active": {
        color: theme.palette.text.primary,
        "&:after": {
          content: '""',
          position: "absolute",
          bottom: "-3px",
          left: 0,
          width: "100%",
          height: "3px",
          background: theme.colors.secondaryMain,
        },
      },
    },
  };
});

export interface TokenItemInfoProps {
  tokenInfo: AllTokenOfSwapTokenInfo;
  canisterId: string;
  onUpdateTokenAdditional?: (tokenId: string, balance: string) => void;
  search?: string;
  showBalance?: boolean;
  isHidden?: boolean;
}

export function TokenItemInfo({ tokenInfo: _tokenInfo, canisterId, search, isHidden }: TokenItemInfoProps) {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { result: tokenInfo } = useTokenInfo(canisterId);

  const { taggedTokens, updateTaggedTokens, deleteTaggedTokens } = useTaggedTokenManager();

  const isTagged = useMemo(() => {
    return DISPLAY_IN_WALLET_FOREVER.concat(taggedTokens).includes(canisterId);
  }, [taggedTokens]);

  const handleAddToCache = (event: React.MouseEvent<SVGAElement>) => {
    event.stopPropagation();

    if (isTagged) {
      deleteTaggedTokens([canisterId]);
    } else {
      updateTaggedTokens([canisterId]);
    }
  };

  const hidden = useMemo(() => {
    if (isHidden) return true;

    if (DISPLAY_IN_WALLET_FOREVER.includes(_tokenInfo.ledger_id.toString())) return true;

    if (!search) return false;

    if (isValidPrincipal(search)) {
      return _tokenInfo.ledger_id.toString() !== search;
    }

    return (
      !_tokenInfo.symbol.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
      !_tokenInfo.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  }, [search, _tokenInfo, isHidden]);

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
          gridTemplateColumns: "115px 50px 1fr",
        },
      }}
    >
      <Box>
        <Grid container alignItems="center" gap="0 12px">
          <TokenImage logo={tokenInfo?.logo} size={matchDownSM ? "18px" : "40px"} tokenId={tokenInfo?.canisterId} />

          <Grid item xs sx={{ overflow: "hidden" }}>
            <Grid container alignItems="center">
              <Box sx={{ width: "100%" }}>
                <Typography
                  color="text.primary"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontWeight: 500,
                    "@media (max-width: 580px)": {
                      fontSize: "14px",
                    },
                  }}
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

      {isTagged ? null : (
        <Box>
          <Grid container justifyContent="flex-end" alignItems="center">
            <PlusCircle color={theme.themeOption.textSecondary} size="16px" onClick={handleAddToCache} />
          </Grid>
        </Box>
      )}
    </Box>
  );
}

type Panel = "SNS" | "Others";

const Panels: { value: Panel; label: string }[] = [
  { value: "SNS", label: t`SNS Tokens` },
  { value: "Others", label: t`Other Tokens` },
];

export default function AddTokenModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme() as Theme;
  const classes = useStyles();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [importTokenCanceled, setImportTokenCanceled] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [panel, setPanel] = useState<Panel>("SNS");

  const globalTokenList = useGlobalTokenList();

  const { result: allTokensOfSwap } = useFetchAllSwapTokens();
  const { result: snsAllTokensInfo } = useFetchSnsAllTokensInfo();

  const { taggedTokens } = useTaggedTokenManager();

  const yourTokens: string[] = useMemo(() => {
    return DISPLAY_IN_WALLET_FOREVER.map((e) => e).concat(taggedTokens);
  }, [DISPLAY_IN_WALLET_FOREVER, taggedTokens]);

  const { snsTokens, noneSnsTokens } = useMemo(() => {
    if (!snsAllTokensInfo) return {};

    const snsTokens: TokenListMetadata[] = [];
    const noneSnsTokens: TokenListMetadata[] = [];

    const sortedGlobalTokenList = [...globalTokenList].sort((a, b) => {
      if (a.rank < b.rank) return -1;
      if (a.rank > b.rank) return 1;
      return 0;
    });

    sortedGlobalTokenList
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

    const { snsYourTokens, nonSnsYourTokens } = yourTokens.reduce(
      (prev, curr) => {
        const snsTokenInfo = snsAllTokensInfo.find((e) => e.canister_ids.ledger_canister_id === curr);

        if (snsTokenInfo?.canister_ids.root_canister_id) {
          return {
            snsYourTokens: [curr, ...prev.snsYourTokens],
            nonSnsYourTokens: prev.nonSnsYourTokens,
          };
        }

        return {
          snsYourTokens: prev.snsYourTokens,
          nonSnsYourTokens: [curr, ...prev.nonSnsYourTokens],
        };
      },
      { snsYourTokens: [] as string[], nonSnsYourTokens: [] as string[] },
    );

    return {
      snsTokens: snsYourTokens.concat(snsTokens.map((e) => e.canisterId)),
      noneSnsTokens: nonSnsYourTokens.concat(noneSnsTokens.map((e) => e.canisterId)),
    };
  }, [globalTokenList, yourTokens, snsAllTokensInfo]);

  const yourTokenList = useMemo(() => {
    if (!allTokensOfSwap) return undefined;
    const tokens = allTokensOfSwap.filter((token) => yourTokens.includes(token.ledger_id.toString()));
    return tokens;
  }, [allTokensOfSwap, yourTokens]);

  const snsTokenList = useMemo(() => {
    if (!allTokensOfSwap || !snsTokens) return [];
    const tokens = allTokensOfSwap.filter((token) => snsTokens.includes(token.ledger_id.toString()));
    return tokens;
  }, [allTokensOfSwap, snsTokens]);

  const noneTokenList = useMemo(() => {
    if (!allTokensOfSwap || !noneSnsTokens) return [];
    const tokens = allTokensOfSwap.filter((token) => noneSnsTokens.includes(token.ledger_id.toString()));
    return tokens;
  }, [allTokensOfSwap, noneSnsTokens]);

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
      <Modal
        open={open}
        onClose={onClose}
        title={t`Add Tokens`}
        dialogProps={{
          sx: {
            "& .MuiPaper-root": {
              width: "570px",
              maxWidth: "570px",
            },
            "& .MuiDialog-paper": {
              padding: "0",
            },
            "& .MuiDialogContent-root": {
              padding: "0",
            },
          },
        }}
        background={theme.palette.background.level2}
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
                    <SearchIcon color={theme.palette.text.secondary} size="14px" />
                  </InputAdornment>
                ),
                maxLength: 50,
              }}
              onChange={handleSearchToken}
            />
          </Box>

          <Box sx={{ margin: "24px 0", width: "100%", height: "1px", background: theme.palette.background.level4 }} />

          <Box sx={{ height: "370px", overflow: "hidden auto" }}>
            {noToken && searchKeyword && isValidPrincipal(searchKeyword) && !importTokenCanceled ? (
              <Box className={classes.wrapper}>
                <ImportToken canisterId={searchKeyword} onCancel={() => setImportTokenCanceled(true)} />
              </Box>
            ) : null}

            <Box>
              {searchKeyword !== "" ? null : (
                <Box sx={{ display: "flex", gap: "0 32px" }} className={classes.wrapper}>
                  {Panels.map((__panel) => (
                    <Typography
                      key={__panel.value}
                      className={classNames([classes.panel, panel === __panel.value ? "active" : ""])}
                      onClick={() => setPanel(__panel.value)}
                    >
                      {__panel.label}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            <Box mt={searchKeyword ? "0px" : "16px"}>
              {snsTokenList.map((token) => (
                <TokenItemInfo
                  key={token.ledger_id.toString()}
                  tokenInfo={token}
                  canisterId={token.ledger_id.toString()}
                  search={searchKeyword}
                  isHidden={panel === "Others" && !searchKeyword}
                />
              ))}

              {noneTokenList.map((token) => (
                <TokenItemInfo
                  key={token.ledger_id.toString()}
                  tokenInfo={token}
                  canisterId={token.ledger_id.toString()}
                  search={searchKeyword}
                  isHidden={panel === "SNS" && !searchKeyword}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
