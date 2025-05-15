import { useState, useCallback, useMemo } from "react";
import { InputAdornment, useTheme, Typography, Box, useMediaQuery } from "components/Mui";
import { isDarkTheme } from "utils/index";
import { FilledTextField, NoData } from "components/index";
import { Search as SearchIcon } from "react-feather";
import { useDebouncedChangeHandler, useChainKeyMinterInfo } from "@icpswap/hooks";
import { MINTER_CANISTER_ID } from "constants/index";
import { useAllBridgeTokens } from "hooks/ck-bridge";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { ckBTC } from "@icpswap/tokens";
import { useTranslation } from "react-i18next";
import { Modal } from "@icpswap/ui";

import { SelectorToken } from "./SelectorToken";

export interface SelectorProps {
  open: boolean;
  onChange: (token: Token, chain: ckBridgeChain) => void;
  onClose: () => void;
}

export function TokensModal({ open, onChange, onClose }: SelectorProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = isDarkTheme(theme);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hiddenCanisterIds, setHiddenCanisterIds] = useState<{ [canisterId: string]: boolean }>({});

  const { result: minterInfo } = useChainKeyMinterInfo(MINTER_CANISTER_ID);

  const allBridgeTokens = useAllBridgeTokens(minterInfo);

  const handleTokenClick = useCallback((token: Token, chain: ckBridgeChain) => {
    if (onChange) onChange(token, chain);
  }, []);

  const handleSearchToken = useCallback((value: string) => {
    setSearchKeyword(value);
  }, []);

  const [, debouncedSearch] = useDebouncedChangeHandler(searchKeyword, handleSearchToken, 300);

  const noData = useMemo(() => {
    return Object.values(hiddenCanisterIds).filter((e) => e === true).length === allBridgeTokens.length;
  }, [hiddenCanisterIds, allBridgeTokens]);

  const handleUpdateTokenIsHidden = useCallback(
    (tokenId: string, hidden: boolean) => {
      setHiddenCanisterIds((prevState) => ({
        ...prevState,
        [tokenId]: hidden,
      }));
    },
    [setHiddenCanisterIds],
  );

  return (
    <>
      <Modal
        open={open}
        title={t("common.select.a.token")}
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
              margin: "12px 0 0 0",
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

          <Box sx={{ margin: "24px 0", width: "100%", height: "1px", background: theme.palette.background.level4 }} />

          <Box>
            <Typography sx={{ fontSize: "16px", padding: "0 24px", margin: "0 0 16px 0" }}>
              {t("common.networks.all")}
            </Typography>
          </Box>

          <Box sx={{ height: "315px", overflow: "hidden auto" }}>
            {noData ? <NoData /> : null}

            <Box>
              {(allBridgeTokens ?? []).map((tokenId) => (
                <Box key={tokenId}>
                  <SelectorToken
                    tokenId={tokenId}
                    onClick={handleTokenClick}
                    searchWord={searchKeyword}
                    chain={tokenId === ckBTC.address ? ckBridgeChain.btc : ckBridgeChain.eth}
                    minterInfo={minterInfo}
                    updateTokenHide={handleUpdateTokenIsHidden}
                  />

                  <SelectorToken
                    tokenId={tokenId}
                    onClick={handleTokenClick}
                    searchWord={searchKeyword}
                    chain={ckBridgeChain.icp}
                    minterInfo={minterInfo}
                    updateTokenHide={handleUpdateTokenIsHidden}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
