import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Button, CircularProgress, Typography, useTheme } from "components/Mui";
import { FilledTextField, Flex } from "components/index";
import {
  isUndefinedOrNull,
  isUndefinedOrNullOrEmpty,
  isValidAccount,
  isValidPrincipal,
  nonUndefinedOrNull,
  principalToAccount,
} from "@icpswap/utils";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTranslation } from "react-i18next";
import NFTAvatar from "components/NFT/NFTAvatar";
import { NFTAvatar as NFTExtAvatar } from "components/NFT/ext/NFTAvatar";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { AddressBookLabel } from "components/Wallet/address-book/AddressBookLabel";
import { useClosePageBackToNFT } from "hooks/wallet/useClosePageBackToNFT";
import { NFTTokenMetadata } from "@icpswap/candid";

export interface NFTSendUIProps {
  isExt?: boolean;
  loading: boolean;
  disabled?: boolean;
  onSend: (address: string, memo?: string | undefined) => Promise<void>;
  name: string | undefined;
  tokenId: number | string | undefined;
  metadata?: NFTTokenMetadata;
  logo?: string;
}

export function NFTSendUI({ isExt, loading, disabled, metadata, name, logo, tokenId, onSend }: NFTSendUIProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const { setPages } = useWalletContext();
  const { selectedContact, setSelectedContact, setSelectContactPrevPage } = useWalletAddressBookContext();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [memo, setMemo] = useState<string | undefined>(undefined);

  const handlePrev = useCallback(() => {
    setPages(isExt ? WalletManagerPage.NFTExtTokenDetails : WalletManagerPage.NFTTokenDetails);
    setSelectedContact(undefined);
  }, [setPages, isExt, setSelectedContact]);

  const handleAddressBook = useCallback(() => {
    setPages(WalletManagerPage.SelectContact, false);
    setSelectContactPrevPage(isExt ? WalletManagerPage.NFTExtSend : WalletManagerPage.NFTSend);
  }, [setPages, setSelectContactPrevPage, isExt]);

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

  const handleMemoChange = useCallback(
    (value: string) => {
      setMemo(value);
    },
    [setMemo],
  );

  const isValidAddress = useMemo(() => {
    if (isUndefinedOrNull(address)) return undefined;
    if (address.includes("-")) return isValidPrincipal(address);
    return isValidAccount(address);
  }, [address]);

  const error = useMemo(() => {
    if (isUndefinedOrNullOrEmpty(address)) return t("common.enter.address");
    if (address.includes("-") && !isValidPrincipal(address)) return t("common.invalid.principal.id");
    if (!address.includes("-") && !isValidAccount(address)) return t("common.invalid.account.id");

    return undefined;
  }, [address]);

  const disableSend = useMemo(() => {
    return isValidAddress === false || loading || nonUndefinedOrNull(error);
  }, [address, error, loading, isValidAddress]);

  const isOwner = useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(address)) return undefined;
    if (address.includes("-")) return principal === address;
    return principalToAccount(principal) === address;
  }, [principal, address]);

  const closePage = useClosePageBackToNFT();

  const handleSend = useCallback(async () => {
    if (isUndefinedOrNull(address) || isUndefinedOrNull(principal)) return;
    await onSend(address, memo);
  }, [onSend, address, memo]);

  return (
    <DrawerWrapper
      padding="12px"
      title={t("common.send")}
      onPrev={handlePrev}
      showRightIcon
      onRightIconClick={closePage}
      footer={
        <Box sx={{ width: "100%" }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={disableSend || disabled || isOwner}
            onClick={handleSend}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {error ?? t("common.send")}
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
          <Typography>{t("common.nft")}</Typography>

          <Box sx={{ margin: "8px 0 0 0" }}>
            <Box
              sx={{
                border: theme.palette.border.level4,
                borderRadius: "16px",
                background: theme.palette.background.level3,
                padding: "16px",
              }}
            >
              <Flex gap="0 8px">
                <Box sx={{ width: "32px", height: "32px" }}>
                  {isExt ? <NFTExtAvatar image={logo} /> : <NFTAvatar metadata={metadata} />}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "text.primary",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: "230px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography fontSize="12px" margin="6px 0 0 0">
                    #{tokenId}
                  </Typography>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>

        <Box sx={{ margin: "16px 0 0 0" }}>
          <Typography>{t("common.to")}</Typography>

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
                placeholder={t("wallet.send.placeholder")}
                inputPadding="0px"
                onChange={handleAddressChange}
              />

              <Flex fullWidth justify={selectedContact ? "space-between" : "flex-end"}>
                {selectedContact ? <AddressBookLabel name={selectedContact.name} /> : null}

                <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handleAddressBook}>
                  <img src="/images/wallet/address-book.svg" alt="" />
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>

        {isValidAddress === false ? (
          <Typography color="text.danger" fontSize={12} sx={{ margin: "8px 0 0 0" }}>
            Invalid address. Please check and try again
          </Typography>
        ) : null}

        {isOwner === true ? (
          <Typography color="text.danger" fontSize={12} sx={{ margin: "8px 0 0 0" }}>
            You can’t send funds to your own wallet
          </Typography>
        ) : null}

        {isUndefinedOrNull(isExt) ? (
          <Box sx={{ margin: "16px 0 0 0" }}>
            <Typography>Memo (optional)</Typography>

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
                  value={memo ?? ""}
                  multiline
                  rows={3}
                  borderRadius="16px"
                  background={theme.palette.background.level3}
                  placeholderSize="14px"
                  fullWidth
                  placeholder={t("wallet.nft.send.placeholder")}
                  inputPadding="0px"
                  onChange={handleMemoChange}
                />
              </Box>
            </Box>
          </Box>
        ) : null}
      </Box>
    </DrawerWrapper>
  );
}
