import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useCallback, useRef, useMemo } from "react";
import { Box, Typography, InputAdornment, useTheme } from "components/Mui";
import { FilledTextField, Flex, LoadingRow, NoData, TextButton } from "components/index";
import { Search as SearchIcon } from "react-feather";
import { useAddressBook, useDebouncedChangeHandler } from "@icpswap/hooks";
import { Trans, useTranslation } from "react-i18next";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import Copy, { CopyRef } from "components/Copy";
import { useRefreshTriggerManager } from "hooks/index";
import { ADDRESS_BOOK_REFRESH } from "constants/index";
import { JdenticonAvatar } from "components/JdenticonAvatar";
import { isUndefinedOrNull } from "@icpswap/utils";

interface AddressBookRowProps {
  addressBook: AddressBookType;
}

function AddressBookRow({ addressBook }: AddressBookRowProps) {
  const { setPages, setSelectedContact } = useWalletContext();

  const copyRef = useRef<CopyRef>(null);

  const handleCopy = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();

    if (copyRef) {
      copyRef?.current?.copy();
    }
  }, []);

  const handleAddressClick = useCallback(() => {
    setSelectedContact(addressBook);
    setPages(WalletManagerPage.Send);
  }, [addressBook, setPages, setSelectedContact]);

  return (
    <>
      <Flex justify="space-between" fullWidth sx={{ padding: "16px 0" }}>
        <Flex gap="0 12px" sx={{ cursor: "pointer" }} onClick={handleAddressClick}>
          <JdenticonAvatar value={addressBook.address} />

          <Box sx={{ flex: 1 }}>
            <Typography color="text.primary">{addressBook.name}</Typography>
            <Typography sx={{ margin: "6px 0 0 0", fontSize: "12px", wordBreak: "break-all" }}>
              {addressBook.address}
              <Box
                component="span"
                sx={{ cursor: "pointer", margin: "0 0 0 4px", position: "relative", top: "2px", color: "#ffffff" }}
                onClick={handleCopy}
              >
                <CopyIcon />
              </Box>
            </Typography>
          </Box>
        </Flex>
      </Flex>

      <Copy ref={copyRef} content={addressBook.address} hide />
    </>
  );
}

export function SelectContact() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refreshTrigger] = useRefreshTriggerManager(ADDRESS_BOOK_REFRESH);
  const { setPages, setAddAddressBookPrevPage } = useWalletContext();
  const [, debouncedSearch] = useDebouncedChangeHandler(searchKeyword, setSearchKeyword, 300);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  const handleAddAddress = useCallback(() => {
    setPages(WalletManagerPage.AddAddress);
    setAddAddressBookPrevPage(WalletManagerPage.SelectContact);
  }, [setPages]);

  const { result: addresses, loading } = useAddressBook(refreshTrigger);

  const filteredAddresses = useMemo(() => {
    if (isUndefinedOrNull(addresses)) return [];
    if (searchKeyword === "") return addresses;

    return addresses.filter((address) => {
      return (
        address.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        address.address.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    });
  }, [addresses, searchKeyword]);

  return (
    <DrawerWrapper
      padding="12px"
      title={t("wallet.select.contact")}
      onPrev={handlePrev}
      rightIcon={
        <Box sx={{ width: "24px", height: "24px" }} onClick={handleAddAddress}>
          <img width="24px" height="24px" src="/images/wallet/add-address.svg" alt="" />
        </Box>
      }
      showRightIcon
    >
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <Box sx={{ margin: "24px 0 0 0" }}>
          <FilledTextField
            contained
            borderRadius="16px"
            background={theme.palette.background.level1}
            placeholderSize="14px"
            fullWidth
            placeholder={t("common.search")}
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

        <Box sx={{ margin: "12px 0 0 0" }}>
          {loading ? (
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          ) : filteredAddresses.length === 0 ? (
            <NoData
              tip={
                <Trans
                  components={{
                    highlight: (
                      <TextButton onClick={handleAddAddress}>
                        <Trans>Add a new address</Trans>
                      </TextButton>
                    ),
                  }}
                  i18nKey="wallet.address.empty"
                />
              }
            />
          ) : (
            filteredAddresses.map((addressBook) => (
              <AddressBookRow key={addressBook.id.toString()} addressBook={addressBook} />
            ))
          )}
        </Box>
      </Box>
    </DrawerWrapper>
  );
}
