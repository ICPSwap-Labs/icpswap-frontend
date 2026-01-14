import { useTheme, Box, Typography, Button } from "components/Mui";
import { shorten } from "@icpswap/utils";
import { useAccountPrincipal, useWalletIsConnected, useConnectManager } from "store/auth/hooks";
import { Flex } from "@icpswap/ui";
import { ConnectorImage } from "components/Image/index";
import { useWalletContext } from "components/Wallet/context";
import { useTranslation } from "react-i18next";

export default function ProfileSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const isConnected = useWalletIsConnected();
  const { openDrawer } = useWalletContext();

  const { showConnector, disconnect } = useConnectManager();

  const handleConnectWallet = async () => {
    await disconnect();
    showConnector(true);
  };

  return (
    <Flex gap="0 4px">
      <Box sx={{ zIndex: 10 }}>
        {isConnected ? (
          <Flex
            gap="0 10px"
            sx={{
              padding: "4px 12px 4px 4px",
              borderRadius: "48px",
              background: theme.palette.background.level3,
              cursor: "pointer",
            }}
            onClick={openDrawer}
          >
            <ConnectorImage size="26px" />
            <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
              {principal ? shorten(principal.toString()) : ""}
            </Typography>
          </Flex>
        ) : (
          <Button
            variant="contained"
            sx={{ width: "141px", height: "40px", borderRadius: "48px" }}
            onClick={handleConnectWallet}
          >
            {t("common.connect.wallet")}
          </Button>
        )}
      </Box>
    </Flex>
  );
}
