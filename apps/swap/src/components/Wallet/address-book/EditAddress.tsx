import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Typography, useTheme, Button, CircularProgress } from "components/Mui";
import { FilledTextField, Flex } from "components/index";
import { isUndefinedOrNull, isValidAccount, isValidPrincipal, nonUndefinedOrNull } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { editAddressBook, useAddressBook } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";
import { useRemoveAddressHandler } from "hooks/wallet/useRemoveAddressHandler";

export function EditAddress() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState<undefined | string>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { setPages, editAddressBook: addressBook, deleteAddressBookLoading } = useWalletContext();

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.AddressBook);
  }, [setPages]);

  const handleValueChange = useCallback(
    (filed: "name" | "address", value: string) => {
      if (filed === "name") {
        setName(value);
      } else {
        setAddress(value);
      }
    },
    [setAddress, setName],
  );

  const isValidAddress = useMemo(() => {
    if (isUndefinedOrNull(address)) return undefined;
    if (address.includes("-")) return isValidPrincipal(address);
    return isValidAccount(address);
  }, [address]);

  const handleSave = useCallback(async () => {
    if (isUndefinedOrNull(name) || isUndefinedOrNull(address) || isUndefinedOrNull(addressBook)) return;

    setLoading(true);

    const { status } = await editAddressBook(addressBook.id, name, address);

    if (status === ResultStatus.OK) {
      handlePrev();
    }

    setLoading(false);
  }, [name, address, addressBook, handlePrev]);

  useEffect(() => {
    if (nonUndefinedOrNull(addressBook)) {
      setName(addressBook.name);
      setAddress(addressBook.address);
    }
  }, [addressBook, setName, setAddress]);

  const isEdited = useMemo(() => {
    if (isUndefinedOrNull(name) || isUndefinedOrNull(address) || isUndefinedOrNull(addressBook)) return false;
    return !(addressBook.name === name && addressBook.address === address);
  }, [addressBook, name, address]);

  const removeAddressHandler = useRemoveAddressHandler();

  const handleRemoveAddress = useCallback(() => {
    if (nonUndefinedOrNull(addressBook)) {
      removeAddressHandler(addressBook);
    }
  }, [addressBook, removeAddressHandler]);

  const { result: addresses } = useAddressBook();

  const error = useMemo(() => {
    if (isUndefinedOrNull(addresses) || isUndefinedOrNull(addressBook)) return t("common.save");
    if (isUndefinedOrNull(name) || isUndefinedOrNull(address)) return t("Enter name & address");
    if (isValidAddress === false) return t("invalid.address");

    const isExist = !!addresses
      .filter((__addressBook) => __addressBook.id !== addressBook.id)
      .find((addressBook) => addressBook.name === name || addressBook.address === address);

    if (isExist) return t("wallet.address.name.exist");

    return undefined;
  }, [addresses, name, address, loading, isValidAddress, addressBook]);

  return (
    <DrawerWrapper
      padding="12px"
      title={t("wallet.edit.address")}
      onPrev={handlePrev}
      showRightIcon
      rightIcon={
        deleteAddressBookLoading ? (
          <Box sx={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress sx={{ color: "#ffffff" }} size={18} />
          </Box>
        ) : (
          <Box sx={{ width: "24px", height: "24px" }} onClick={handleRemoveAddress}>
            <img width="100%" height="100%" src="/images/wallet/remove0.svg" alt="" />
          </Box>
        )
      }
      footer={
        <Box sx={{ width: "100%" }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={nonUndefinedOrNull(error) || loading || isEdited === false}
            onClick={handleSave}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {error ?? t("common.save")}
          </Button>
        </Box>
      }
    >
      <Box sx={{ width: "100%" }}>
        <Flex vertical align="flex-start" fullWidth sx={{ margin: "24px 0 0 0" }} gap="8px 0">
          <Typography>{t("common.name")}</Typography>

          <Box sx={{ width: "100%" }}>
            <FilledTextField
              value={name}
              contained
              borderRadius="16px"
              background={theme.palette.background.level3}
              placeholderSize="14px"
              fullWidth
              placeholder="Enter a name under 20 characters"
              onChange={(value: string) => handleValueChange("name", value)}
              textFieldProps={{
                slotProps: {
                  htmlInput: {
                    maxLength: 20,
                  },
                },
              }}
            />
          </Box>
        </Flex>

        <Flex vertical align="flex-start" fullWidth sx={{ margin: "24px 0 0 0" }} gap="8px 0">
          <Typography>{t("common.address")}</Typography>

          <Box sx={{ width: "100%" }}>
            <FilledTextField
              value={address}
              multiline
              contained
              borderRadius="16px"
              background={theme.palette.background.level3}
              placeholderSize="14px"
              fullWidth
              placeholder="Enter the Account ID/Principal ID "
              onChange={(value: string) => handleValueChange("address", value)}
            />
          </Box>
        </Flex>
      </Box>
    </DrawerWrapper>
  );
}
