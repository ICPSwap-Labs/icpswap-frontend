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
import { MessageTypes, useTips } from "hooks/index";
import NFTAvatar from "components/NFT/NFTAvatar";
import { useWalletNFTContext } from "components/Wallet/NFT/NFTContext";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { AddressBookLabel } from "components/Wallet/address-book/AddressBookLabel";
import { nftTransfer } from "hooks/nft/useNFTCalls";
import { encodeTokenIdentifier, stringToArrayBuffer } from "utils";
import { ResultStatus } from "@icpswap/types";
import { getLocaleMessage } from "i18n/service";

export function NFTSend() {
  const theme = useTheme();
  const { setPages } = useWalletContext();
  const { selectedContact, setSelectedContact, setSelectContactPrevPage } = useWalletAddressBookContext();
  const { sendingNFTMetadata } = useWalletNFTContext();
  const principal = useAccountPrincipalString();
  const { t } = useTranslation();
  const [openTip] = useTips();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [memo, setMemo] = useState<string | undefined>(undefined);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.NFTTokenDetails);
    setSelectedContact(undefined);
  }, [setPages, setSelectedContact]);

  const handleAddressBook = useCallback(() => {
    setPages(WalletManagerPage.SelectContact, false);
    setSelectContactPrevPage(WalletManagerPage.NFTSend);
  }, [setPages, setSelectContactPrevPage]);

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

  const handleSend = useCallback(async () => {
    if (isUndefinedOrNull(address) || isUndefinedOrNull(sendingNFTMetadata) || isUndefinedOrNull(principal)) return;

    try {
      setLoading(true);

      const to_address = address.includes("-") ? principalToAccount(address) : address;

      const { status, message } = await nftTransfer(sendingNFTMetadata.cId, {
        from: { address: principalToAccount(principal) },
        to: { address: to_address },
        memo: [...(memo ? stringToArrayBuffer(memo) : stringToArrayBuffer("TRANSFER"))],
        token: encodeTokenIdentifier(sendingNFTMetadata.cId, sendingNFTMetadata.tokenId),
        amount: BigInt(1),
        subaccount: [],
        nonce: [],
        notify: false,
      });

      if (status === ResultStatus.OK) {
        openTip("NFT sent successfully", MessageTypes.success);
        setAddress(undefined);
        setSelectedContact(undefined);
        setPages(WalletManagerPage.NFTCanister);
      } else {
        openTip(getLocaleMessage(message) ?? t("common.transfer.failed"), MessageTypes.error);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }, [setSelectedContact, setLoading, address, principal, setPages]);

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

  return sendingNFTMetadata ? (
    <DrawerWrapper
      padding="12px"
      title={t("common.send")}
      onPrev={handlePrev}
      showRightIcon
      onRightIconClick={handlePrev}
      footer={
        <Box sx={{ width: "100%" }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={disableSend || isOwner}
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
                  <NFTAvatar metadata={sendingNFTMetadata} />
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
                    {sendingNFTMetadata.name}
                  </Typography>
                  <Typography fontSize="12px" margin="6px 0 0 0">
                    #{sendingNFTMetadata.tokenId}
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
      </Box>
    </DrawerWrapper>
  ) : null;
}
