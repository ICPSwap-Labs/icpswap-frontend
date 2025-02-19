import { Box, Typography, Button } from "components/Mui";
import { MainCard, Wrapper } from "components/index";
import { NoData, Flex } from "@icpswap/ui";
import { useConnectManager } from "store/auth/hooks";
import { useTranslation } from "react-i18next";

export default function ConnectWallet() {
  const { showConnector } = useConnectManager();
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Flex fullWidth align="flex-start" justify="center">
        <Box sx={{ maxWidth: "1400px", width: "100%" }}>
          <MainCard level={3}>
            <Flex fullWidth vertical sx={{ height: "250px" }}>
              <NoData noTips />
              <Typography color="text.primary">{t("common.connect.wallet.view")}</Typography>
              <Button
                variant="contained"
                onClick={() => showConnector(true)}
                sx={{ width: "100%", maxWidth: "522px", marginTop: "23px" }}
                size="large"
              >
                {t(`common.connect.wallet`)}
              </Button>
            </Flex>
          </MainCard>
        </Box>
      </Flex>
    </Wrapper>
  );
}
