import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useMemo, useCallback } from "react";
import { Box, Typography, useTheme, Button, CircularProgress } from "components/Mui";
import { FilledTextField, Flex } from "components/index";
import { isUndefinedOrNull, isValidAccount, isValidPrincipal } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { useWalletContext } from "components/Wallet/context";
import { addAddressBook } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";

export function AddAddress() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setPages, addAddressBookPrevPage } = useWalletContext();

  const [name, setName] = useState<undefined | string>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrev = useCallback(() => {
    setPages(addAddressBookPrevPage);
  }, [setPages, addAddressBookPrevPage]);

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
    if (isUndefinedOrNull(name) || isUndefinedOrNull(address)) return;

    setLoading(true);

    const { status } = await addAddressBook(name, address);

    if (status === ResultStatus.OK) {
      handlePrev();
    }

    setLoading(false);
  }, [name, address, handlePrev]);

  return (
    <DrawerWrapper
      padding="12px"
      title={t("wallet.address.book")}
      onPrev={handlePrev}
      showRightIcon
      footer={
        <Box sx={{ width: "100%", padding: "0 12px" }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={!name || !address || isValidAddress === false || loading}
            onClick={handleSave}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {t("common.save")}
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
              contained
              borderRadius="16px"
              background={theme.palette.background.level3}
              placeholderSize="14px"
              fullWidth
              placeholder="Enter a name under 20 characters"
              onChange={(value: string) => handleValueChange("name", value)}
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
            />
          </Box>
        </Flex>
      </Box>
    </DrawerWrapper>
  );
}
