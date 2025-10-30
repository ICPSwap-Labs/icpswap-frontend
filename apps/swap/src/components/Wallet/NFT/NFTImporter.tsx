import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "components/Mui";
import { FilledTextField } from "components/index";
import { isUndefinedOrNull, isUndefinedOrNullOrEmpty, isValidPrincipal, nonUndefinedOrNull } from "@icpswap/utils";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useTranslation } from "react-i18next";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { useEXTAllCollections } from "@icpswap/hooks";
import { useEXTManager } from "store/nft/hooks";
import { NFT_STANDARDS } from "@icpswap/constants";
import { useTips, TIP_SUCCESS } from "hooks/useTips";

export function NFTImporter() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openTips] = useTips();
  const { setPages } = useWalletContext();
  const { selectedContact, setSelectedContact } = useWalletAddressBookContext();

  const [address, setAddress] = useState<string | undefined>(undefined);

  const { result: extNFTs } = useEXTAllCollections();
  const { nfts: importedNFTs, importNFT } = useEXTManager();

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
    setSelectedContact(undefined);
  }, [setPages, setSelectedContact]);

  useEffect(() => {
    if (selectedContact) {
      setAddress(selectedContact.address);
    }
  }, [selectedContact, setAddress]);

  const handleAddressChange = useCallback(
    (value: string) => {
      setAddress(value);
    },
    [setAddress],
  );

  const handleImport = useCallback(async () => {
    if (isUndefinedOrNull(address)) return;
    importNFT({ canisterId: address, standard: NFT_STANDARDS.EXT });
    openTips("NFTs imported successfully.", TIP_SUCCESS);
    setPages(WalletManagerPage.Index);
  }, [address, setPages, importNFT]);

  const error = useMemo(() => {
    if (isUndefinedOrNull(extNFTs)) return t("common.import");
    if (isUndefinedOrNullOrEmpty(address)) return t("common.enter.canister.id");
    if (!isValidPrincipal(address)) return t("common.invalid.canister.id");

    const metadata = extNFTs.find((element) => element.id === address);
    if (isUndefinedOrNull(metadata)) return "Non-existent canister ID";

    const isImported = nonUndefinedOrNull(importedNFTs.find((element) => element.canisterId === address));
    if (isImported) return t("common.canister.id.exists");

    return undefined;
  }, [address, extNFTs, importedNFTs]);

  return (
    <DrawerWrapper
      padding="12px"
      title={t("wallet.nft.import")}
      onPrev={handlePrev}
      footer={
        <Box sx={{ width: "100%" }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={nonUndefinedOrNull(error)}
            onClick={handleImport}
          >
            {error ?? t("common.import")}
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          margin: "24px 0 0 0",
        }}
      >
        <Box>
          <Typography>{t("common.canister.id")}</Typography>

          <Box sx={{ margin: "8px 0 0 0" }}>
            <Box
              sx={{
                border: theme.palette.border.level4,
                borderRadius: "16px",
                background: theme.palette.background.level3,
                padding: "12px 16px",
              }}
            >
              <FilledTextField
                value={address ?? ""}
                multiline
                rows={3}
                borderRadius="16px"
                background={theme.palette.background.level3}
                placeholderSize="14px"
                fullWidth
                placeholder={t("common.enter.canister.id")}
                inputPadding="0px"
                onChange={handleAddressChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </DrawerWrapper>
  );
}
