import { useState, useMemo } from "react";
import { Button, Grid, Box, TextField, Typography, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useWalletCatchTokenIds, useSaveCacheTokenCallback, useDeleteCacheTokenCallback } from "store/wallet/hooks";
import { IconSearch } from "@tabler/icons";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { Trans, t } from "@lingui/macro";
import { useImportedTokens } from "store/token/cache/hooks";
import { Theme } from "@mui/material/styles";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import TokenStandardLabel from "components/token/TokenStandardLabel";
import ImportToken from "components/Wallet/ImportToken";
import { NoData, TextButton, Modal } from "components/index";
import { useGlobalTokenList } from "store/global/hooks";
import { DISPLAY_IN_WALLET_FOREVER } from "constants/wallet";
import { TokenImage } from "@icpswap/ui";

export function TokenItem({ canisterId }: { canisterId: string }) {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const walletCatchTokenIds = useWalletCatchTokenIds() ?? [];
  const addToken = useSaveCacheTokenCallback();
  const deleteToken = useDeleteCacheTokenCallback();

  const handleAddToken = (canisterId: string) => {
    addToken([canisterId]);
  };

  const handleDeleteToken = (canisterId: string) => {
    deleteToken([canisterId]);
  };

  const hasBeenAdded = (canisterId: string) => {
    return !!walletCatchTokenIds.find((tokenId) => tokenId === canisterId);
  };

  const { result: tokenInfo } = useTokenInfo(canisterId);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "190px 1fr 80px",
        gap: "0 20px",
        height: "73px",
        alignItems: "center",
        borderTop: "1px solid rgba(189, 200, 240, 0.082)",
      }}
    >
      <Grid container alignItems="center">
        <TokenImage logo={tokenInfo?.logo} size="32px" />

        <Grid ml={1} item xs>
          <Grid container alignItems="center" mr="5px">
            <Grid
              item
              xs
              sx={{
                width: "80px",
                overflow: "hidden",
              }}
            >
              <Typography>{tokenInfo?.symbol}</Typography>
              <Typography
                fontSize={12}
                color="textSecondary"
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {tokenInfo?.name}
              </Typography>
            </Grid>

            <TokenStandardLabel standard={tokenInfo?.standardType} />
          </Grid>
        </Grid>
      </Grid>

      <Typography>{matchDownSM ? "" : tokenInfo?.canisterId}</Typography>

      <>
        {DISPLAY_IN_WALLET_FOREVER.includes(canisterId) ? null : hasBeenAdded(canisterId) ? (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<HorizontalRuleIcon fontSize="small" />}
            onClick={() => handleDeleteToken(canisterId)}
          >
            <Trans>Delete</Trans>
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => handleAddToken(canisterId)}
          >
            <Trans>Add</Trans>
          </Button>
        )}
      </>
    </Box>
  );
}

export default function AddTokenModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [queryValue, setQueryValue] = useState("");
  const [importTokenShow, setImportTokenShow] = useState(false);

  const globalTokenList = useGlobalTokenList();
  const importedTokens = useImportedTokens();

  const handleSearch = async (values: string) => {
    setQueryValue(values);
  };

  const tokens = useMemo(() => {
    const iTokens = Object.keys(importedTokens ?? [])
      .filter((canisterId) => !globalTokenList.find((token) => token.canisterId === canisterId))
      .map((canisterId) => {
        const token = importedTokens[canisterId];

        return {
          canisterId,
          name: token.name,
          symbol: token.symbol,
        };
      });

    const _tokens = globalTokenList
      .filter((token) => !token.configs.find((config) => config.name === "WALLET" && config.value === "true"))
      .map((token) => ({
        canisterId: token.canisterId,
        name: token.name,
        symbol: token.symbol,
      }));

    const tokens = [...iTokens, ..._tokens];

    if (queryValue) {
      return tokens.filter(
        (token) =>
          token.name.toLowerCase().includes(queryValue.toLowerCase()) ||
          token.symbol.toLowerCase().includes(queryValue.toLowerCase()),
      );
    }

    return tokens;
  }, [importedTokens, globalTokenList, queryValue]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={t`Add Tokens`}
        dialogProps={{
          sx: {
            "& .MuiPaper-root": {
              width: "700px",
              maxWith: "700px",
            },
          },
        }}
      >
        <Box>
          <TextField
            id="searchToken"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch stroke={1.5} size="1rem" />
                </InputAdornment>
              ),
            }}
            fullWidth
            size={matchDownSM ? "small" : undefined}
            autoComplete="searchToken"
            placeholder={t`Search token`}
            onChange={(event) => {
              handleSearch(event.target.value);
            }}
          />
        </Box>

        <Box mt="16px">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "190px 1fr 80px",
              gap: "0 20px",
              height: "57px",
              alignItems: "center",
            }}
          >
            <Typography>
              <Trans>Token</Trans>
            </Typography>
            <Typography sx={{ "@media (max-width: 540px)": { display: "none" } }}>
              <Trans>Canister ID</Trans>
            </Typography>
            <Typography>&nbsp;</Typography>
          </Box>

          <Box
            sx={{
              maxHeight: "260px",
              overflow: "auto",
              "@media (max-width: 540px)": { maxHeight: "290px" },
            }}
          >
            {tokens.map((token, index) => (
              <TokenItem key={`${token.canisterId}-${index}}`} canisterId={token.canisterId} />
            ))}
          </Box>

          {tokens.length === 0 ? (
            <Box sx={{ borderTop: "1px solid rgba(189, 200, 240, 0.082)" }}>
              <NoData />
            </Box>
          ) : null}
        </Box>

        <Grid
          container
          justifyContent="center"
          sx={{
            paddingTop: "20px",
            borderTop: "1px solid rgba(81, 81, 81, 1)",
            borderColor: "rgba(189, 200, 240, 0.082)",
          }}
        >
          <TextButton onClick={() => setImportTokenShow(true)}>
            <Trans>Import Token</Trans>
          </TextButton>
        </Grid>
      </Modal>

      {importTokenShow ? (
        <ImportToken
          open={importTokenShow}
          onClose={() => setImportTokenShow(false)}
          onImportSuccessfully={() => onClose()}
        />
      ) : null}
    </>
  );
}
