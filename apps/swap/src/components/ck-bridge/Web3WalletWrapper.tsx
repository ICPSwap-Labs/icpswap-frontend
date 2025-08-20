import { Box, Typography, useTheme } from "components/Mui";
import { Web3ButtonConnector } from "components/web3/index";
import { useTranslation } from "react-i18next";
import { Flex } from "@icpswap/ui";
import { useAccount } from "wagmi";
import { DisconnectButton } from "components/ck-bridge/Disconnect";

export function Web3WalletWrapper() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { address } = useAccount();

  return (
    <Box
      sx={{
        width: "100%",
        padding: "20px 16px",
        background: theme.palette.background.level3,
        borderRadius: "16px",
      }}
    >
      <Flex gap="0 4px">
        <Typography>{t("ck.wallet.metamask")}</Typography>
      </Flex>

      <Box sx={{ margin: "10px 0 0 0" }}>
        {address ? (
          <Flex
            fullWidth
            justify="space-between"
            sx={{
              "@media(max-width: 640px)": {
                flexDirection: "column",
                gap: "10px",
                alignItems: "flex-start",
              },
            }}
          >
            <Typography sx={{ fontSize: "16px", color: "text.primary", wordBreak: "break-all" }}>{address}</Typography>
            <DisconnectButton />
          </Flex>
        ) : (
          <Web3ButtonConnector />
        )}
      </Box>
    </Box>
  );
}
