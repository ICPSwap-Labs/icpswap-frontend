import { Box, Typography, useTheme } from "components/Mui";
import { AvatarImage, Flex } from "components/index";
import { useTranslation } from "react-i18next";
import { ICP } from "@icpswap/tokens";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useCallback } from "react";

export function BalanceConvertEntry() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setPages } = useWalletContext();

  const handleConvert = useCallback(() => {
    setPages(WalletManagerPage.Convert, false);
  }, [setPages]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "44px",
        alignItems: "center",
        borderRadius: "12px",
        border: `1px solid ${theme.palette.background.level4}`,
        padding: "0 12px",
        cursor: "pointer",
      }}
      onClick={handleConvert}
    >
      <Flex gap="0 8px">
        <AvatarImage sx={{ width: "16px", height: "16px", borderRadius: "50%" }} src={ICP.logo} />

        <Typography sx={{ fontSize: "12px" }} color="text.primary">
          {t("wallet.convert.icp")}
        </Typography>
      </Flex>
    </Box>
  );
}
