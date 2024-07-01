import { useState, useMemo, useCallback } from "react";
import { Box, Typography, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { ImportToken } from "components/ImportToken/index";
import { Modal, FilledTextField, NoData } from "components/index";
import { useGlobalTokenList } from "store/global/hooks";
import { DISPLAY_IN_WALLET_FOREVER } from "constants/wallet";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { isValidPrincipal, classNames } from "@icpswap/utils";
import { Search as SearchIcon } from "react-feather";
import { TokenListMetadata } from "types/token-list";
import { TokenItem } from "components/CurrencySelector/TokenItem";
import { useDebouncedChangeHandler } from "@icpswap/hooks";

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
  const [hiddenCanisterIds, setHiddenCanisterIds] = useState<string[]>([]);

  const globalTokenList = useGlobalTokenList();

  const { result: snsAllTokensInfo } = useFetchSnsAllTokensInfo();

  const { taggedTokens } = useTaggedTokenManager();

  const yourTokens: string[] = useMemo(() => {
    return [...new Set(DISPLAY_IN_WALLET_FOREVER.map((e) => e).concat(taggedTokens))];
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
        return !DISPLAY_IN_WALLET_FOREVER.includes(token.canisterId);
      })
      .forEach((token) => {
        const snsTokenInfo = snsAllTokensInfo.find((e) => e.canister_ids.ledger_canister_id === token.canisterId);

        if (snsTokenInfo?.canister_ids.root_canister_id) {
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
    return [...new Set([...(snsTokens ?? []), ...(noneSnsTokens ?? [])])];
  }, [snsTokens, noneSnsTokens]);

  const noData = useMemo(() => {
    return hiddenCanisterIds.length === allTokenCanisterIds.length && showImportToken === false;
  }, [hiddenCanisterIds, allTokenCanisterIds, showImportToken]);

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
          <Box sx={{ padding: matchDownSM ? "0 16px" : "0 24px", margin: "8px 0 0 0" }}>
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
              onChange={debouncedSearch}
            />
          </Box>

          <Box sx={{ margin: "24px 0", width: "100%", height: "1px", background: theme.palette.background.level4 }} />

          <Box sx={{ height: "370px", overflow: "hidden auto" }}>
            {noData ? <NoData /> : null}

            {showImportToken && !importTokenCanceled ? (
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
              {snsTokens?.map((tokenId) => (
                <TokenItem
                  key={tokenId}
                  canisterId={tokenId}
                  searchWord={searchKeyword}
                  hidden={panel === "Others" && !searchKeyword}
                  onTokenHide={handleTokenHidden}
                />
              ))}

              {noneSnsTokens?.map((tokenId) => (
                <TokenItem
                  key={tokenId}
                  canisterId={tokenId}
                  searchWord={searchKeyword}
                  hidden={panel === "SNS" && !searchKeyword}
                  onTokenHide={handleTokenHidden}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
