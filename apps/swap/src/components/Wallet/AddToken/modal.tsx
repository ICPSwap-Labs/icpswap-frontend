import { useState, useMemo, useCallback } from "react";
import { Box, Typography, InputAdornment, useTheme, useMediaQuery, makeStyles, Theme } from "components/Mui";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { t, Trans } from "@lingui/macro";
import { ImportToken } from "components/ImportToken/index";
import { Modal, FilledTextField, NoData, Flex } from "components/index";
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

function Icon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="32" transform="matrix(-1 0 0 1 64 0)" fill="#29314F" />
      <path
        d="M16.5352 41.6573C15.4861 39.8464 15.4794 37.6881 16.5218 35.884L26.9859 17.7622C28.0217 15.938 29.8926 14.8555 31.9908 14.8555C34.089 14.8555 35.96 15.9446 36.9957 17.7555L47.4732 35.8973C48.5156 37.7215 48.5089 39.8932 47.4531 41.7041C46.4107 43.4949 44.5464 44.5707 42.4616 44.5707H21.5601C19.4686 44.5707 17.5909 43.4815 16.5352 41.6573Z"
        fill="#F7B231"
      />
      <path
        d="M32.0092 35.7422C32.9179 35.7422 33.6797 36.5039 33.6797 37.4127C33.6797 38.3215 32.9179 39.0832 32.0092 39.0832C31.1338 39.0832 30.3387 38.3215 30.3787 37.4528C30.3387 36.4973 31.0937 35.7422 32.0092 35.7422Z"
        fill="#29314F"
      />
      <path
        d="M32.4213 24.012C33.2165 24.2392 33.7109 24.9609 33.7109 25.8362C33.6708 26.3641 33.6374 26.8987 33.5973 27.4265C33.4837 29.4378 33.3702 31.4091 33.2566 33.4204C33.2165 34.1019 32.6886 34.5964 32.007 34.5964C31.3254 34.5964 30.7909 34.0685 30.7575 33.3803C30.7575 32.966 30.7575 32.5851 30.7174 32.1641C30.6439 30.8745 30.5637 29.5849 30.4902 28.2952C30.4501 27.46 30.3766 26.6247 30.3365 25.7894C30.3365 25.4887 30.3766 25.2215 30.4902 24.9542C30.831 24.2058 31.6261 23.8249 32.4213 24.012Z"
        fill="#29314F"
      />
    </svg>
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
  const [canisterStates, setCanisterStates] = useState<{ [tokenId: string]: boolean }>({});

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

  const isTokenImported = useMemo(() => {
    if (!searchKeyword || !yourTokens || !noneSnsTokens || !snsTokens) return false;

    if (isValidPrincipal(searchKeyword)) {
      return yourTokens.concat(noneSnsTokens).concat(snsTokens).includes(searchKeyword);
    }

    return false;
  }, [searchKeyword, yourTokens, noneSnsTokens, snsTokens]);

  const handleTokenHidden = useCallback(
    (canisterId: string, hidden: boolean) => {
      setCanisterStates((prevState) => ({ ...prevState, [canisterId]: hidden }));
    },
    [setCanisterStates],
  );

  const allTokenCanisterIds = useMemo(() => {
    return [...new Set([...(snsTokens ?? []), ...(noneSnsTokens ?? [])])];
  }, [snsTokens, noneSnsTokens]);

  const noData = useMemo(() => {
    const allHiddenCanisterNum = Object.values(canisterStates).filter((hidden) => hidden === true);
    return allHiddenCanisterNum.length === allTokenCanisterIds.length && showImportToken === false;
  }, [canisterStates, allTokenCanisterIds, showImportToken]);

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
            <Typography sx={{ fontSize: "12px", lineHeight: "1.15rem" }}>
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
            {noData && !isTokenImported ? <NoData /> : null}

            {isTokenImported ? (
              <Box sx={{ margin: "24px 0 0 0" }}>
                <Flex justify="center" fullWidth>
                  <Icon />
                </Flex>
                <Typography
                  fontSize="16px"
                  fontWeight={500}
                  align="center"
                  sx={{ margin: "16px 0 0 0" }}
                  color="text.primary"
                >
                  <Trans>This token has been added</Trans>
                </Typography>
              </Box>
            ) : null}

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
