import { Flex } from "@icpswap/ui";
import { shorten } from "@icpswap/utils";
import { ConnectorImage } from "components/Image/index";
import { Box, Button, Typography } from "components/Mui";
import { useWalletStore } from "components/Wallet/store";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal, useShowConnector, useDisconnectManager, useWalletIsConnected } from "store/auth/hooks";

export default function ProfileSection() {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const isConnected = useWalletIsConnected();
  const { openDrawer } = useWalletStore();

  const { showConnector } = useShowConnector();
  const { disconnect } = useDisconnectManager();

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
            className="border border-base-content/10 transition-colors hover:border-primary/40"
            sx={{
              padding: "6px 14px 6px 6px",
              borderRadius: "12px",
              background: "var(--color-base-200)",
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
            className="btn btn-primary"
            variant="contained"
            sx={{
              minWidth: "141px",
              height: "40px",
              borderRadius: "11px",
              fontWeight: 600,
              fontSize: "13px",
              boxShadow: "0 0 24px color-mix(in oklab, var(--color-primary) 18%, transparent)",
              "@media(max-width: 640px)": { minWidth: "126px", padding: "0 12px", fontSize: "12px" },
            }}
            onClick={handleConnectWallet}
          >
            {t("common.connect.wallet")}
          </Button>
        )}
      </Box>
    </Flex>
  );
}
