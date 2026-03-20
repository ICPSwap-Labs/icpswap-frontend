import { useAddressBook, useDebouncedChangeHandler } from "@icpswap/hooks";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import Copy, { type CopyRef } from "components/Copy";
import { FilledTextField, Flex, LoadingRow, NoData, TextButton } from "components/index";
import { JdenticonAvatar } from "components/JdenticonAvatar";
import { Box, Button, CircularProgress, InputAdornment, Typography, useTheme } from "components/Mui";
import { AddressBookManager } from "components/Wallet/address-book/AddressBookManager";
import { useWalletAddressBookContext } from "components/Wallet/address-book/context";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { ADDRESS_BOOK_REFRESH } from "constants/index";
import { useRefreshTriggerManager } from "hooks";
import { useContactFilter } from "hooks/wallet/useContactFilter";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { Search as SearchIcon } from "react-feather";
import { Trans, useTranslation } from "react-i18next";

interface AddressBookRowProps {
  addressBook: AddressBookType;
}

function AddressBookRow({ addressBook }: AddressBookRowProps) {
  const copyRef = useRef<CopyRef>(null);
  const { deleteAddressBookLoading, deleteAddressBook } = useWalletAddressBookContext();

  const handleCopy = () => {
    if (copyRef) {
      copyRef?.current?.copy();
    }
  };

  return (
    <>
      <Flex justify="space-between" fullWidth sx={{ padding: "16px 0" }}>
        <Flex gap="0 12px">
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

          {deleteAddressBookLoading && addressBook.id === deleteAddressBook?.id ? (
            <CircularProgress size={18} sx={{ color: "#ffffff" }} />
          ) : (
            <AddressBookManager addressBook={addressBook} />
          )}
        </Flex>
      </Flex>

      <Copy ref={copyRef} content={addressBook.address} hide />
    </>
  );
}

export function AddressBook() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refreshTrigger] = useRefreshTriggerManager(ADDRESS_BOOK_REFRESH);
  const { setPages } = useWalletContext();
  const { setAddAddressBookPrevPage } = useWalletAddressBookContext();
  const [searchValue, debouncedSearch] = useDebouncedChangeHandler(searchKeyword, setSearchKeyword, 300);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  const handleAddAddress = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();

      setPages(WalletManagerPage.AddAddress);
      setAddAddressBookPrevPage(WalletManagerPage.AddressBook);
    },
    [setPages],
  );

  const { data: addresses, isLoading: loading } = useAddressBook(refreshTrigger);

  const filteredAddresses = useContactFilter({ search: searchKeyword, addresses });

  return (
    <DrawerWrapper
      padding="12px"
      title={t("wallet.address.book")}
      onPrev={handlePrev}
      rightIcon={
        isUndefinedOrNull(addresses) ? null : addresses.length === 0 ? (
          <Box sx={{ width: "24px", height: "24px" }} onClick={handleAddAddress}>
            <img width="24px" height="24px" src="/images/wallet/add-address.svg" alt="" />
          </Box>
        ) : null
      }
      showRightIcon={!isUndefinedOrNull(addresses)}
      onRightIconClick={handlePrev}
      footer={
        nonUndefinedOrNull(addresses) && addresses.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            <Button variant="contained" fullWidth size="large" onClick={handleAddAddress}>
              {t("wallet.add.address")}
            </Button>
          </Box>
        ) : null
      }
    >
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <Box sx={{ margin: "24px 0 0 0" }}>
          <FilledTextField
            value={searchValue}
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
          ) : !filteredAddresses || filteredAddresses.length === 0 ? (
            <NoData
              tip={
                <Trans
                  components={{
                    highlight: (
                      <TextButton onClick={() => handleAddAddress()}>
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
