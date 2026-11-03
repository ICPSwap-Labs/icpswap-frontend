import { Flex } from "@icpswap/ui";
import { shorten } from "@icpswap/utils";
import { ConnectorImage } from "components/Image/index";
import { Box, Button, Typography, useTheme } from "components/Mui";
import { useDesignVersion } from "hooks/useDesignVersion";
import { useWalletStore } from "components/Wallet/store";
import { useTranslation } from "react-i18next";
import { useAccountPrincipal, useShowConnector, useDisconnectManager, useWalletIsConnected } from "store/auth/hooks";

export default function ProfileSection() {
  const { isClassicDesign } = useDesignVersion();
  const theme = useTheme();
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
            className={
              isClassicDesign ? undefined : "border border-base-content/10 transition-colors hover:border-primary/40"
            }
            sx={{
              padding: isClassicDesign ? "4px 12px 4px 4px" : "6px 14px 6px 6px",
              borderRadius: isClassicDesign ? "48px" : "6px",
              background: isClassicDesign ? theme.palette.background.level3 : "var(--color-base-200)",
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
              height: isClassicDesign ? "40px" : "36px",
              borderRadius: isClassicDesign ? "48px" : "5px",
              fontWeight: isClassicDesign ? 500 : 600,
              fontSize: isClassicDesign ? "14px" : "12px",
              background:
                isClassicDesign && theme.palette.mode === "dark"
                  ? "linear-gradient(89.44deg, var(--color-secondary) -0.31%, var(--color-primary) 91.14%)"
                  : "var(--color-primary)",
              color: "var(--color-primary-content)",
              boxShadow: isClassicDesign ? undefined : "none",
              ...(!isClassicDesign
                ? {
                    "&:hover": {
                      background: "color-mix(in oklab, var(--color-primary) 90%, var(--color-base-content))",
                      boxShadow: "none",
                    },
                  }
                : {}),
              "@media(max-width: 640px)": {
                minWidth: isClassicDesign ? "141px" : "126px",
                padding: "0 12px",
                fontSize: isClassicDesign ? "14px" : "12px",
              },
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
