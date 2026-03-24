import { addAddressBook, useAddressBook } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";
import { isUndefinedOrNull, isValidAccount, isValidPrincipal, nonUndefinedOrNull } from "@icpswap/utils";
import { FilledTextField, Flex } from "components/index";
import { Box, Button, CircularProgress, Typography, useTheme } from "components/Mui";
import { useWalletAddressBookStore } from "components/Wallet/address-book/store";
import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useWalletStore } from "components/Wallet/store";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function AddAddress() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setPages } = useWalletStore();
  const { addAddressBookPrevPage } = useWalletAddressBookStore();

  const [name, setName] = useState<undefined | string>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrev = useCallback(() => {
    setPages(addAddressBookPrevPage);
  }, [setPages, addAddressBookPrevPage]);

  const handleValueChange = useCallback((filed: "name" | "address", value: string) => {
    if (filed === "name") {
      setName(value);
    } else {
      setAddress(value);
    }
  }, []);

  const isValidAddress = useMemo(() => {
    if (isUndefinedOrNull(address)) return undefined;
    if (address.includes("-")) return isValidPrincipal(address);
    return isValidAccount(address);
  }, [address]);

  const handleSave = useCallback(async () => {
    if (isUndefinedOrNull(name) || isUndefinedOrNull(address)) return;

    setLoading(true);

    const { status } = await addAddressBook(name, address);

    if (status === ResultStatus.OK) {
      handlePrev();
    }

    setLoading(false);
  }, [name, address, handlePrev]);

  const { data: addresses } = useAddressBook();

  const error = useMemo(() => {
    if (isUndefinedOrNull(addresses)) return t("common.save");
    if (isUndefinedOrNull(name) || isUndefinedOrNull(address)) return t("Enter name & address");
    if (isValidAddress === false) return t("invalid.address");

    const isExist = !!addresses.find((addressBook) => addressBook.name === name || addressBook.address === address);

    if (isExist) return t("wallet.address.name.exist");

    return undefined;
  }, [addresses, name, address, isValidAddress, t]);

  return (
    <DrawerWrapper
      padding="12px"
      title={t("wallet.address.book")}
      onPrev={handlePrev}
      showRightIcon
      footer={
        <Box sx={{ width: "100%" }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={nonUndefinedOrNull(error) || loading}
            onClick={handleSave}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {error ?? t("common.save")}
          </Button>
        </Box>
      }
      onRightIconClick={handlePrev}
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
              multiline
              rows={4}
              contained
              borderRadius="16px"
              background={theme.palette.background.level3}
              placeholderSize="14px"
              fullWidth
              placeholder="Enter the Account ID/Principal ID "
              onChange={(value: string) => handleValueChange("address", value)}
              value={address}
            />
          </Box>
        </Flex>
      </Box>
    </DrawerWrapper>
  );
}
